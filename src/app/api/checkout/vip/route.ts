import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const isAnnual = plan === 'annual';
    const amount = isAnnual ? 49900 : 4900; // $499.00 or $49.00 USD
    const planName = isAnnual ? 'MultiDealProp VIP Pro (Annual)' : 'MultiDealProp VIP Pro (Monthly)';

    // 1. Enregistrer dans Supabase
    await supabase.from('leads').insert([{
      email,
      interested_in: `VIP Pro Checkout: ${planName}`
    }]);

    // 2. Notification Admin par Email (Resend)
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (resendApiKey && adminEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'MultiDealProp <support@multidealprop.com>',
          to: adminEmail,
          subject: `👑 NOUVEL ABONNÉ VIP PRO (${isAnnual ? '$499/an' : '$49/mois'}) : ${email}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #070A10; color: #ffffff; padding: 24px; border-radius: 12px;">
              <h2 style="color: #10B981;">🚀 Nouvel Abonnement VIP Pro !</h2>
              <p>Un investisseur vient de souscrire à la formule VIP Pro :</p>
              <ul>
                <li><strong>Email :</strong> ${email}</li>
                <li><strong>Formule :</strong> ${planName}</li>
                <li><strong>Montant :</strong> $${isAnnual ? '499.00' : '49.00'} USD</li>
              </ul>
            </div>
          `
        })
      });
    }

    // 3. Création session Stripe Checkout
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][unit_amount]': String(amount),
          'line_items[0][price_data][product_data][name]': planName,
          'line_items[0][price_data][product_data][description]': '0-day early access to 12%+ Cap Rate duplexes, rent rolls & direct seller contacts.',
          'line_items[0][quantity]': '1',
          'mode': 'payment',
          'customer_email': email,
          'success_url': 'https://multidealprop.com/vip?success=true',
          'cancel_url': 'https://multidealprop.com/vip',
        }).toString(),
      });

      const session = await stripeRes.json();
      if (session.url) {
        return NextResponse.json({ url: session.url });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('VIP Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
