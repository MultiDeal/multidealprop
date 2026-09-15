'use client';

import React, { useState } from 'react';

export default function FinTechProHome() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: '5+ Units Multifamily',
    loanPurpose: 'Purchase',
    purchasePrice: '',
    noi: '',
    fico: '740+',
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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const propertyVal = Number(formData.purchasePrice) || 0;
    // Calcul automatique standard à 75% LTV si l'emprunteur n'a pas spécifié de ratio sur mesure
    const calculatedLoan = Math.round(propertyVal * 0.75);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType: formData.propertyType,
          loanPurpose: formData.loanPurpose,
          propertyValue: propertyVal,
          loanAmount: calculatedLoan,
          state: formData.state,
          creditScore: formData.fico,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          tcpa_accepted: formData.tcpa_accepted
        })
      });

      if (res.ok) {
        setSubmitted(true);

        // Déclencheur analytique pour Google Tag Manager si présent
        if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
          (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
            event: 'lead_submitted',
            lead_type: formData.propertyType,
            property_value: propertyVal
          });
        }
      } else {
        const errData = await res.json();
        alert(`Submission failed: ${errData.error || 'Please review your input fields.'}`);
      }
    } catch {
      alert('Network error. Unable to transmit deal parameters.');
    } finally {
      setLoading(false);
    }
  };

  // Balisage de données structurées JSON-LD (SEO Google)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Commercial & DSCR Loan Underwriting",
    "provider": {
      "@type": "Organization",
      "name": "MultiDealProp",
      "url": "https://multidealprop.com"
    },
    "category": "Commercial Real Estate Financing",
    "description": "Pre-qualify multifamily and DSCR real estate investments. Real-time routing to accredited private lenders with no W-2 tax requirements.",
    "areaServed": "US"
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* Balisage JSON-LD pour Google Rich Results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Ambiance d'arrière-plan avec dégradés légers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <header className="relative z-50 px-6 lg:px-12 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black text-lg">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            multidealprop<span className="text-cyan-500">.</span>
          </span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <a href="#platform" className="hover:text-cyan-400 transition-colors">Platform</a>
          <a href="#criteria" className="hover:text-cyan-400 transition-colors">Criteria</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Capital Online
        </div>
      </header>

      {/* Hero Header */}
      <main className="relative z-10 px-6 max-w-7xl mx-auto pt-12 pb-20">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Institutional Capital.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Data-Driven Approvals.
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Match your multifamily and DSCR deals directly with tier-1 private liquidity. Zero friction, zero hard credit pulls.
          </p>
        </div>

        {/* Bento Grid Formulaire & Widgets */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto" id="platform">
          
          {/* Formulaire de qualification multi-étapes */}
          <section className="lg:col-span-8 bg-[#0a0a0a]/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative min-h-[460px]">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                {submitted ? 'Deal Logged' : `Underwriting Engine — Phase 0${step}`}
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      step >= i ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-4 bg-white/10'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <span className="text-emerald-400 text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Algorithm Match Initiated</h3>
                <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                  Your deal parameters have been stored and transmitted to our lending desks. A specialist will review your loan-to-value metrics and deliver initial terms within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-6">
                
                {/* Phase 01 : Sélection de l'actif */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Asset Classification</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {['5+ Units Multifamily', '1-4 Residential', 'Mixed-Use'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, propertyType: type }))}
                            className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border ${
                              formData.propertyType === type
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Capital Requirement</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {['Purchase', 'Refinance', 'Cash-Out Refi'].map(purpose => (
                          <button
                            key={purpose}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, loanPurpose: purpose }))}
                            className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border ${
                              formData.loanPurpose === purpose
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {purpose}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      Proceed to Financials &rarr;
                    </button>
                  </div>
                )}

                {/* Phase 02 : Métriques financières */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Value / Price ($)</label>
                        <input
                          type="number"
                          name="purchasePrice"
                          required
                          placeholder="e.g. 1500000"
                          value={formData.purchasePrice}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Annual NOI ($)</label>
                        <input
                          type="number"
                          name="noi"
                          required
                          placeholder="e.g. 120000"
                          value={formData.noi}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Borrower FICO Score</label>
                        <select
                          name="fico"
                          value={formData.fico}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 appearance-none"
                        >
                          <option value="740+">740+ (Tier 1 Preferred)</option>
                          <option value="700-739">700 - 739</option>
                          <option value="660-699">660 - 699</option>
                          <option value="<660">Under 660</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Available Liquidity</label>
                        <select
                          name="liquidity"
                          value={formData.liquidity}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 appearance-none"
                        >
                          <option value="$100k - $250k">$100k - $250k</option>
                          <option value="$250k - $500k">$250k - $500k</option>
                          <option value="$500k+">$500k+</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase py-4 rounded-xl transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        Finalize Terms &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* Phase 03 : Coordonnées, géolocalisation & consentement TCPA */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
                      Deal metrics qualified. Enter your borrower contact details to generate official loan term sheets.
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Legal Name</label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Property State</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 appearance-none"
                        >
                          <option value="FL">Florida (FL)</option>
                          <option value="TX">Texas (TX)</option>
                          <option value="OH">Ohio (OH)</option>
                          <option value="GA">Georgia (GA)</option>
                          <option value="NC">North Carolina (NC)</option>
                          <option value="TN">Tennessee (TN)</option>
                          <option value="Other">Other U.S. State</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Corporate Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="investor@domain.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Direct Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="(555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="tcpa"
                        name="tcpa_accepted"
                        required
                        checked={formData.tcpa_accepted}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/50 accent-cyan-500 cursor-pointer"
                      />
                      <label htmlFor="tcpa" className="text-[10px] text-slate-500 leading-tight cursor-pointer">
                        By proceeding, I consent to receive loan quotes and underwriting communications from multidealprop.com and its accredited capital partners via email and SMS. TCPA compliant.
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase py-4 rounded-xl transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50"
                      >
                        {loading ? 'Routing File...' : 'Submit Deal Parameters'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </section>

          {/* Widgets d'indicateurs financiers */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6">
            <aside className="bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between group hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Requirements</div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-sm text-slate-400">DSCR Ratio</span>
                  <span className="text-lg font-bold text-white">&ge; 1.15x</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-sm text-slate-400">Max LTV</span>
                  <span className="text-lg font-bold text-white">80%</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-slate-400">W-2 Required</span>
                  <span className="text-sm font-bold text-emerald-400">None</span>
                </div>
              </div>
            </aside>

            <aside className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center">
              <div className="relative z-10">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Network Capacity</div>
                <div className="text-4xl font-black text-white tracking-tighter mb-2">$50M+</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct API routing to verified Non-QM lenders, commercial private bridge funds, and agency underwriters.
                </p>
              </div>
            </aside>
          </div>

        </div>
      </main>

      {/* Preuve Sociale : Logos des Partenaires Institutionnels */}
      <section className="border-t border-white/5 bg-[#030303] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 mb-8">
            Capital deployed through industry-leading lending partners
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
              </div>
              <span className="text-xl font-black tracking-tighter text-white">COREVEST<span className="font-light text-slate-400">.</span></span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white italic tracking-tighter leading-none">LIMA</span>
              <div className="h-4 w-px bg-white/50"></div>
              <span className="text-sm font-bold tracking-widest text-white">ONE</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-white text-2xl font-black leading-none">▲</span>
              <span className="text-2xl font-extrabold tracking-tight text-white">Kiavi</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 5l5 10H7l5-10z"/>
              </svg>
              <span className="text-xl font-bold tracking-[0.2em] text-white">ARBOR</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-white text-2xl font-black italic leading-none">V</span>
              <span className="text-lg font-bold tracking-tight text-white">Visio Lending</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              256-Bit Bank Level Encryption
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              TCPA Compliant Data Routing
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
              Zero Impact on Credit Score
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 : How It Works */}
      <section id="how-it-works" className="border-t border-white/5 py-24 px-6 bg-[#030303] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Streamlined Capital Deployment</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm">
              Bypass traditional banking friction. Our process is engineered for active real estate investors acquiring multifamily units or leveraging DSCR financing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors">
              <div className="text-cyan-500 font-mono text-sm mb-4">01</div>
              <h3 className="text-lg font-bold text-white mb-3">Submit Deal Parameters</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Input your property details, projected or actual Net Operating Income (NOI), and capital requirements into our secure underwriting engine.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors">
              <div className="text-cyan-500 font-mono text-sm mb-4">02</div>
              <h3 className="text-lg font-bold text-white mb-3">Algorithmic Matching</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our platform filters your metrics against active underwriting guidelines from top Non-QM, bridge, and commercial capital providers across the US.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] transition-colors">
              <div className="text-cyan-500 font-mono text-sm mb-4">03</div>
              <h3 className="text-lg font-bold text-white mb-3">Receive Term Sheets</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect directly with matched underwriters. Review preliminary terms, interest rates, and leverage options within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Tableau des critères de financement (SEO) */}
      <section id="criteria" className="py-24 px-6 bg-[#050505] relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Core Lending Guidelines</h2>
            <p className="text-slate-400 mt-3 text-sm">Typical benchmarks for commercial and DSCR investment property financing.</p>
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a0a]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4">Metric</th>
                  <th className="px-6 py-4">Standard Requirement</th>
                  <th className="px-6 py-4">Underwriting Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">Debt Service Coverage (DSCR)</td>
                  <td className="px-6 py-4">&ge; 1.00x - 1.25x</td>
                  <td className="px-6 py-4 text-slate-500">No-ratio options available with lower leverage.</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">Maximum LTV</td>
                  <td className="px-6 py-4">Up to 80%</td>
                  <td className="px-6 py-4 text-slate-500">75% max typically for Cash-Out Refinancing.</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">Minimum FICO</td>
                  <td className="px-6 py-4">660+</td>
                  <td className="px-6 py-4 text-slate-500">Tier 1 rates unlocked at 720+ FICO.</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">Income Verification</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">None (No W-2)</td>
                  <td className="px-6 py-4 text-slate-500">Qualification based strictly on asset revenue.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3 : Foire aux questions (FAQ SEO) */}
      <section id="faq" className="border-t border-white/5 py-24 px-6 bg-[#030303] relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">What is a DSCR Loan?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A Debt Service Coverage Ratio (DSCR) loan allows real estate investors to qualify for capital based on property cash flow rather than personal income. Lenders do not require personal tax returns or employment verification.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">How fast can a multifamily deal close?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Because private and Non-QM lenders evaluate property performance over borrower tax files, closings are expedited, typically taking between 14 and 28 business days depending on appraisal timelines.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Can I close under an LLC or Corporate Entity?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Yes. Commercial and DSCR loans are strictly business-purpose financing. Lenders actively support and encourage vesting in an LLC, Corporation, or Limited Partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Légal Institutionnel */}
      <footer className="border-t border-white/10 bg-[#000000] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2 opacity-50 grayscale">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                <span className="text-white font-black text-[10px]">M</span>
              </div>
              <span className="font-bold tracking-tight text-white text-sm">multidealprop.</span>
            </div>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="text-center md:text-left text-[11px] text-slate-600 leading-relaxed max-w-4xl">
            <p className="mb-2">© {new Date().getFullYear()} MultiDealProp. All rights reserved.</p>
            <p>
              MultiDealProp operates as an introductory platform connecting investors with commercial mortgage brokers and private lending institutions. All loan terms, approvals, and rates are set by participating underwriters in accordance with property cash flows and risk profiles. Financing is strictly for commercial, business-purpose investments (non-owner occupied).
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
