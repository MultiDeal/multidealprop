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
  const badgeBg = isVip ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';
  const badgeColor = isVip ? '#fbbf24' : '#34d399';
  const badgeBorder = isVip ? '#f59e0b' : '#10b981';

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MultiDealProp Access</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#070b14">
    <tr>
      <td align="center" style="padding: 24px;">
        <!--[if mso]>
        <table width="600" border="0" cellspacing="0" cellpadding="0">
        <tr>
        <td>
        <![endif]-->
        <div style="max-width: 600px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-sizing: border-box; text-align: left;">
          
          <!-- Status Badge -->
          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
            <tr>
              <td style="padding: 6px 14px; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 9999px;">
                <span style="color: ${badgeColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block;">
                  ✓ ${planName} Active
                </span>
              </td>
            </tr>
          </table>

          <!-- Heading -->
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
            Welcome to MultiDealProp Intelligence Desk
          </h1>

          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Your monthly subscription is officially confirmed. You now have full access to verified off-market deals, financial audits, and direct wholesaler contacts.
          </p>
          
          <!-- Privileges Box -->
          <div style="background-color: #131d36; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
            <strong style="color: #ffffff; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">
              Unlocked Member Privileges:
            </strong>
            <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Exact street addresses & direct wholesaler contact details</li>
              <li>Full institutional Due Diligence PDF audit vaults</li>
              <li>Fast-track 1-click Letter of Intent (LOI) generator</li>
              ${isVip ? '<li style="color: #fbbf24; font-weight: bold;">5 Free On-Demand Custom City Scans per month</li>' : ''}
              ${isVip ? '<li style="color: #fbbf24; font-weight: bold;">48-Hour Priority Exclusive Access Window on new listings</li>' : ''}
            </ul>
          </div>

          <!-- Bulletproof Action Button -->
          <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin: 32px 0 24px 0;">
            <tr>
              <td align="center">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" bgcolor="#10b981" style="border-radius: 10px;">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.multidealprop.com/deals" target="_blank" style="height:48px;v-text-anchor:middle;width:250px;" arcsize="20%" stroke="f" fillcolor="#10b981">
                        <w:anchorlock/>
                        <center>
                      <![endif]-->
                          <a href="https://www.multidealprop.com/deals" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 800; color: #070b14; text-decoration: none; padding: 15px 32px; border-radius: 10px; display: inline-block; letter-spacing: 0.5px; mso-padding-alt:0; -webkit-text-size-adjust:none;">
                            ACCESS LIVE DEALS FEED &rarr;
                          </a>
                      <!--[if mso]>
                        </center>
                      </v:roundrect>
                      <![endif]-->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Plan Text Link for compatibility -->
          <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0 0 24px 0;">
            Trouble clicking the button? Copy and paste this link:<br/>
            <a href="https://www.multidealprop.com/deals" target="_blank" style="color: #10b981; text-decoration: underline;">
              https://www.multidealprop.com/deals
            </a>
          </p>

          <!-- Footer -->
          <div style="margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; text-align: center;">
            MultiDealProp Inc. • Real Estate Intelligence Desk
          </div>

        </div>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
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
