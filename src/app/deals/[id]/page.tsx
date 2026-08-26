'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DealDetailsPage() {
  const params = useParams();
  const [isVip, setIsVip] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vipStatus = localStorage.getItem('multideal_vip') === 'true';
      setIsVip(vipStatus);
    }
  }, []);

  const dealId = (params?.id as string) || 'deal-1';

  const deal = {
    id: dealId,
    title: 'Renovated 3-Bed Brick Home - Section 8 Ready',
    tag: 'High-Cap Underwritten Asset',
    streetAddress: '12408 St Clair Ave',
    cityStateZip: 'Cleveland, OH 44120',
    price: '$89,500',
    arv: '$115,000',
    capRate: '12.04%',
    cashOnCash: '18.6%',
    monthlyRent: '$1,250',
    grossAnnualRent: '$15,000',
    grossYield: '16.76%',
    noi: '$10,780',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Apex Wholesale Capital LLC',
      phone: '+1 (216) 485-9921',
      email: 'acquisitions@apexwholesaledesk.com',
      assignmentFee: '$5,000 (included in purchase price)',
      titleCompany: 'First Choice Title & Escrow (EMD: $2,500)',
    },
    // Chiffres détaillés du P&L / Pro-Forma
    proforma: {
      grossIncome: 15000,
      vacancy: 750, // 5%
      effectiveGrossIncome: 14250,
      taxes: 1420,
      insurance: 850,
      management: 1200, // 8%
      maintenance: 750, // 5%
      waterSewer: 780, // $65/mo owner portion
      totalExpenses: 5000,
      noi: 10000,
      debtService: 5840, // Assuming 20% down, 7.5% 30yr amortized
      netCashFlow: 4160,
    },
    specs: {
      yearBuilt: 1952,
      rehabYear: 2024,
      sqft: '1,340 sqft',
      lotSize: '4,800 sqft',
      roof: 'Architectural Shingle (Installed 2021)',
      electrical: '100A Breaker Panel (Up to Code)',
      plumbing: 'PEX Supply & PVC Waste Lines',
      hvac: 'Forced Air High-Efficiency Furnace (2022)',
      waterHeater: '40 Gal Gas (2023)',
      tenantTenure: '2.5 Years (Cuyahoga County Voucher - Zero Default)',
    }
  };

  const handleDownloadAudit = () => {
    try {
      setDownloading(true);
      const auditContent = `================================================================================
MULTIDEALPROP - INSTITUTIONAL DUE DILIGENCE AUDIT & PRO-FORMA
================================================================================
Asset ID: ${deal.id}
Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Status: VERIFIED OFF-MARKET TRANSACTION READY
Access Tier: VIP PRO / STARTER MEMBER

--------------------------------------------------------------------------------
1. ASSET SPECIFICATIONS & LOCATION
--------------------------------------------------------------------------------
Property: ${deal.title}
Exact Address: ${deal.streetAddress}, ${deal.cityStateZip}
Asset Class: Multi-Family / Turnkey High-Yield Residential
Square Footage: ${deal.specs.sqft} | Lot: ${deal.specs.lotSize}
Rehab History: Full Rehab ${deal.specs.rehabYear} (Roof ${deal.specs.roof})
Mechanicals: Electrical: ${deal.specs.electrical} | HVAC: ${deal.specs.hvac}

--------------------------------------------------------------------------------
2. DETAILED 12-MONTH PRO-FORMA P&L STATEMENT
--------------------------------------------------------------------------------
Contract Asking Price:               ${deal.price}
Estimated After Repair Value (ARV):  ${deal.arv}
--------------------------------------------------------------------------------
(+) Gross Scheduled Rent (Annual):   $${deal.proforma.grossIncome.toLocaleString()} ($1,250/mo)
(-) Vacancy & Credit Loss (5%):      -$${deal.proforma.vacancy.toLocaleString()}
(=) Effective Gross Income:          $${deal.proforma.effectiveGrossIncome.toLocaleString()}

Operating Expenses:
  - Real Estate Taxes:               -$${deal.proforma.taxes.toLocaleString()} / year
  - Property Insurance (Hazard):     -$${deal.proforma.insurance.toLocaleString()} / year
  - Property Management (8%):        -$${deal.proforma.management.toLocaleString()} / year
  - Maintenance & CapEx (5%):        -$${deal.proforma.maintenance.toLocaleString()} / year
  - Water & Sewer (Owner Portion):   -$${deal.proforma.waterSewer.toLocaleString()} / year
--------------------------------------------------------------------------------
(=) Net Operating Income (NOI):      $${deal.proforma.noi.toLocaleString()} / year
(-) Estimated Debt Service (Leveraged): -$${deal.proforma.debtService.toLocaleString()} / year
(=) Net Cashflow (Leveraged):        $${deal.proforma.netCashFlow.toLocaleString()} / year

KEY YIELD INDICATORS:
  - Unleveraged Cap Rate:            ${deal.capRate}
  - Leveraged Cash-on-Cash Return:   ${deal.cashOnCash}
  - Debt Service Coverage (DSCR):    1.71x

--------------------------------------------------------------------------------
3. TENANT & SECTION 8 VOUCHER BREAKDOWN
--------------------------------------------------------------------------------
Occupancy Status:                    100% Occupied
Housing Authority:                   Cuyahoga County PHA Voucher (100% Direct Deposit)
Tenant History:                      ${deal.specs.tenantTenure}
Tenant Responsibilities:             Gas, Electric, Lawn Maintenance, Snow Removal
Owner Responsibilities:              Water & Sewer Escrow (~$65/mo)

--------------------------------------------------------------------------------
4. WHOLESALE CONTRACT & ASSIGNMENT DESK
--------------------------------------------------------------------------------
Direct Assignment Entity:            ${deal.wholesaler.name}
Acquisitions Desk:                   ${deal.wholesaler.phone}
Direct Email:                        ${deal.wholesaler.email}
Contract Terms:                      ${deal.wholesaler.assignmentFee}
Title / Escrow Agency:               ${deal.wholesaler.titleCompany}
Inspection Period:                   5 Business Days

================================================================================
CONFIDENTIAL - FOR AUTHORIZED MULTIDEALPROP SUBSCRIBERS ONLY
================================================================================`;

      const blob = new Blob([auditContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MultiDealProp_Underwriting_${deal.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Error downloading report: ' + (err?.message || 'Unknown error'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Status Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/deals"
            className="text-slate-400 hover:text-white transition flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Deals Feed
          </Link>

          {!isVip ? (
            <Link
              href="/vip"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full shadow-lg transition"
            >
              ⚡ Upgrade Plan ($29 - $49)
            </Link>
          ) : (
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-full flex items-center gap-1.5">
              ✓ VIP Member Access Active
            </span>
          )}
        </div>

        {/* Title & Asking Price */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
              🛡️ {deal.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {deal.title}
            </h1>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm sm:text-base">
              <span className="text-emerald-400">📍</span>
              {isVip ? (
                <span className="text-white font-semibold underline decoration-emerald-500/50">
                  {deal.streetAddress}, {deal.cityStateZip}
                </span>
              ) : (
                <span>
                  <span className="blur-sm select-none text-slate-500">12408 St Clair Ave</span>{' '}
                  {deal.cityStateZip}{' '}
                  <span className="text-amber-400 font-medium text-xs bg-amber-400/10 px-2 py-0.5 rounded ml-1">
                    (Exact Street Locked 🔒)
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 text-right min-w-[240px]">
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">
              Off-Market Asking Price
            </p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {deal.price}
            </p>
            <p className="text-xs text-slate-500 mt-1">Est. ARV: <span className="text-slate-300 font-semibold">{deal.arv}</span></p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Visuals & Deep Institutional Underwriting */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Image */}
            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0d1527] border border-slate-800 rounded-2xl p-5 text-center">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Cap Rate</p>
                <p className="text-2xl font-black text-emerald-400">{deal.capRate}</p>
              </div>
              <div className="border-l border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Cash-on-Cash</p>
                <p className="text-2xl font-black text-amber-400">{deal.cashOnCash}</p>
              </div>
              <div className="border-l border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Gross Rent</p>
                <p className="text-2xl font-black text-sky-400">{deal.monthlyRent}</p>
              </div>
              <div className="border-l border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Annual NOI</p>
                <p className="text-2xl font-black text-white">{deal.noi}</p>
              </div>
            </div>

            {/* DEEP VIP INVESTMENT SYNOPSIS */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    📊 Comprehensive Investment Synopsis & Pro-Forma
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Conservative 12-month expense audit and physical asset underwriting.
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase">
                  Institutional Grade
                </span>
              </div>

              {/* 1. Pro-Forma Income & Expense Statement */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>💰</span> 12-Month Pro-Forma Cash Flow Breakdown
                </h3>
                
                <div className="bg-[#131d36]/80 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-sm">
                  <div className="flex justify-between text-slate-300 pb-2 border-b border-slate-800/80">
                    <span>(+) Gross Scheduled Annual Rent (12 x $1,250)</span>
                    <span className="font-bold text-white">${deal.proforma.grossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-300 pb-2 border-b border-slate-800/80">
                    <span>(-) Economic Vacancy Reserve (5.0%)</span>
                    <span>-${deal.proforma.vacancy.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sky-300 font-bold pb-2 border-b border-slate-800/80">
                    <span>(=) Effective Gross Income (EGI)</span>
                    <span>${deal.proforma.effectiveGrossIncome.toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-slate-400 font-sans uppercase font-bold pt-2">Operating Expenses:</div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Real Estate Property Taxes (Cuyahoga County)</span>
                    <span className="text-slate-300">-${deal.proforma.taxes.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Hazard & Liability Property Insurance</span>
                    <span className="text-slate-300">-${deal.proforma.insurance.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Professional Property Management Fee (8%)</span>
                    <span className="text-slate-300">-${deal.proforma.management.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Maintenance & Structural CapEx Reserve (5%)</span>
                    <span className="text-slate-300">-${deal.proforma.maintenance.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4 pb-2 border-b border-slate-800/80">
                    <span>• Owner Water/Sewer Escrow Contribution ($65/mo)</span>
                    <span className="text-slate-300">-${deal.proforma.waterSewer.toLocaleString()} / yr</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-bold text-base pt-1 pb-2 border-b border-slate-800">
                    <span className="font-sans">(=) Net Operating Income (NOI)</span>
                    <span>${deal.proforma.noi.toLocaleString()} / yr</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>(-) Estimated Debt Service (80% LTV @ 7.5% Interest)</span>
                    <span className="text-rose-400">-${deal.proforma.debtService.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-bold text-sm pt-1">
                    <span className="font-sans">(=) Net Leveraged Cash Flow</span>
                    <span>+${deal.proforma.netCashFlow.toLocaleString()} / yr (+$346/mo)</span>
                  </div>
                </div>
              </div>

              {/* 2. Physical Asset & Capital Improvements Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>🔨</span> Asset Condition & Mechanicals Audit
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">Roof System</span>
                    <p className="text-white font-medium">{deal.specs.roof}</p>
                  </div>
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">Electrical Panel</span>
                    <p className="text-white font-medium">{deal.specs.electrical}</p>
                  </div>
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">Plumbing Lines</span>
                    <p className="text-white font-medium">{deal.specs.plumbing}</p>
                  </div>
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">HVAC & Heating</span>
                    <p className="text-white font-medium">{deal.specs.hvac}</p>
                  </div>
                </div>
              </div>

              {/* 3. Section 8 Voucher & Tenant Profile */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>🏛️</span> Tenant Profile & Government Subsidy Status
                </h3>

                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
                  <p className="leading-relaxed">
                    <strong className="text-white">Subsidy Direct Deposit:</strong> 100% of the $1,250 monthly rent is deposited directly by the <strong>Cuyahoga County Public Housing Authority (PHA)</strong> on the 1st of each month.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Tenant Longevity:</strong> Current tenant has resided in the property for <strong>{deal.specs.tenantTenure}</strong>, with 100% passed bi-annual city & Section 8 inspections.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Utility Division:</strong> Gas and electric accounts are metered separately and paid directly by the resident.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Action Sidebars */}
          <div className="space-y-6">
            
            {/* Vault Download Box */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                📄 Due Diligence Vault
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Audit Report & Rent Roll</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Download full raw underwriting breakdown, pro-forma expense schedule, and assignment contract.
              </p>

              {isVip ? (
                <button
                  onClick={handleDownloadAudit}
                  disabled={downloading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {downloading ? 'Preparing File...' : '📥 Download Full Audit Pack'}
                </button>
              ) : (
                <Link
                  href="/vip"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#131d36] hover:bg-[#1a2747] text-slate-300 border border-slate-700 font-semibold py-3.5 px-4 rounded-xl transition text-sm"
                >
                  🔒 Unlock Full Pack (Basic/VIP)
                </Link>
              )}
            </div>

            {/* Wholesaler Direct Desk */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Direct Wholesaler Desk
                </h3>
                {isVip ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                    🔒 LOCKED
                  </span>
                )}
              </div>

              {isVip ? (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Wholesaler Entity</p>
                    <p className="text-white font-bold text-base">{deal.wholesaler.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Direct Phone</p>
                    <a
                      href={`tel:${deal.wholesaler.phone}`}
                      className="text-emerald-400 font-extrabold hover:underline"
                    >
                      {deal.wholesaler.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Direct Email</p>
                    <a
                      href={`mailto:${deal.wholesaler.email}`}
                      className="text-sky-400 hover:underline text-sm break-all"
                    >
                      {deal.wholesaler.email}
                    </a>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Terms: {deal.wholesaler.assignmentFee}</p>
                    <p className="text-xs text-slate-400">Escrow: {deal.wholesaler.titleCompany}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-[#131d36]/60 rounded-xl space-y-2 select-none filter blur-[4px]">
                    <p className="text-slate-400 text-sm">👤 Apex Wholesaler Capital LLC</p>
                    <p className="text-slate-400 text-sm">📞 +1 (216) 485-0000</p>
                    <p className="text-slate-400 text-sm">✉️ acquisitions@dealdesk.com</p>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Unlock exact address & seller assignment direct contact starting at $29/mo.
                  </p>

                  <Link
                    href="/vip"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg text-sm"
                  >
                    ⚡ Unlock Contacts Now
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
