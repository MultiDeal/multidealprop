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
    const { propertyId, address, email } = await req.json();

    const origin = req.headers.get('origin') || 'https://www.multidealprop.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Institutional Underwriting Memo Access',
              description: 'Instant full property pro-forma, DSCR loan covenants & IRS depreciation schedule.',
            },
            unit_amount: 999, // 999 cents = 9.99 $ USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Paiement unique (one-time, pas d'abonnement)
      customer_email: email ? email.trim().toLowerCase() : undefined,
      metadata: {
        propertyId: propertyId || '',
        address: address || '',
      },
      success_url: `${origin}/deals?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/deals?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
