'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [step, setStep] = useState<'form' | 'contact' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: '5+ Units Multifamily',
    loanPurpose: 'Purchase',
    purchasePrice: '',
    noi: '',
    creditScore: '720+',
    liquidity: '$100k - $250k',
    state: 'FL',
    fullName: '',
    email: '',
    phone: '',
    tcpa_accepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('contact');
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType: formData.propertyType,
          loanPurpose: formData.loanPurpose,
          propertyValue: Number(formData.purchasePrice) || 0,
          loanAmount: Math.round((Number(formData.purchasePrice) || 0) * 0.75),
          state: formData.state,
          creditScore: formData.creditScore,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          tcpa_accepted: formData.tcpa_accepted,
        }),
      });

      if (res.ok) {
        setStep('success');
      } else {
        alert('Submission error. Please verify your details.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. TOP NAVBAR */}
      <nav className="border-b border-slate-800/80 bg-[#090f1d]/90 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-lg shadow-cyan-500/20">
              M
            </div>
            <div className="leading-none">
              <span className="text-lg font-black tracking-tight text-white block">MULTI</span>
              <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase block">DEALPROP</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#calculators" className="hover:text-cyan-400 transition-colors">Deal Calculators</a>
            <a href="#investors" className="hover:text-cyan-400 transition-colors">For Investors</a>
            <a href="#lenders" className="hover:text-cyan-400 transition-colors">For Lenders</a>
            <a href="#resources" className="hover:text-cyan-400 transition-colors">Resources</a>
          </div>

          {/* Top CTA Button */}
          <button 
            onClick={() => {
              const el = document.getElementById('deal-box');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#e5a93c] hover:bg-[#d4972c] text-slate-950 font-extrabold text-xs uppercase px-5 py-2.5 rounded shadow-md transition-transform active:scale-95 tracking-wider"
          >
            Get Qualified
          </button>
        </div>
      </nav>

      {/* 2. HERO HEADER & TITLE */}
      <section className="pt-12 pb-6 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase max-w-4xl mx-auto leading-tight">
          Qualify Your Multifamily Deals & Access Capital Faster.
        </h1>
        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Get instant pre-approval terms for DSCR, Bridge, & Commercial Loans from $1M to $50M+. Connecting Active Real Estate Investors with Leading U.S. Lenders.
        </p>
      </section>

      {/* 3. DUAL-PANEL HERO CONTAINER (The Box on the Mockup) */}
      <section id="deal-box" className="px-6 pb-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: THE FORM BOX */}
          <div className="lg:col-span-8 bg-[#0d1627] border border-cyan-500/40 rounded-xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 flex flex-col justify-between">
            <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
              <h2 className="text-sm font-extrabold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Get Lender-Ready in 2 Minutes
              </h2>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-1 rounded">No Hard Credit Pull</span>
            </div>

            {step === 'form' && (
              <form onSubmit={handleInitialSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Step 1: Property Type */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Step 1: Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="5+ Units Multifamily">5+ Units Multifamily</option>
                      <option value="1-4 Residential">1-4 Residential</option>
                      <option value="Mixed-Use Commercial">Mixed-Use Commercial</option>
                    </select>
                  </div>

                  {/* Step 2: Loan Purpose */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Step 2: Loan Purpose
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Purchase', 'Refinance', 'Cash-Out Refi'].map((purpose) => (
                        <button
                          key={purpose}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, loanPurpose: purpose }))}
                          className={`text-[10px] font-bold py-2.5 px-1 rounded uppercase tracking-tight transition-all border ${
                            formData.loanPurpose === purpose
                              ? 'bg-[#e5a93c] text-slate-950 border-[#e5a93c]'
                              : 'bg-[#162238] text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {purpose}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Step 3: Purchase Price / Value */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Step 3: Purchase Price / Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">$</span>
                      <input
                        type="number"
                        name="purchasePrice"
                        required
                        placeholder="e.g. 2500000"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        className="w-full bg-[#162238] border border-slate-700 rounded pl-7 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Step 4: Annual Net Operating Income (NOI) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Step 4: Annual Net Operating Income (NOI)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">$</span>
                      <input
                        type="number"
                        name="noi"
                        required
                        placeholder="e.g. 185000"
                        value={formData.noi}
                        onChange={handleChange}
                        className="w-full bg-[#162238] border border-slate-700 rounded pl-7 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Step 5: FICO Score */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Step 5: FICO Score
                    </label>
                    <select
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="740+">740+ (Tier 1)</option>
                      <option value="700-739">700 - 739</option>
                      <option value="660-699">660 - 699</option>
                      <option value="<660">Under 660</option>
                    </select>
                  </div>

                  {/* Step 6: Liquidity */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Available Liquidity (Down Payment)
                    </label>
                    <select
                      name="liquidity"
                      value={formData.liquidity}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="$100k - $250k">$100k - $250k</option>
                      <option value="$250k - $500k">$250k - $500k</option>
                      <option value="$500k - $1M">$500k - $1M</option>
                      <option value="$1M+">$1M+</option>
                    </select>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  type="submit"
                  className="w-full mt-2 bg-[#e5a93c] hover:bg-[#d4972c] text-slate-950 font-black text-sm uppercase py-4 rounded tracking-wider transition-transform active:scale-[0.99] shadow-lg shadow-amber-500/10"
                >
                  See My Options
                </button>
              </form>
            )}

            {step === 'contact' && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded text-xs text-cyan-300">
                  Deal details saved. Enter contact details to route these loan parameters directly to matching underwriters.
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Deal State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="FL">Florida</option>
                      <option value="TX">Texas</option>
                      <option value="OH">Ohio</option>
                      <option value="GA">Georgia</option>
                      <option value="NC">North Carolina</option>
                      <option value="Other">Other U.S. State</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Business Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="investor@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Direct Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#162238] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="tcpa"
                    name="tcpa_accepted"
                    required
                    checked={formData.tcpa_accepted}
                    onChange={handleChange}
                    className="mt-1 accent-amber-400 rounded"
                  />
                  <label htmlFor="tcpa" className="text-[10px] text-slate-400 leading-tight">
                    I agree to receive rate sheets and contact regarding this transaction from multidealprop.com and accredited private/commercial lending partners. TCPA compliant.
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-1/3 bg-slate-800 text-slate-300 font-bold text-xs uppercase py-3 rounded hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-[#e5a93c] hover:bg-[#d4972c] disabled:opacity-50 text-slate-950 font-black text-xs uppercase py-3 rounded transition-all"
                  >
                    {loading ? 'Transmitting Deal...' : 'Finalize & Request Terms'}
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center font-bold text-lg border border-emerald-500/40">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">File Submitted</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Your parameters have been logged into the routing queue. Qualified commercial lending partners will deliver term sheets within 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: THE KEY LENDER METRICS PANEL */}
          <div className="lg:col-span-4 bg-[#0a1120] border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Key Lender Metrics</h3>
                {/* Arrow up icon */}
                <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400 text-xs">
                  ↑
                </div>
              </div>

              {/* Chart Graphic Visual */}
              <div className="bg-[#0f1b30] border border-slate-800 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-white">$25M+</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Capital Pool</div>
                </div>
                {/* Visual Bar Graph */}
                <div className="flex items-end gap-1.5 h-10">
                  <div className="w-2 bg-slate-700 h-3 rounded-t"></div>
                  <div className="w-2 bg-slate-600 h-5 rounded-t"></div>
                  <div className="w-2 bg-cyan-500 h-7 rounded-t"></div>
                  <div className="w-2 bg-[#e5a93c] h-10 rounded-t"></div>
                </div>
              </div>

              {/* Metric checklist matching image */}
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-800/40">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">DSCR Ratio &gt; 1.20x</span>
                    <span className="text-[11px] text-slate-400 block">Property revenue comfortably covers debt service requirements.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-800/40">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Min FICO 720+</span>
                    <span className="text-[11px] text-slate-400 block">Unlocks premier tier interest rates and highest leverage (up to 80% LTV).</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-800/40">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Min Liquidity $100k+</span>
                    <span className="text-[11px] text-slate-400 block">Verified post-closing reserves or accessible down payment funds.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <div className="text-[11px] font-mono text-slate-400">
                Lending Desk Availability: <span className="text-emerald-400 font-bold">Online</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. HORIZONTAL "HOW IT WORKS" BAR (Matching mockup: 1. Enter Deal Info > 2. Get Prelim. Terms > 3. Connect & Close) */}
      <section id="how-it-works" className="px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 sm:p-6">
          <div className="text-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">How It Works</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#0f192b] border border-slate-800/80 rounded-lg p-3 text-center flex items-center justify-center gap-3">
              <span className="text-xs font-black text-cyan-400 font-mono">1.</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Enter Deal Info</span>
            </div>
            <div className="bg-[#0f192b] border border-slate-800/80 rounded-lg p-3 text-center flex items-center justify-center gap-3">
              <span className="text-xs font-black text-cyan-400 font-mono">2.</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Get Prelim. Terms</span>
            </div>
            <div className="bg-[#0f192b] border border-slate-800/80 rounded-lg p-3 text-center flex items-center justify-center gap-3">
              <span className="text-xs font-black text-cyan-400 font-mono">3.</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Connect &amp; Close</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED LENDER PARTNERS BAR (Kiavi, Visio Lending, Civic Financial, TCPA Compliant) */}
      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="border border-slate-800/60 bg-[#090e1a] rounded-xl py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Featured Lender Partners
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <span className="text-sm sm:text-base font-black tracking-tight text-slate-300">
              <span className="text-cyan-400 text-lg">▲</span> Kiavi
            </span>
            <span className="text-sm sm:text-base font-black tracking-tight text-slate-300">
              <span className="text-blue-500 text-lg">V</span> Visio Lending
            </span>
            <span className="text-sm sm:text-base font-black tracking-tight text-slate-300">
              <span className="text-cyan-300 text-lg font-mono">C</span> Civic Financial
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded text-[11px] font-bold text-emerald-400">
            <span>✓</span> Secure &amp; TCPA Compliant
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-800/80 mt-12 py-8 px-6 text-xs text-slate-500 bg-[#050810]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-400">multidealprop.com</span> — Connecting investors with Non-QM &amp; Commercial Mortgage Brokers. All leads are exclusive and validated.
          </div>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
