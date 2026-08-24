import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { plan, email } = await req.json();

    let priceId = '';
    if (plan === 'starter_29' || plan === 'pro') {
      priceId = process.env.STRIPE_PRICE_ID_29 || '';
    } else if (plan === 'vip_49' || plan === 'vip' || plan === 'elite') {
      priceId = process.env.STRIPE_PRICE_ID_49 || '';
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Stripe Price ID is missing or invalid' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://multidealprop.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email || undefined,
      metadata: {
        plan,
      },
      success_url: `${origin}/vip?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/vip?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe VIP Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
