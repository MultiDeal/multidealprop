'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PrintAuditPage() {
  const params = useParams();
  const dealId = (params?.id as string) || 'OH-CLE-44120-01';
  const [isVip, setIsVip] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const vip = localStorage.getItem('multideal_vip') === 'true';
      setIsVip(vip);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <p className="text-slate-400">Loading VIP Report...</p>
      </div>
    );
  }

  if (!isVip) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0d1527] border border-amber-500/30 rounded-3xl p-8 text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h1 className="text-2xl font-bold">VIP Access Required</h1>
          <p className="text-slate-400 text-sm">
            You must be an active subscriber to download full Due Diligence audit files and seller contacts.
          </p>
          <Link
            href="/vip"
            className="inline-block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition"
          >
            Upgrade to VIP Access ($29 - $49)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] p-4 sm:p-8 flex justify-center font-sans">
      <div className="max-w-4xl w-full bg-[#070b14] border border-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 print:border-none print:p-0 print:m-0">
        
        {/* Navigation & Actions (Hidden during Print) */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4 print:hidden">
          <Link
            href={`/deals/${dealId}`}
            className="text-xs text-slate-400 hover:text-white bg-[#0d1527] border border-slate-800 px-3.5 py-2 rounded-xl transition"
          >
            ← Back to Deal
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
          >
            🖨️ Download / Save as PDF
          </button>
        </div>

        {/* Document Header */}
        <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Multi<span className="text-emerald-400">Deal</span>Prop
              <span className="text-sky-400 text-xs font-normal ml-2">| Real Estate Intelligence</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">
              CONFIDENTIAL INSTITUTIONAL UNDERWRITING & DUE DILIGENCE AUDIT PACK
            </p>
          </div>
          <div className="text-right">
            <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              ✓ VIP AUDIT CERTIFIED
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Asset ID: <strong className="text-slate-200">{dealId}</strong>
            </p>
          </div>
        </div>

        {/* Hero Property & Price Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-[#0d1527] border border-[#1e293b] rounded-xl overflow-hidden">
          <div className="p-4 md:col-span-2 space-y-1">
            <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              High-Cap Underwritten Asset • Section 8 Ready
            </span>
            <h2 className="text-lg font-black text-white leading-snug">
              Renovated 3-Bed Brick Home — Turnkey Cashflow Asset
            </h2>
            <p className="text-xs text-slate-300">
              📍 Exact Address: <strong className="text-emerald-400">12408 St Clair Ave, Cleveland, OH 44120</strong> (Cuyahoga County)
            </p>
          </div>
          <div className="p-4 bg-emerald-500/5 border-t md:border-t-0 md:border-l border-[#1e293b] flex flex-col justify-center text-left md:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Off-Market Assignment Price</span>
            <span className="text-3xl font-black text-emerald-400 leading-tight">$89,500</span>
            <span className="text-[10px] text-slate-400">Est. ARV: <strong className="text-white">$115,000</strong></span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-[#0d1527] border border-[#1e293b] rounded-xl p-3 text-center">
            <p className="text-[9px] uppercase font-bold text-slate-400">Unleveraged Cap Rate</p>
            <p className="text-xl font-black text-emerald-400">12.04%</p>
          </div>
          <div className="bg-[#0d1527] border border-[#1e293b] rounded-xl p-3 text-center">
            <p className="text-[9px] uppercase font-bold text-slate-400">Leveraged Cash-on-Cash</p>
            <p className="text-xl font-black text-amber-400">18.60%</p>
          </div>
          <div className="bg-[#0d1527] border border-[#1e293b] rounded-xl p-3 text-center">
            <p className="text-[9px] uppercase font-bold text-slate-400">Gross In-Place Rent</p>
            <p className="text-xl font-black text-sky-400">$1,250 / mo</p>
          </div>
          <div className="bg-[#0d1527] border border-[#1e293b] rounded-xl p-3 text-center">
            <p className="text-[9px] uppercase font-bold text-slate-400">Net Operating Income</p>
            <p className="text-xl font-black text-white">$10,780 / yr</p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left: Financial Statement */}
          <div className="bg-[#0d1527] border border-[#1e293b] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase text-white border-b border-[#1e293b] pb-2 flex items-center gap-1.5">
              <span>📊</span> 12-Month Pro-Forma P&L Statement
            </h3>
            <div className="text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-200">
                <span>Gross Scheduled Rent ($1,250 × 12)</span>
                <span className="font-bold text-white">$15,000</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) Vacancy & Credit Loss (5%)</span>
                <span>-$750</span>
              </div>
              <div className="flex justify-between text-sky-300 font-bold border-y border-[#1e293b] py-1">
                <span>(=) Effective Gross Income (EGI)</span>
                <span>$14,250</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Real Estate Taxes (Cuyahoga Co.)</span>
                <span>-$1,420</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Hazard & Liability Insurance</span>
                <span>-$850</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Property Management Fee (8%)</span>
                <span>-$1,200</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Maintenance / CapEx Reserve (5%)</span>
                <span>-$750</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Owner Water & Sewer Contribution</span>
                <span>-$780</span>
              </div>
              <div className="flex justify-between bg-emerald-500/10 text-emerald-400 font-black p-1.5 rounded border border-emerald-500/20 text-sm">
                <span>(=) NET OPERATING INCOME (NOI)</span>
                <span>$10,780 / yr</span>
              </div>
              <div className="flex justify-between text-amber-400 font-bold text-xs pt-1">
                <span>Net Leveraged Cash Flow (80% LTV)</span>
                <span>+$4,940 / yr (+$411/mo)</span>
              </div>
            </div>

            <div className="bg-[#0b192e] border-l-2 border-sky-400 p-2.5 rounded text-[10px] text-slate-300 leading-relaxed">
              <strong className="text-sky-400">Section 8 Guarantee:</strong> 100% of the $1,250 monthly rent is paid via direct deposit by the Cuyahoga County Housing Authority. Tenant in place 2.5+ years without default.
            </div>
          </div>

          {/* Right: Physical Specs & Desk */}
          <div className="bg-[#0d1527] border border-[#1e293b] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase text-white border-b border-[#1e293b] pb-2 flex items-center gap-1.5">
              <span>🔨</span> Physical Asset & Mechanicals Audit
            </h3>
            
            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Year Built / Rehab:</span>
                <span className="font-bold text-white">1952 / Full Rehab 2024</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Layout / Size:</span>
                <span className="font-bold text-white">3 Beds | 1 Bath | 1,340 sqft</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Roof System:</span>
                <span className="font-bold text-slate-200">Architectural Shingles (2021)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Electrical:</span>
                <span className="font-bold text-slate-200">100A Breaker Panel (Up to Code)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Plumbing:</span>
                <span className="font-bold text-slate-200">PEX Supply & PVC Waste Lines</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">HVAC & Heating:</span>
                <span className="font-bold text-slate-200">High-Efficiency Forced Air (2022)</span>
              </div>
            </div>

            {/* Wholesaler Desk */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-[#0d1527] border border-emerald-500/30 rounded-xl p-3 space-y-1.5 text-xs">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                🔒 Direct Wholesaler & Assignment Desk
              </span>
              <div className="flex justify-between">
                <span className="text-slate-400">Entity:</span>
                <strong className="text-white">Apex Wholesale Capital LLC</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <strong className="text-emerald-400">+1 (216) 485-9921</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-sky-400 font-bold">acquisitions@apexwholesaledesk.com</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1 text-[11px]">
                <span className="text-slate-400">Escrow:</span>
                <span className="text-slate-300">First Choice Title ($2,500 EMD)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-[9px] text-slate-500 border-t border-[#1e293b] pt-3 text-justify leading-relaxed">
          <strong>CONFIDENTIALITY & DISCLAIMER:</strong> This report contains proprietary underwriting compiled exclusively for MultiDealProp active members. All figures, Cap Rates, and cashflows are derived from in-place leases and audited operating costs. Buyers must perform standard due diligence and inspection prior to closing.
        </p>

      </div>
    </div>
  );
}
