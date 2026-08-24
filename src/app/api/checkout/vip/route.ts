import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Clé secrète Stripe introuvable. Vérifiez STRIPE_SECRET_KEY dans Vercel.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const { plan, email } = await req.json();

    let priceId = '';
    if (plan === 'starter_29' || plan === 'pro') {
      priceId = process.env.STRIPE_PRICE_ID_29 || '';
    } else if (plan === 'vip_49' || plan === 'vip' || plan === 'elite') {
      priceId = process.env.STRIPE_PRICE_ID_49 || '';
    }

    if (!priceId) {
      return NextResponse.json(
        { error: `ID de tarif manquant pour le forfait: ${plan}. Vérifiez STRIPE_PRICE_ID_29 ou STRIPE_PRICE_ID_49 dans Vercel.` },
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
      mode: 'subscription',
      customer_email: email || undefined,
      metadata: {
        plan: plan || 'starter_29',
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