import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { plan, email } = await req.json();

    const isStarter = plan === 'starter_29' || plan === 'starter';
    const amount = isStarter ? 2900 : 4900;
    const planName = isStarter ? 'MultiDealProp Pro Starter' : 'MultiDealProp VIP Elite';
    const tierParam = isStarter ? 'starter' : 'vip';

    const origin = req.headers.get('origin') || 'https://www.multidealprop.com';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: isStarter 
                ? 'Direct Wholesaler Lines + Complete Pro-Forma Diligence' 
                : '48h Exclusivity Window + 5 Custom Market Scans + Direct Contact Desk',
            },
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        plan_tier: tierParam,
      },
      subscription_data: {
        metadata: {
          plan_tier: tierParam,
        },
      },
      success_url: `${origin}/deals?tier=${tierParam}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/vip?canceled=true`,
    };

    if (email) {
      sessionParams.customer_email = email.trim().toLowerCase();
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
