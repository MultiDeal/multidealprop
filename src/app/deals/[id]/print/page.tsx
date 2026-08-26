'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PrintAuditPage() {
  const params = useParams();
  const dealId = (params?.id as string) || 'deal-1';
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
        <p className="text-slate-400">Loading Report...</p>
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
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-12 flex justify-center">
      <div className="max-w-3xl w-full bg-[#0d1527] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
              ✓ Verified Due Diligence Pack
            </span>
            <h1 className="text-2xl font-bold mt-2">Confidential Underwriting Audit</h1>
            <p className="text-xs text-slate-400">Reference ID: {dealId}</p>
          </div>
          <Link
            href={`/deals/${dealId}`}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-2 rounded-lg transition print:hidden"
          >
            ← Back to Deal
          </Link>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="bg-[#131d36] p-4 rounded-xl space-y-2">
            <h2 className="text-emerald-400 font-bold text-base">1. Property & Location Analysis</h2>
            <p><strong>Full Address:</strong> 12408 St Clair Ave, Cleveland, OH 44120</p>
            <p><strong>Asset Type:</strong> Multi-Family / Turnkey Section 8 Certified</p>
            <p><strong>Layout:</strong> 3 Beds | 1 Bath | Detached Garage</p>
          </div>

          <div className="bg-[#131d36] p-4 rounded-xl space-y-2">
            <h2 className="text-emerald-400 font-bold text-base">2. Underwritten Financials & Rent Roll</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#0d1527] p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Purchase Price</span>
                <span className="text-lg font-bold text-white">$89,500</span>
              </div>
              <div className="bg-[#0d1527] p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Monthly Rent</span>
                <span className="text-lg font-bold text-sky-400">$1,250 / mo</span>
              </div>
              <div className="bg-[#0d1527] p-3 rounded-lg">
                <span className="text-xs text-slate-400 block">Net Operating Income</span>
                <span className="text-lg font-bold text-emerald-400">$10,780 / yr</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2">
              * Tenant: Cuyahoga County Housing Voucher (100% direct deposit). Tenant pays gas & electric.
            </p>
          </div>

          <div className="bg-[#131d36] p-4 rounded-xl space-y-2">
            <h2 className="text-emerald-400 font-bold text-base">3. Wholesaler / Seller Assignment Desk</h2>
            <p><strong>Entity:</strong> Apex Wholesale Capital LLC</p>
            <p><strong>Direct Phone:</strong> <a href="tel:+12164859921" className="text-emerald-400 underline">+1 (216) 485-9921</a></p>
            <p><strong>Acquisitions Email:</strong> <a href="mailto:acquisitions@apexwholesaledesk.com" className="text-sky-400 underline">acquisitions@apexwholesaledesk.com</a></p>
            <p><strong>Assignment Contract:</strong> Clean fee included in $89,500 price. Title open at First Choice Title Agency.</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-800 print:hidden">
          <button
            onClick={() => window.print()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

      </div>
    </div>
  );
}
