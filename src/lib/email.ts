import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = 'MultiDealProp <deals@multidealprop.com>';

export async function sendWelcomeEmail({
  email,
  tier,
}: {
  email: string;
  tier: 'starter' | 'vip';
}) {
  const isVip = tier === 'vip';
  const planName = isVip ? 'VIP Elite Plan ($49/mo)' : 'Pro Starter Plan ($29/mo)';

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070b14; color: #f8fafc; margin: 0; padding: 24px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
      .badge { display: inline-block; padding: 4px 12px; background-color: ${isVip ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: ${isVip ? '#fbbf24' : '#34d399'}; border: 1px solid ${isVip ? '#f59e0b' : '#10b981'}; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
      h1 { color: #ffffff; font-size: 22px; margin-top: 16px; }
      p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
      .box { background-color: #131d36; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #1e293b; }
      .btn { display: inline-block; background-color: #10b981; color: #070b14; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin-top: 12px; }
      .footer { margin-top: 32px; font-size: 11px; color: #64748b; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <span class="badge">✓ ${planName} Active</span>
      <h1>Welcome to MultiDealProp Intelligence Desk</h1>
      <p>Your monthly subscription is officially confirmed. You now have full access to verified off-market deals, financial audits, and direct wholesaler contacts.</p>
      
      <div class="box">
        <strong style="color: #ffffff; font-size: 13px;">Unlocked Member Privileges:</strong>
        <ul style="color: #cbd5e1; font-size: 13px; padding-left: 20px; margin-top: 8px;">
          <li>Exact street addresses & direct wholesaler contact details</li>
          <li>Full institutional Due Diligence PDF audit vaults</li>
          <li>Fast-track 1-click Letter of Intent (LOI) generator</li>
          ${isVip ? '<li style="color: #fbbf24; font-weight: bold;">5 Free On-Demand Custom City Scans per month</li>' : ''}
          ${isVip ? '<li style="color: #fbbf24; font-weight: bold;">48-Hour Priority Exclusive Access Window on new listings</li>' : ''}
        </ul>
      </div>

      <center>
        <a href="https://www.multidealprop.com/deals" class="btn">ACCESS LIVE DEALS FEED →</a>
      </center>

      <div class="footer">
        MultiDealProp Inc. • Real Estate Intelligence Desk
      </div>
    </div>
  </body>
  </html>
  `;

  return await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: `[Active] Welcome to MultiDealProp - ${isVip ? 'VIP Elite' : 'Pro Starter'} Access Granted`,
    html,
  });
}
