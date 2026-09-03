import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
  try {
    const { dealAddress, returnUrl } = await request.json();

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.multidealprop.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Institutional Lender Diligence Deal Memo (PDF)',
              description: `Audit financier complet, ratios DSCR & calendrier d'amortissement 30 ans pour : ${dealAddress || 'Property Analysis'}`,
            },
            unit_amount: 999, // 9.99 $ USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl || origin + '/deals/analyzer'}?memo_paid=true`,
      cancel_url: `${returnUrl || origin + '/deals/analyzer'}?memo_canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erreur Stripe Checkout:', err);
    return NextResponse.json({ error: err.message || 'Erreur interne' }, { status: 500 });
  }
}
