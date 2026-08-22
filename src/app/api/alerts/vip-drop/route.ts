import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function sendTwilioSms(toPhone: string, deal: any) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toPhone) return;

  // Assurer le format international E.164 (+1...)
  let formattedPhone = toPhone.trim().replace(/[^0-9+]/g, '');
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone;
  }

  const capRate = deal.cap_rate ?? 12.0;
  const price = Number(deal.price).toLocaleString();
  const rent = Number(deal.monthly_rent_estimate ?? 1800).toLocaleString();
  const dealUrl = `https://multidealprop.com/deals/${deal.id || ''}`;

  const messageBody = `🔥 MULTIDEALPROP VIP DROP (${capRate}% Cap Rate)\n\n` +
    `📍 ${deal.city || 'US Market'}, ${deal.state || ''}\n` +
    `💰 Price: $${price} | Est. Rent: $${rent}/mo\n\n` +
    `👉 View Deal:\n${dealUrl}`;

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
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

  const twilioData = await res.json();
  if (twilioData.error_message) {
    console.error('Twilio SMS Error:', twilioData.error_message);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deal = body?.deal;

    if (!deal || !deal.title || !deal.price) {
      return NextResponse.json({ error: 'Deal data is required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Récupérer les leads VIP
    const { data: vipUsers, error: fetchError } = await supabase
      .from('leads')
      .select('email, phone')
      .ilike('interested_in', '%VIP%');

    if (fetchError) {
      console.error('Error fetching VIP leads:', fetchError);
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
    const monthlyRent = deal.monthly_rent_estimate ?? 1800;
    const priceFormatted = Number(deal.price).toLocaleString();
    const dealUrl = `https://multidealprop.com/deals/${deal.id || ''}`;

    // 2. Envoi des SMS via Twilio
    const smsPromises = phones.map((p) => sendTwilioSms(p, deal).catch(err => console.error('SMS Error:', err)));
    await Promise.all(smsPromises);

    // 3. Envoi des Emails via Resend (utilise le sender autorisé)
    if (resendApiKey && emails.length > 0) {
      const emailPromises = emails.map((recipient: string) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'MultiDealProp VIP <onboarding@resend.dev>',
            to: recipient,
            subject: `🔥 VIP DEAL DROP (${capRate}% Cap Rate): ${deal.title} - $${priceFormatted}`,
            html: `
              <div style="background-color: #070A10; font-family: Arial, sans-serif; color: #FFFFFF; padding: 24px; border-radius: 12px;">
                <div style="background: #10B981; padding: 16px; border-radius: 8px;">
                  <h1 style="color: #000000; font-size: 20px; margin: 0; font-weight: 900;">
                    ⚡ ${capRate}% Cap Rate Opportunity Detected
                  </h1>
                </div>
                <div style="padding: 20px 0;">
                  <h2 style="color: #FFFFFF; margin: 0 0 10px 0;">${deal.title}</h2>
                  <p style="color: #94A3B8; margin: 0 0 15px 0;">📍 ${deal.city || 'Market'}, ${deal.state || ''} ${deal.zip_code || ''}</p>
                  <p style="font-size: 16px;"><strong>Prix :</strong> $${priceFormatted} | <strong>Loyer estimé :</strong> $${Number(monthlyRent).toLocaleString()} / mo</p>
                  <a href="${dealUrl}" style="background-color: #10B981; color: #000000; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block; margin-top: 15px;">
                    Voir la fiche complète →
                  </a>
                </div>
              </div>
            `
          })
        })
      );
      await Promise.all(emailPromises);
    }

    return NextResponse.json({
      success: true,
      notified_emails: emails.length,
      notified_sms: phones.length
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('VIP Drop Alert Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
