'use client';

import { CheckCircle2, Zap, ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function PricingPlansPage() {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Off-Market Underwriting
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5" /> Institutional Multi-Family Pipeline
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Unlock High-Yield Off-Market Deals
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Gain direct wholesaler access, complete addresses, and full due diligence audit packs before properties hit the public market.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Freemium Plan ($0) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Explorer</div>
              <h2 className="text-2xl font-black text-white">Freemium</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Scan high-cap deals by city and analyze macro investment yields.
              </p>

              <div className="mt-8 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>City, State &amp; Zip code view</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Gross Yield &amp; Cap Rate estimates</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>Exact address blurred</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>Direct wholesaler contact locked</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3.5 rounded-xl text-center transition-all block"
            >
              Current Access
            </Link>
          </div>

          {/* Basic Plan ($29/mo) */}
          <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Active Investor</div>
              <h2 className="text-2xl font-black text-white">Basic</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-emerald-400 font-mono">$29</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Direct wholesaler contacts and exact property addresses for active buyers.
              </p>

              <div className="mt-8 space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Exact Address Unlocked</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Direct Wholesaler Phone &amp; Email</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Download PDF Audit Reports</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Weekly Curated Email Digest</span>
                </div>
              </div>
            </div>

            <a
              href="/api/checkout?plan=basic"
              className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3.5 rounded-xl text-center shadow-lg shadow-emerald-500/20 transition-all block"
            >
              Get Basic Access ($29/mo)
            </a>
          </div>

          {/* VIP Pro Plan ($49/mo) */}
          <div className="bg-gradient-to-b from-slate-900 via-[#0C1726] to-[#060B12] border-2 border-emerald-400/80 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black text-[10px] uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
              Most Popular • Instant Alerts
            </div>

            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Institutional</div>
              <h2 className="text-2xl font-black text-white">VIP Pro</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-cyan-300 font-mono">$49</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                First-look deal access, verified rent rolls, and instant real-time email dispatch.
              </p>

              <div className="mt-8 space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-bold text-white">⚡ Instant Real-Time Email Alerts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Exact Address + Parcel APN</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Direct Wholesaler &amp; Assignment Desk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Unlimited PDF Audit Packs &amp; Rent Rolls</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>5-Year Pro-Forma &amp; Underwriting Matrix</span>
                </div>
              </div>
            </div>

            <a
              href="/api/checkout?plan=vip"
              className="mt-8 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:opacity-95 text-black font-black text-xs py-4 rounded-xl text-center shadow-xl shadow-cyan-500/20 transition-all block"
            >
              Get VIP Pro ($49/mo)
            </a>
          </div>

        </div>

      </main>
    </div>
  );
}
