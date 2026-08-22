import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { deal } = await request.json();

    if (!deal || !deal.title || !deal.price) {
      return NextResponse.json({ error: 'Deal data is required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY missing' }, { status: 500 });
    }

    // 1. Récupérer tous les emails des abonnés VIP dans Supabase
    const { data: vipUsers, error: fetchError } = await supabase
      .from('leads')
      .select('email')
      .ilike('interested_in', '%VIP%');

    if (fetchError) {
      console.error('Error fetching VIP leads:', fetchError);
    }

    // Liste des destinataires uniques
    const recipientEmails = Array.from(
      new Set((vipUsers || []).map((u: any) => u.email).filter(Boolean))
    );

    if (recipientEmails.length === 0) {
      return NextResponse.json({ message: 'No VIP recipients found.' });
    }

    const capRate = deal.cap_rate || 12.0;
    const monthlyRent = deal.monthly_rent_estimate || 1800;
    const priceFormatted = Number(deal.price).toLocaleString();
    const dealUrl = `https://multidealprop.com/deals/${deal.id}`;

    // 2. Envoi groupé de l'alerte VIP par Resend
    const emailPromises = recipientEmails.map((email: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'MultiDealProp VIP Alerts <alerts@multidealprop.com>',
          to: email,
          subject: `🔥 VIP DEAL DROP (${capRate}% Cap Rate): ${deal.title} - $${priceFormatted}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="background-color: #070A10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FFFFFF; padding: 24px; margin: 0;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #0F172A; border: 1px solid #10B981; border-radius: 16px; overflow: hidden;">
                
                <div style="background: linear-gradient(135deg, #059669, #10B981); padding: 18px 24px; text-align: left;">
                  <span style="background-color: rgba(0,0,0,0.3); color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">
                    ⚡ 0-Day Priority VIP Alert
                  </span>
                  <h1 style="color: #FFFFFF; font-size: 22px; margin: 8px 0 0 0; font-weight: 900;">
                    ${capRate}% Cap Rate Opportunity Detected
                  </h1>
                </div>

                <div style="padding: 24px;">
                  ${deal.image_url ? `
                    <div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden; max-height: 240px;">
                      <img src="${deal.image_url}" alt="${deal.title}" style="width: 100%; height: auto; display: block; object-fit: cover;" />
                    </div>
                  ` : ''}

                  <h2 style="font-size: 18px; color: #F8FAFC; margin-top: 0;">${deal.title}</h2>
                  <p style="color: #94A3B8; font-size: 13px; margin: 0 0 18px 0;">📍 ${deal.city || 'US Market'}, ${deal.state || ''} ${deal.zip_code || ''}</p>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background-color: #070A10; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
                    <div>
                      <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block;">List Price</span>
                      <span style="color: #FFFFFF; font-size: 18px; font-weight: bold;">$${priceFormatted}</span>
                    </div>
                    <div>
                      <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block;">Cap Rate</span>
                      <span style="color: #10B981; font-size: 18px; font-weight: bold;">${capRate}%</span>
                    </div>
                    <div style="margin-top: 8px;">
                      <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block;">Est. Monthly Rent</span>
                      <span style="color: #38BDF8; font-size: 15px; font-weight: bold;">$${Number(monthlyRent).toLocaleString()} / mo</span>
                    </div>
                    <div style="margin-top: 8px;">
                      <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block;">Strategy</span>
                      <span style="color: #F43F5E; font-size: 15px; font-weight: bold;">Plex / Section 8 / STR</span>
                    </div>
                  </div>

                  <div style="text-align: center;">
                    <a href="${dealUrl}" style="background-color: #10B981; color: #000000; font-size: 14px; font-weight: 900; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
                      Unlock Direct Seller Details & Rent Roll →
                    </a>
                  </div>

                  <p style="color: #64748B; font-size: 11px; text-align: center; margin-top: 24px;">
                    You are receiving this instant drop because you are an active MultiDealProp VIP Pro member.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        })
      )
    );

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      notified_count: recipientEmails.length
    });

  } catch (error: any) {
    console.error('VIP Drop Alert Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
