import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function sendTwilioSms(toPhone: string, deal: any) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toPhone) return;

  const capRate = deal.cap_rate ?? 12.0;
  const price = Number(deal.price).toLocaleString();
  const rent = Number(deal.monthly_rent_estimate ?? 1800).toLocaleString();
  const dealUrl = `https://multidealprop.com/deals/${deal.id || ''}`;

  const messageBody = `🔥 MULTIDEALPROP VIP DROP (${capRate}% Cap Rate)\n\n` +
    `📍 ${deal.city || 'US Market'}, ${deal.state || ''}\n` +
    `💰 Price: $${price} | Est. Rent: $${rent}/mo\n\n` +
    `👉 View Deal & Seller Info:\n${dealUrl}`;

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: toPhone,
      From: fromNumber,
      Body: messageBody,
    }).toString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deal = body?.deal;

    if (!deal || !deal.title || !deal.price) {
      return NextResponse.json({ error: 'Deal data is required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Récupérer les leads VIP avec email et téléphone éventuel
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

    // 3. Envoi des Emails via Resend
    if (resendApiKey && emails.length > 0) {
      const emailPromises = emails.map((recipient: string) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'MultiDealProp VIP Alerts <alerts@multidealprop.com>',
            to: recipient,
            subject: `🔥 VIP DEAL DROP (${capRate}% Cap Rate): ${deal.title} - $${priceFormatted}`,
            html: `
              <!DOCTYPE html>
              <html>
              <body style="background-color: #070A10; font-family: Arial, sans-serif; color: #FFFFFF; padding: 24px; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #0F172A; border: 1px solid #10B981; border-radius: 16px; overflow: hidden;">
                  <div style="background: #10B981; padding: 18px 24px;">
                    <span style="background-color: rgba(0,0,0,0.3); color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">
                      ⚡ Priority VIP Alert
                    </span>
                    <h1 style="color: #000000; font-size: 20px; margin: 8px 0 0 0; font-weight: 900;">
                      ${capRate}% Cap Rate Opportunity
                    </h1>
                  </div>

                  <div style="padding: 24px;">
                    ${deal.image_url ? `<div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden;"><img src="${deal.image_url}" alt="${deal.title}" style="width: 100%; height: auto; display: block;" /></div>` : ''}

                    <h2 style="font-size: 18px; color: #FFFFFF; margin-top: 0;">${deal.title}</h2>
                    <p style="color: #94A3B8; font-size: 13px; margin-bottom: 18px;">📍 ${deal.city || ''}, ${deal.state || ''} ${deal.zip_code || ''}</p>

                    <div style="background-color: #070A10; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
                      <p style="margin: 4px 0; font-size: 14px;"><strong>List Price :</strong> $${priceFormatted}</p>
                      <p style="margin: 4px 0; font-size: 14px; color: #10B981;"><strong>Cap Rate :</strong> ${capRate}%</p>
                      <p style="margin: 4px 0; font-size: 14px; color: #38BDF8;"><strong>Est. Monthly Rent :</strong> $${Number(monthlyRent).toLocaleString()} / mo</p>
                    </div>

                    <div style="text-align: center;">
                      <a href="${dealUrl}" style="background-color: #10B981; color: #000000; font-size: 14px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                        View Unlocked Deal →
                      </a>
                    </div>
                  </div>
                </div>
              </body>
              </html>
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
