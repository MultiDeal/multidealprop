import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;
    const plan = body?.plan || 'starter'; // 'starter', 'vip_monthly', 'vip_annual'

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    let amount = 2900; // $29.00 USD
    let planName = 'MultiDealProp Starter ($29/mo)';
    let planDesc = '0-Day real-time deal access, unlocked seller phone numbers, and 10 PDF due diligence packs/month.';

    if (plan === 'vip_annual') {
      amount = 49900; // $499.00 USD
      planName = 'MultiDealProp VIP Pro (Annual $499/yr)';
      planDesc = 'Unlimited PDF audits, instant SMS/WhatsApp alerts for Cap Rates > 12%, and 3 free county scans included.';
    } else if (plan === 'vip_monthly' || plan === 'vip') {
      amount = 4900; // $49.00 USD
      planName = 'MultiDealProp VIP Pro ($49/mo)';
      planDesc = 'Unlimited PDF audits, instant SMS/WhatsApp alerts for Cap Rates > 12%, and 3 free county scans included.';
    }

    // 1. Enregistrement du lead dans Supabase
    await supabase.from('leads').insert([{
      email,
      interested_in: `Subscription Checkout: ${planName}`
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
          subject: `👑 NOUVEL ABONNEMENT EN COURS (${planName}) : ${email}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #070A10; color: #ffffff; padding: 24px; border-radius: 12px;">
              <h2 style="color: #10B981;">🚀 Nouvelle Commande d'Abonnement SaaS !</h2>
              <p>Un investisseur a validé le paiement pour :</p>
              <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p><strong>Email :</strong> <span style="color: #38BDF8;">${email}</span></p>
                <p><strong>Forfait :</strong> <span style="color: #FBBF24;">${planName}</span></p>
                <p><strong>Montant :</strong> $${(amount / 100).toFixed(2)} USD</p>
                <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
              </div>
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
          'line_items[0][price_data][product_data][description]': planDesc,
          'line_items[0][quantity]': '1',
          'mode': 'payment',
          'customer_email': email,
          'success_url': 'https://multidealprop.com/vip?success=true',
          'cancel_url': 'https://multidealprop.com/vip',
        }).toString(),
      });

      const session = await stripeRes.json();
      if (session && session.url) {
        return NextResponse.json({ url: session.url });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('VIP Checkout Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
