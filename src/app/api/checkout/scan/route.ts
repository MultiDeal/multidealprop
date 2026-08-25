import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Clé secrète Stripe introuvable dans Vercel.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const { city, state, email } = await req.json();

    const priceId = process.env.STRIPE_PRICE_ID_CITY_499;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Variable STRIPE_PRICE_ID_CITY_499 manquante dans Vercel.' },
        { status: 400 }
      );
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
      mode: 'payment',
      customer_email: email || undefined,
      metadata: {
        city: city || '',
        state: state || '',
      },
      success_url: `${origin}/request-city?success=true&city=${encodeURIComponent(city || '')}&state=${encodeURIComponent(state || '')}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/request-city?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Scan Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
