import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | MultiDealProp',
  description: 'Terms of Service and commercial lending platform disclaimers for multidealprop.com.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-white/5 px-6 lg:px-12 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black text-sm">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">multidealprop<span className="text-cyan-500">.</span></span>
        </Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          &larr; Back to Platform
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Legal Terms</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-2">Effective Date: September 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-slate-400 border-t border-white/5 pt-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Platform Nature &amp; No-Lender Disclaimer</h2>
          <p>
            multidealprop.com is an informational routing and lead generation technology platform. MultiDealProp is not a bank, direct mortgage lender, depository institution, or licensed securities dealer. We do not originate mortgages, issue loan commitments, or make final credit decisions.
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">2. Commercial &amp; Business-Purpose Financing Only</h2>
          <p>
            All financing options displayed or routed through this platform are strictly for business, investment, and commercial purposes. Loans are intended for non-owner occupied properties (e.g., multifamily complexes, commercial real estate, or business-purpose 1-4 residential rentals). We do not provide consumer mortgages or residential home loans for personal living occupancy.
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">3. Underwriting &amp; Rate Quotes</h2>
          <p>
            Any initial metrics, loan-to-value calculations, or indicated rates presented on the website are estimates for preliminary screening only. Official term sheets and closing conditions remain subject to formal underwriting review, professional property appraisals, and lender approval.
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">4. Limitation of Liability</h2>
          <p>
            MultiDealProp shall not be held liable for any damages, losses, or transaction disputes arising from interactions or agreements executed between borrowers and independent lending partners.
          </p>
        </section>
      </main>
    </div>
  );
}
