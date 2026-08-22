import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, target_location, state } = await request.json();

    if (!email || !target_location) {
      return NextResponse.json({ error: 'Email and location are required' }, { status: 400 });
    }

    const fullLocation = state ? `${target_location}, ${state}` : target_location;

    // 1. Enregistrement dans Supabase
    await supabase.from('leads').insert([{
      email,
      interested_in: `On-Demand Scan Order ($4.99): ${fullLocation}`
    }]);

    // 2. Notification Admin Resend
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
          subject: `💳 Demande de Scan Payant ($4.99) : ${fullLocation}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0B0F19; color: #ffffff; padding: 24px; border-radius: 12px;">
              <h2 style="color: #10B981; margin-top: 0;">💰 Nouvelle Commande On-Demand Scan ($4.99) !</h2>
              <p style="color: #94A3B8; font-size: 14px;">Un investisseur demande un scan algorithmique pour une zone spécifique.</p>
              
              <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 6px 0; font-size: 14px;"><strong>Marché / Comté ciblé :</strong> <span style="color: #FBBF24; font-weight: bold;">${fullLocation}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Email de l'acheteur :</strong> <span style="color: #38BDF8;">${email}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Montant facturé :</strong> $4.99 USD</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
              </div>

              <p style="font-size: 12px; color: #64748B;">MultiDealProp Revenue Engine</p>
            </div>
          `
        })
      });
    }

    // 3. Gestion Stripe si configuré
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
          'line_items[0][price_data][unit_amount]': '499',
          'line_items[0][price_data][product_data][name]': `Deep Market & Off-Market Scan: ${fullLocation}`,
          'line_items[0][price_data][product_data][description]': 'Instant MLS, foreclosure comps, and Airbnb yield audit for this county/city.',
          'line_items[0][quantity]': '1',
          'mode': 'payment',
          'customer_email': email,
          'success_url': `https://multidealprop.com/?scan_success=true&location=${encodeURIComponent(fullLocation)}`,
          'cancel_url': 'https://multidealprop.com/',
        }).toString(),
      });

      const session = await stripeRes.json();
      if (session.url) {
        return NextResponse.json({ url: session.url });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Scan Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
