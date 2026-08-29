import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendWelcomeEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    // Signature verification
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    // Handle Stripe Events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const planTier = (session.metadata?.tier as 'starter' | 'vip') || 'starter';

        console.log(`✅ Checkout completed for ${customerEmail} (Tier: ${planTier})`);

        // Send transactional welcome email via Resend
        if (customerEmail) {
          try {
            await sendWelcomeEmail({
              email: customerEmail,
              tier: planTier,
            });
            console.log(`✉️ Welcome email dispatched to ${customerEmail}`);
          } catch (emailErr: any) {
            console.error('Failed to send welcome email:', emailErr.message);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
