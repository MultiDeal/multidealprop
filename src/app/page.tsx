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
    fico: '720+',
    liquidity: '$100k+',
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
    // Simulation API Supabase call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  // SEO JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Commercial & DSCR Loan Underwriting",
    "provider": {
      "@type": "Organization",
      "name": "MultiDealProp",
      "url": "https://multidealprop.com"
    },
    "description": "Pre-qualify multifamily and DSCR real estate deals instantly. No hard credit pull. Connect with top US lenders.",
    "areaServed": "US"
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* INJECTION SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* AMBIANCE LUMINEUSE (AURORA EFFECTS) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-50 px-6 lg:px-12 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black text-lg">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            multidealprop<span className="text-cyan-500">.</span>
          </span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Platform</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Criteria</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Lenders</a>
        </nav>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Capital Online
        </div>
      </header>

      <main className="relative z-10 px-6 max-w-7xl mx-auto pt-12 pb-24">
        
        {/* HERO TITRE */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Institutional Capital.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Data-Driven Approvals.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Match your multifamily and DSCR deals directly with tier-1 private liquidity. Zero friction, zero hard credit pulls.
          </p>
        </div>

        {/* BENTO GRID (LE CŒUR DE LA CONVERSION) */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          
          {/* COLONNE GAUCHE : L'ENGINE DE QUALIFICATION MULTI-ÉTAPES */}
          <section className="lg:col-span-8 bg-[#0a0a0a]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Barre de progression stylisée */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                {submitted ? 'Deal Logged' : `Underwriting Engine — Phase 0${step}`}
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-4 bg-white/10'}`} />
                ))}
              </div>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <span className="text-emerald-400 text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Algorithm Match Initiated</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Your deal parameters have been encrypted and routed. Matching lending desks will contact you within 24 hours with preliminary term sheets.
                </p>
              </div>
            ) : (
              <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-6">
                
                {/* ETAPE 1 : L'ACTIF IMMOBILIER */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Asset Classification</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {['5+ Units Multifamily', '1-4 Residential', 'Mixed-Use'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, propertyType: type }))}
                            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                              formData.propertyType === type 
                              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Capital Requirement</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {['Purchase', 'Refinance', 'Cash-Out Refi'].map(purpose => (
                          <button
                            key={purpose}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, loanPurpose: purpose }))}
                            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                              formData.loanPurpose === purpose 
                              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {purpose}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full mt-4 bg-white text-black hover:bg-slate-200 font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Proceed to Financials &rarr;
                    </button>
                  </div>
                )}

                {/* ETAPE 2 : LES CHIFFRES (NOI, VALUE, FICO) */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Value ($)</label>
                        <input 
                          type="number" name="purchasePrice" required placeholder="e.g. 1500000"
                          value={formData.purchasePrice} onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Annual NOI ($)</label>
                        <input 
                          type="number" name="noi" required placeholder="e.g. 120000"
                          value={formData.noi} onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Borrower FICO</label>
                        <select 
                          name="fico" value={formData.fico} onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                        >
                          <option value="740+">740+ (Tier 1)</option>
                          <option value="700-739">700 - 739</option>
                          <option value="660-699">660 - 699</option>
                          <option value="<660">Under 660</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Available Liquidity</label>
                        <select 
                          name="liquidity" value={formData.liquidity} onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                        >
                          <option value="$100k - $250k">$100k - $250k</option>
                          <option value="$250k - $500k">$250k - $500k</option>
                          <option value="$500k+">$500k+</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase py-4 rounded-xl transition-all">
                        Back
                      </button>
                      <button type="submit" className="w-2/3 bg-white text-black hover:bg-slate-200 font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        Finalize Terms &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* ETAPE 3 : LE CONTACT / ROUTING */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
                      Based on your metrics, you qualify for expedited underwriting. Enter your routing details to receive official term sheets.
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                      <input 
                        type="text" name="fullName" required placeholder="John Doe"
                        value={formData.fullName} onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Corporate Email</label>
                        <input 
                          type="email" name="email" required placeholder="john@company.com"
                          value={formData.email} onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Direct Phone</label>
                        <input 
                          type="tel" name="phone" required placeholder="(555) 000-0000"
                          value={formData.phone} onChange={handleChange}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input 
                        type="checkbox" id="tcpa" name="tcpa_accepted" required
                        checked={formData.tcpa_accepted} onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/50 accent-cyan-500"
                      />
                      <label htmlFor="tcpa" className="text-[10px] text-slate-500 leading-tight cursor-pointer">
                        By proceeding, I consent to receive loan quotes and communications from multidealprop.com and its accredited capital partners via email and SMS. TCPA compliant routing.
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase py-4 rounded-xl transition-all">
                        Back
                      </button>
                      <button type="submit" disabled={loading} className="w-2/3 relative group bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -translate-x-full skew-x-12" />
                        {loading ? 'Routing File...' : 'Submit Deal Parameters'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </section>

          {/* COLONNE DROITE : METRIQUES "WIDGET" STYLE IOS/VERCEL */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6">
            
            {/* Widget 1 */}
            <aside className="bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between group hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Requirements</div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
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

            {/* Widget 2 */}
            <aside className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
               </div>
               <div className="relative z-10">
                 <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Network Capacity</div>
                 <div className="text-4xl font-black text-white tracking-tighter mb-2">$50M+</div>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Direct API connections to nation-wide Non-QM lenders, bridge funds, and agency underwriters.
                 </p>
               </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}
