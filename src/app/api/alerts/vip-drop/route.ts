import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deal = body?.deal;

    if (!deal || !deal.title || !deal.price) {
      return NextResponse.json({ error: 'Deal data is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // 1. Récupération de tous les leads
    const { data: allLeads, error: fetchError } = await supabaseAdmin
      .from('leads')
      .select('email, phone, interested_in');

    const emails: string[] = [];
    const phones: string[] = [];

    if (allLeads && Array.isArray(allLeads)) {
      for (const item of allLeads) {
        const isVip = item.interested_in && /vip/i.test(item.interested_in);
        if (isVip || allLeads.length <= 5) { // Prend les VIP ou fallback sur les premiers si test
          if (item?.email && !emails.includes(item.email)) {
            emails.push(item.email);
          }
          if (item?.phone && !phones.includes(item.phone)) {
            phones.push(item.phone);
          }
        }
      }
    }

    // Fallback de sécurité pour le test si la table est vide
    if (phones.length === 0) {
      phones.push('+18192120136');
    }
    if (emails.length === 0) {
      emails.push('prosebmail@gmail.com');
    }

    const capRate = deal.cap_rate ?? 12.0;
    const priceFormatted = Number(deal.price).toLocaleString();
    const dealUrl = `https://multidealprop.com/deals/${deal.id || ''}`;

    const debugLogs: any = {
      supabase_total_leads: allLeads?.length || 0,
      supabase_fetch_error: fetchError ? fetchError.message : null,
      target_emails: emails,
      target_phones: phones,
      twilio_responses: [],
      resend_responses: []
    };

    // 2. Envoi SMS Twilio
    if (accountSid && authToken && fromNumber) {
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      for (const phone of phones) {
        let formattedPhone = phone.trim().replace(/[^0-9+]/g, '');
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+' + formattedPhone;
        }

        const messageBody = `🚨 MULTIDEALPROP VIP ALERT (${capRate}% Cap Rate)\n\n📍 ${deal.city || 'Market'}, ${deal.state || ''}\n💰 Price: $${priceFormatted}\n👉 View Deal:\n${dealUrl}`;

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: formattedPhone,
            From: fromNumber,
            Body: messageBody,
          }).toString(),
        });

        const twilioJson = await twilioRes.json();
        debugLogs.twilio_responses.push({
          phone: formattedPhone,
          status: twilioRes.status,
          response: twilioJson
        });
      }
    }

    // 3. Envoi Courriel Resend
    if (resendApiKey) {
      for (const email of emails) {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'MultiDealProp VIP <onboarding@resend.dev>',
            to: email,
            subject: `🔥 VIP DEAL DROP (${capRate}% Cap Rate): ${deal.title}`,
            html: `
              <div style="background-color: #070A10; font-family: Arial, sans-serif; color: #FFFFFF; padding: 24px; border-radius: 12px;">
                <h2 style="color: #10B981; margin: 0 0 12px 0;">⚡ ${capRate}% Cap Rate - VIP Drop</h2>
                <p><strong>${deal.title}</strong></p>
                <p>Prix : <strong>$${priceFormatted}</strong></p>
                <p>Emplacement : ${deal.city || 'Market'}, ${deal.state || ''}</p>
                <a href="${dealUrl}" style="background-color: #10B981; color: #000; font-weight: bold; padding: 10px 20px; border-radius: 6px; display: inline-block; text-decoration: none; margin-top: 15px;">
                  Voir le Deal Débloqué →
                </a>
              </div>
            `
          })
        });

        const resendJson = await resendRes.json();
        debugLogs.resend_responses.push({
          email,
          status: resendRes.status,
          response: resendJson
        });
      }
    }

    return NextResponse.json({
      success: true,
      debug: debugLogs
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
