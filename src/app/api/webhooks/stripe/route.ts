import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const tier = session.metadata?.plan_tier || 'starter';
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (customerEmail && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

          await supabaseAdmin.from('subscriptions').upsert({
            email: customerEmail.toLowerCase().trim(),
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_tier: tier,
            status: 'active',
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        const status = subscription.status === 'active' ? 'active' : 'inactive';
        const tier = subscription.metadata?.plan_tier || 'starter';

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: status,
            plan_tier: tier,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error handling webhook event:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
