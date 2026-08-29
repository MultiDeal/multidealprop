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
  <title>Your MultiDealProp Membership Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #f8fafc;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#070b14">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!--[if mso]>
        <table width="600" border="0" cellspacing="0" cellpadding="0">
        <tr>
        <td>
        <![endif]-->
        
        <div style="max-width: 620px; margin: 0 auto; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 16px; padding: 36px 28px; box-sizing: border-box; text-align: left;">
          
          <!-- Status Badge -->
          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 14px; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 9999px;">
                <span style="color: ${badgeColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block;">
                  ✓ ${planName} — Active
                </span>
              </td>
            </tr>
          </table>

          <!-- Main Heading -->
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.3;">
            Welcome to MultiDealProp Intelligence Desk
          </h1>

          <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 16px 0;">
            Hello,
          </p>

          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 20px 0;">
            Thank you for subscribing to MultiDealProp. Your transaction has been processed securely via Stripe, and your membership account is now fully active. You have been granted immediate access to our real-time portal of verified off-market multifamily and commercial investment opportunities.
          </p>

          <!-- What is Included Box -->
          <div style="background-color: #131d36; border-radius: 12px; padding: 22px; margin: 24px 0; border: 1px solid #1e293b;">
            <strong style="color: #ffffff; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">
              Summary of Your Membership Benefits:
            </strong>
            <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Unmasked Deal Data:</strong> Full physical addresses, parcel numbers (APN), and exact building coordinates.</li>
              <li><strong>Direct Wholesaler Desk:</strong> Verified phone numbers and direct email addresses of listing assignors with zero middleman markups.</li>
              <li><strong>Due Diligence Vault:</strong> Full pro-forma projections, estimated Cap Rates, cash-on-cash return estimates, and current rent rolls.</li>
              <li><strong>1-Click LOI Generator:</strong> Generate pre-filled, professional Letter of Intent contracts ready to send immediately.</li>
              ${isVip ? '<li style="color: #fbbf24; font-weight: bold;">5 Monthly Custom Scans: Request on-demand city or county scans directly with our acquisition desk.</li>' : ''}
              ${isVip ? '<li style="color: #fbbf24; font-weight: bold;">48-Hour Exclusive Window: First-look advantage on newly contracted properties before they become public.</li>' : ''}
            </ul>
          </div>

          <!-- Quick Start Guide -->
          <h2 style="color: #ffffff; font-size: 17px; font-weight: 700; margin: 28px 0 12px 0;">
            How to Get Started in 3 Simple Steps
          </h2>

          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 10px 0;">
            <strong style="color: #10b981;">Step 1: Explore the Live Inventory</strong><br/>
            Browse our curated deals catalog. Filter by property type, entry price, Cap Rate, or target geographic market.
          </p>

          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 10px 0;">
            <strong style="color: #10b981;">Step 2: Review Institutional Due Diligence</strong><br/>
            Open any listing page to inspect the detailed financial underwriting, rent potential, estimated rehab requirements, and neighborhood market benchmarks.
          </p>

          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 24px 0;">
            <strong style="color: #10b981;">Step 3: Connect & Submit an LOI</strong><br/>
            Use the built-in direct wholesaler contact button or export your custom Letter of Intent to secure contract assignment rights quickly.
          </p>

          <!-- Primary CTA Button -->
          <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin: 32px 0 24px 0;">
            <tr>
              <td align="center">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" bgcolor="#10b981" style="border-radius: 10px;">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.multidealprop.com/deals" target="_blank" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="20%" stroke="f" fillcolor="#10b981">
                        <w:anchorlock/>
                        <center>
                      <![endif]-->
                          <a href="https://www.multidealprop.com/deals" target="_blank" style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 800; color: #070b14; text-decoration: none; padding: 16px 36px; border-radius: 10px; display: inline-block; letter-spacing: 0.5px; mso-padding-alt:0; -webkit-text-size-adjust:none;">
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

          <!-- Direct Link Fallback -->
          <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0 0 28px 0; line-height: 1.5;">
            Direct platform access URL:<br/>
            <a href="https://www.multidealprop.com/deals" target="_blank" style="color: #10b981; text-decoration: underline;">
              https://www.multidealprop.com/deals
            </a>
          </p>

          <!-- Subscription & Support Policy -->
          <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 28px;">
            <h3 style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">
              Subscription & Account Support
            </h3>
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0 0 8px 0;">
              Your subscription will automatically renew each month unless cancelled. You can manage, update payment methods, or cancel your subscription at any time directly through your billing portal.
            </p>
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0;">
              Need assistance or have specific market sourcing questions? Reply directly to this email or reach out to our acquisition desk at <a href="mailto:deals@multidealprop.com" style="color: #94a3b8; text-decoration: underline;">deals@multidealprop.com</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="margin-top: 28px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 11px; color: #475569; text-align: center;">
            MultiDealProp Inc. • Real Estate Intelligence & Deal Flow Portal<br/>
            This is a transactional confirmation email regarding your active account.
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
