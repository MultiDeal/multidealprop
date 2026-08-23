'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, BarChart3, Database, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 font-sans antialiased pb-20">
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <span className="text-xs font-bold text-emerald-400">Platform Overview</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Building2 className="w-4 h-4" /> Institutional Real Estate Data
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">About MultiDealProp</h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-10 leading-relaxed">
          MultiDealProp is an analytical deal aggregation and underwriting intelligence platform engineered for active multi-family investors, private equity syndicators, and cash buyers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <Database className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Off-Market Aggregation</h3>
            <p className="text-xs text-slate-400">Ingesting direct assignment contracts across premier US multi-family markets before public MLS syndication.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <BarChart3 className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Automated Underwriting</h3>
            <p className="text-xs text-slate-400">Standardized pro-forma models, gross yields, and capitalization rates to screen cash-flow assets rapidly.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-teal-400 mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Direct Assignor Desk</h3>
            <p className="text-xs text-slate-400">Direct wholesaler desk access eliminating secondary agent markups for qualified subscribers.</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
          <h2 className="text-base font-bold text-white">Our Screening Methodology</h2>
          <p>
            We curate assets across resilient Midwest and Sunbelt metros focusing on duplexes, triplexes, fourplexes, and small multi-family complexes (2-20 units) that demonstrate strong cash-on-cash fundamentals and immediate value-add potential.
          </p>
          <p className="text-slate-400 text-xs">
            Notice: MultiDealProp does not provide brokerage, title, lending, or legal advisory services. All metrics are computational estimates for screening purposes only.
          </p>
        </div>
      </main>
    </div>
  );
}
