import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { city, state, email } = await req.json();

    const priceId = process.env.STRIPE_PRICE_ID_CITY_499 || '';

    if (!priceId) {
      return NextResponse.json({ error: 'City Scan Price ID is missing in environment variables' }, { status: 400 });
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
      mode: 'payment', // Paiement unique
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
