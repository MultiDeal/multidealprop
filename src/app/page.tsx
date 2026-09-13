'use client';

import React, { useState } from 'react';
import Head from 'next/head';

export default function FinTechHome() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  // Schema Markup (JSON-LD) crucial pour le SEO FinTech
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "DSCR & Multifamily Loan Pre-Approval",
    "provider": {
      "@type": "Organization",
      "name": "MultiDealProp",
      "url": "https://multidealprop.com"
    },
    "category": "Commercial Real Estate Loan",
    "description": "Fast capital access for multifamily and DSCR real estate deals. Compare non-QM and commercial private lenders.",
    "areaServed": "US"
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Injection SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Aurora Background Effects (CSS pur, très léger pour le LCP) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      {/* NAVIGATION MINIMALISTE */}
      <header className="relative z-50 px-6 lg:px-12 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-black text-sm tracking-tighter">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            multidealprop<span className="text-slate-500">.</span>
          </span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#platform" className="hover:text-white transition-colors">Platform</a>
          <a href="#rates" className="hover:text-white transition-colors">Live Rates</a>
          <a href="#api" className="hover:text-white transition-colors">Investors</a>
        </nav>

        <button className="px-5 py-2 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 backdrop-blur-md transition-all">
          Sign In
        </button>
      </header>

      <main className="relative z-10 px-6 max-w-7xl mx-auto pt-20 pb-32">
        
        {/* HERO SECTION : Orientée conversion & SEO (H1 fort) */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            US LENDING DESK ONLINE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-tight">
            Institutional Capital.<br />Unleashed.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Direct access to Tier-1 liquidity for multifamily and DSCR portfolios. Bypass traditional banking friction with data-driven underwriting.
          </p>
        </div>

        {/* BENTO GRID UI : L'interface 2027 par excellence */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          
          {/* CARTE PRINCIPALE : Le Terminal de Qualification */}
          <section className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">
            {/* Effet de lueur interne au survol */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
              <span className="text-indigo-400 font-mono text-sm">01 /</span> Deal Parameters
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-2 flex relative">
                <button 
                  onClick={() => setStep(1)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${step === 1 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Multifamily (5+)
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${step === 2 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  DSCR (1-4)
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-widest">Requested Capital ($)</label>
                <input 
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="2,500,000"
                  className="w-full bg-transparent text-4xl md:text-5xl font-light text-white placeholder-slate-800 border-b border-white/10 focus:border-indigo-500 py-4 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-6">
                <button className="w-full bg-white text-black hover:bg-slate-200 font-bold text-sm py-4 rounded-xl transition-transform active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  Compute Eligibility &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* COLONNE DROITE : Métriques en style Widget iOS */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6">
            
            {/* Widget 1 : Live Market Data */}
            <aside className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Lending Velocity</div>
              <div>
                <div className="text-4xl font-extrabold text-white tracking-tighter">14<span className="text-xl text-slate-500 font-medium"> days</span></div>
                <div className="text-sm text-slate-400 mt-2">Average time to close from executed term sheet.</div>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-3/4 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
            </aside>

            {/* Widget 2 : Core Requirements */}
            <aside className="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-center space-y-4">
               <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Algorithm Filters</div>
               
               <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
                 <span className="text-sm text-slate-300">Min. FICO</span>
                 <span className="text-sm font-semibold text-white">680+</span>
               </div>
               <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
                 <span className="text-sm text-slate-300">Target DSCR</span>
                 <span className="text-sm font-semibold text-white">&ge; 1.15x</span>
               </div>
               <div className="flex items-center justify-between pb-2">
                 <span className="text-sm text-slate-300">Max LTV</span>
                 <span className="text-sm font-semibold text-white">80%</span>
               </div>
            </aside>

          </div>
        </div>
      </main>

      {/* BANDEAU PARTENAIRES (Social Proof minimalist) */}
      <section className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-xl font-black tracking-tighter text-white">KIAVI</span>
          <span className="text-xl font-bold tracking-widest text-white">VISIO<span className="font-light">LENDING</span></span>
          <span className="text-xl font-black text-white">CIVIC</span>
        </div>
      </section>

    </div>
  );
}
