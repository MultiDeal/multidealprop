'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link
          href="/deals"
          className="text-xs text-slate-400 hover:text-white transition flex items-center gap-2 font-medium"
        >
          ← Back to Deals Feed
        </Link>

        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">Terms of Service & Disclaimers</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: August 2026</p>
        </div>

        {/* Section 1: Non-Broker Status */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>⚖️</span> 1. No Real Estate Brokerage or Legal Representation
          </h2>
          <p className="text-xs leading-relaxed text-slate-400">
            MultiDealProp is an independent real estate data aggregator and technology platform. MultiDealProp is <strong>not a licensed real estate broker, brokerage firm, mortgage lender, attorney, or financial advisory institution</strong>. We do not represent buyers, sellers, or wholesalers in any fiduciary capacity.
          </p>
          <p className="text-xs leading-relaxed text-slate-400">
            All listings, wholesale contract assignments, pro-formas, Cap Rates, and return on equity projections displayed on this platform are for informational and analytical software purposes only.
          </p>
        </div>

        {/* Section 2: Non-Binding LOI Generator */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>📝</span> 2. Letter of Intent (LOI) & Draft Agreements
          </h2>
          <p className="text-xs leading-relaxed text-slate-400">
            The Letter of Intent (LOI) generator provided on this platform produces <strong>strictly non-binding informational templates</strong>. The generated documents do not constitute binding purchase agreements, escrow deposits, or formal transfers of real property title.
          </p>
          <p className="text-xs leading-relaxed text-slate-400">
            Users are solely responsible for verifying contract legality, municipal compliance, and earnest money deposit handling with their own independent licensed legal counsel, title companies, and closing attorneys.
          </p>
        </div>

        {/* Section 3: Independent Due Diligence */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>🛡️</span> 3. Mandatory Independent Due Diligence
          </h2>
          <p className="text-xs leading-relaxed text-slate-400">
            Past property performance, public Section 8 voucher schedules, and estimated renovation/operating expenses are subject to market volatility. MultiDealProp strongly advises all subscribers to:
          </p>
          <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400 pl-2">
            <li>Perform independent physical property inspections during designated contractual inspection periods.</li>
            <li>Conduct comprehensive title examinations through a licensed Title & Escrow agency to guarantee clean and marketable title.</li>
            <li>Verify local zoning, occupancy permits, and rental licensing with municipal housing authorities prior to closing.</li>
          </ul>
        </div>

        {/* Section 4: Limitation of Liability */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>🔒</span> 4. Limitation of Liability
          </h2>
          <p className="text-xs leading-relaxed text-slate-400">
            Under no circumstances shall MultiDealProp, its founders, operators, or affiliates be held liable for direct, indirect, incidental, or consequential damages resulting from property acquisition decisions, assignment contract disputes, or financial losses incurred by users of this platform.
          </p>
        </div>

      </div>
    </div>
  );
}
