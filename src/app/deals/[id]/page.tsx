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
    capRate: '10.8%',
    monthlyRent: '$1,250',
    grossYield: '23.8%',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Apex Wholesale Capital LLC',
      phone: '+1 (216) 485-9921',
      email: 'acquisitions@apexwholesaledesk.com',
      assignmentFee: '$5,000 included in price',
    },
    synopsis: 'Solid turnkey turn-around asset in high-occupancy rental corridor. Long-term Section 8 tenant in place paying full market rate with zero landlord utility overhead.',
  };

  // Génération et téléchargement instantané du fichier d'audit (côté client, 0 dépendance API)
  const handleDownloadAudit = () => {
    try {
      setDownloading(true);

      const auditContent = `================================================================================
MULTIDEALPROP - CONFIDENTIAL UNDERWRITING & DUE DILIGENCE AUDIT
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
Layout: 3 Bedrooms | 1 Bathroom | Full Basement | Detached Garage
Square Footage: ~1,340 sqft
Year Built: 1952 (Full Interior & Mechanical Rehab 2024)

--------------------------------------------------------------------------------
2. PRO-FORMA FINANCIAL UNDERWRITING
--------------------------------------------------------------------------------
Contract Asking Price:        ${deal.price}
Monthly In-Place Rent:        ${deal.monthlyRent} / month
Annual Gross Scheduled Rent:  $15,000 / year

Estimated Operating Expenses:
  - Real Estate Taxes:        $1,420 / year
  - Property Insurance:       $850 / year
  - Property Management (8%): $1,200 / year
  - Maintenance Reserve (5%): $750 / year
--------------------------------------------------------------------------------
Net Operating Income (NOI):   $10,780 / year
Cap Rate:                     ${deal.capRate}
Gross Yield:                  ${deal.grossYield}

--------------------------------------------------------------------------------
3. TENANT & SECTION 8 VOUCHER BREAKDOWN
--------------------------------------------------------------------------------
Occupancy Status:             100% Occupied
Tenant Type:                  Cuyahoga County Housing Authority (Section 8)
Direct Deposit Portion:       100% Guaranteed by Housing Authority
Tenant Utilities:             Tenant pays Gas & Electric
Owner Utilities:              Owner pays Water & Sewer (~$65/mo)

--------------------------------------------------------------------------------
4. WHOLESALE CONTRACT & ASSIGNMENT DESK
--------------------------------------------------------------------------------
Direct Seller / Wholesaler:   ${deal.wholesaler.name}
Acquisitions Contact:         ${deal.wholesaler.phone}
Direct Email:                 ${deal.wholesaler.email}
Assignment Terms:             ${deal.wholesaler.assignmentFee}
Title / Escrow Agency:        First Choice Title & Escrow (Earnest Money: $2,500)
Inspection Contingency:       5 Business Days

================================================================================
CONFIDENTIAL - FOR AUTHORIZED MULTIDEALPROP SUBSCRIBERS ONLY
================================================================================`;

      const blob = new Blob([auditContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MultiDealProp_Due_Diligence_${deal.id}.txt`;
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
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
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

          <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 text-right min-w-[220px]">
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">
              Off-Market Asking Price
            </p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {deal.price}
            </p>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Visuals & Underwriting */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 bg-[#0d1527] border border-slate-800 rounded-2xl p-6 text-center">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Cap Rate</p>
                <p className="text-2xl font-black text-emerald-400">{deal.capRate}</p>
              </div>
              <div className="border-x border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Gross Monthly Rent</p>
                <p className="text-2xl font-black text-sky-400">{deal.monthlyRent}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Gross Yield</p>
                <p className="text-2xl font-black text-white">{deal.grossYield}</p>
              </div>
            </div>

            <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Investment Synopsis
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {deal.synopsis}
              </p>
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
                Full underwriting breakdown, expense schedule, and seller assignment details.
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
                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-xs text-slate-400">{deal.wholesaler.assignmentFee}</p>
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
