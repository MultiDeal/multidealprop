import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deal = body?.deal;

    if (!deal || !deal.title || !deal.price) {
      return NextResponse.json({ error: 'Deal data is required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // 1. Récupérer les leads VIP depuis Supabase
    const { data: vipUsers, error: fetchError } = await supabase
      .from('leads')
      .select('email, phone')
      .ilike('interested_in', '%VIP%');

    if (fetchError) {
      return NextResponse.json({ error: 'Supabase error: ' + fetchError.message }, { status: 500 });
    }

    const emails: string[] = [];
    const phones: string[] = [];

    if (vipUsers && Array.isArray(vipUsers)) {
      for (const item of vipUsers) {
        if (item?.email && !emails.includes(item.email)) {
          emails.push(item.email);
        }
        if (item?.phone && !phones.includes(item.phone)) {
          phones.push(item.phone);
        }
      }
    }

    const capRate = deal.cap_rate ?? 12.0;
    const priceFormatted = Number(deal.price).toLocaleString();
    const monthlyRent = deal.monthly_rent_estimate ?? 1800;
    const dealUrl = `https://multidealprop.com/deals/${deal.id || ''}`;

    const debugLogs: any = {
      supabase_vip_count: vipUsers?.length || 0,
      emails_found: emails,
      phones_found: phones,
      twilio_configured: Boolean(accountSid && authToken && fromNumber),
      resend_configured: Boolean(resendApiKey),
      twilio_responses: [],
      resend_responses: []
    };

    // 2. Test d'envoi SMS Twilio
    if (accountSid && authToken && fromNumber && phones.length > 0) {
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      for (const phone of phones) {
        let formattedPhone = phone.trim().replace(/[^0-9+]/g, '');
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+' + formattedPhone;
        }

        const messageBody = `🔥 MULTIDEALPROP VIP DROP (${capRate}% Cap Rate)\n\n📍 ${deal.city || 'Market'}, ${deal.state || ''}\n💰 Price: $${priceFormatted}\n👉 View: ${dealUrl}`;

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

    // 3. Test d'envoi Email Resend
    if (resendApiKey && emails.length > 0) {
      for (const email of emails) {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'MultiDealProp <onboarding@resend.dev>',
            to: email,
            subject: `🔥 VIP DEAL DROP (${capRate}% Cap Rate): ${deal.title}`,
            html: `<p>Test VIP Deal Drop: <strong>${deal.title}</strong> ($${priceFormatted})</p><a href="${dealUrl}">Voir le deal</a>`
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
