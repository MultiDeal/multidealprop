import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    // Vérification de la signature si le secret est configuré
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      // Mode fallback (sans signature)
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    // Gestion des événements Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout session completed:', session.id);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('✅ Subscription active/updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('⚠️ Subscription canceled:', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Réponse obligatoire 200 OK pour Stripe
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
