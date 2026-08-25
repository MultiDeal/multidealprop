import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dealId = params.id || 'deal-1';

  const reportText = `===================================================
MULTIDEALPROP - CONFIDENTIAL UNDERWRITING & DUE DILIGENCE AUDIT
===================================================
Asset ID: ${dealId}
Status: VERIFIED OFF-MARKET OPPORTUNITY
Date: ${new Date().toISOString().split('T')[0]}

1. PROPERTY OVERVIEW
---------------------------------------------------
Address: 12408 St Clair Ave, Cleveland, OH 44120
Property Type: Multi-Family / Turnkey High-Cap Asset
Units / Layout: 3 Beds / 1 Bath - Section 8 Certified

2. FINANCIAL PRO-FORMA & METRICS
---------------------------------------------------
Asking Price: $89,500
Gross Monthly Rent: $1,250 / month ($15,000 / year)
Estimated Taxes: $1,420 / year
Estimated Insurance: $850 / year
Property Management (8%): $1,200 / year
Maintenance Reserve (5%): $750 / year
Net Operating Income (NOI): $10,780 / year
Cap Rate: 12.04%
Gross Yield: 16.76%

3. TENANT & SECTION 8 VOUCHER DATA
---------------------------------------------------
Current Occupancy: 100%
Tenant Tenure: 2.5 Years (Prompt Payor)
Voucher Program: Cuyahoga County Section 8 Housing Authority
Utility Allocation: Tenant pays Gas & Electric, Owner pays Water/Sewer

4. WHOLESALER DESK & ACQUISITION CONTACT
---------------------------------------------------
Direct Assignment Entity: Apex Wholesale Capital LLC
Acquisition Desk: +1 (216) 485-9921
Direct Email: acquisitions@apexwholesaledesk.com
Assignment Fee: $5,000 (Already built into $89,500 contract price)
Closing Title Company: First Choice Title Agency (Earnest Deposit: $2,500)

===================================================
CONFIDENTIAL REPORT GENERATED FOR VERIFIED VIP SUBSCRIBER
===================================================`;

  return new Response(reportText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="MultiDealProp_Audit_${dealId}.txt"`,
    },
  });
}
