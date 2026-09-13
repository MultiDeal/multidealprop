'use client';

import React, { useState } from 'react';

export default function MultidealpropHome() {
  // Modal de coordonnées après avoir cliqué sur "SEE MY OPTIONS"
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Valeurs du formulaire
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
    state: 'FL',
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

  const handleSeeOptions = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
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
          creditScore: formData.fico,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          tcpa_accepted: formData.tcpa_accepted,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Erreur lors de la soumission. Veuillez vérifier les informations.');
      }
    } catch {
      alert('Erreur réseau. Veuillez réessayer.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08202d] via-[#061924] to-[#040e16] text-white font-sans selection:bg-[#dca43b] selection:text-slate-950">
      
      {/* ================= 1. HEADER / NAVIGATION ================= */}
      <header className="px-6 lg:px-12 py-5 max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo exact : M géométrique + MULTI DEALPROP */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* SVG Logo reproduisant le monogramme M architectural */}
            <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10 drop-shadow-md">
              <path d="M6 36V16L16 28L22 20L28 28L38 16V36" stroke="#dca43b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 36V22L22 34L32 22V36" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Petits barreaux d'immeubles stylisés */}
              <rect x="19" y="27" width="2" height="9" fill="#22d3ee" />
              <rect x="23" y="27" width="2" height="9" fill="#22d3ee" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="text-xl font-black tracking-tight text-white block">MULTI</span>
            <span className="text-sm font-bold tracking-[0.25em] text-[#22d3ee] block -mt-1">DEALPROP</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase text-slate-300">
          <a href="#how-it-works" className="hover:text-[#dca43b] transition-colors">HOW IT WORKS</a>
          <a href="#deal-box" className="hover:text-[#dca43b] transition-colors">DEAL CALCULATORS</a>
          <a href="#deal-box" className="hover:text-[#dca43b] transition-colors">FOR INVESTORS</a>
          <a href="#partners" className="hover:text-[#dca43b] transition-colors">FOR LENDERS</a>
          <a href="#deal-box" className="hover:text-[#dca43b] transition-colors">RESOURCES</a>
        </nav>

        {/* Bouton doré GET QUALIFIED */}
        <button
          onClick={() => {
            const el = document.getElementById('deal-box');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-gradient-to-r from-[#e5aa3a] to-[#c98e26] hover:from-[#f0b543] hover:to-[#d89729] text-slate-950 font-black text-xs uppercase px-6 py-2.5 rounded shadow-lg shadow-amber-500/20 tracking-wider transition-all active:scale-95"
        >
          GET QUALIFIED
        </button>
      </header>

      {/* ================= 2. HERO HEADLINE ================= */}
      <section className="pt-8 pb-10 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold tracking-tight text-[#e5aa3a] uppercase leading-[1.15] drop-shadow-sm">
          QUALIFY YOUR MULTIFAMILY DEALS &amp; ACCESS CAPITAL FASTER.
        </h1>
        <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
          Get instant pre-approval terms for DSCR, Bridge, &amp; Commercial Loans from $1M to $50M+. Connecting Active Real Estate Investors with Leading U.S. Lenders.
        </p>
      </section>

      {/* ================= 3. LE DOUBLE BLOC HERO (Formulaire + Métriques) ================= */}
      <section id="deal-box" className="px-4 sm:px-6 lg:px-8 pb-16 max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* GAUCHE : LE FORMULAIRE INTERACTIF (8 colonnes) */}
          <div className="lg:col-span-8 bg-[#092230]/90 border-2 border-[#16557a] rounded-xl p-5 sm:p-7 shadow-2xl relative backdrop-blur-sm">
            {/* Titre doré centré */}
            <div className="text-center pb-5 mb-5 border-b border-[#144766]">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-[#e5aa3a] uppercase">
                GET LENDER-READY IN 2 MINUTES
              </h2>
            </div>

            <form onSubmit={handleSeeOptions} className="space-y-4">
              {/* Ligne 1 : Step 1 (Property Type) & Step 2 (Loan Purpose) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Step 1: Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-900 font-medium rounded px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]"
                  >
                    <option value="5+ Units Multifamily">5+ Units Multifamily</option>
                    <option value="1-4 Residential">1-4 Residential</option>
                    <option value="Mixed-Use">Mixed-Use</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Step 2: Loan Purpose
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Purchase', 'Refinance', 'Cash-Out Refi'].map((purpose) => (
                      <button
                        key={purpose}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, loanPurpose: purpose }))}
                        className={`text-[10px] font-extrabold py-2 px-1 rounded uppercase tracking-tight transition-all border ${
                          formData.loanPurpose === purpose
                            ? 'bg-gradient-to-b from-[#e5aa3a] to-[#c98e26] text-slate-950 border-[#b8801e] shadow-sm'
                            : 'bg-[#10384f] text-slate-200 border-[#1c5a7f] hover:bg-[#164966]'
                        }`}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ligne 2 : Step 3 (Purchase Price / Value) & Step 3 répétée/Loan Amount */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Step 3: Purchase Price / Value
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="purchasePrice"
                      required
                      placeholder="$ Input"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      className="w-full bg-white text-slate-900 font-medium rounded px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22d3ee] placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Step 3: Requested Loan Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="$ Input"
                      className="w-full bg-white text-slate-900 font-medium rounded px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22d3ee] placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Ligne 3 : Step 4 (NOI) & LE GROS BOUTON DORÉ "SEE MY OPTIONS" */}
              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Step 4: Annual Net Operating Income (NOI)
                  </label>
                  <input
                    type="number"
                    name="noi"
                    placeholder="$ Input"
                    value={formData.noi}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-900 font-medium rounded px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22d3ee] placeholder:text-slate-400"
                  />
                </div>

                {/* Bouton doré reproduit à l'identique */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-b from-[#e5aa3a] to-[#c98e26] hover:from-[#f0b543] hover:to-[#d89729] text-slate-950 font-black text-sm uppercase py-2.5 px-4 rounded border border-[#b8801e] shadow-md tracking-wider transition-transform active:scale-[0.99]"
                  >
                    SEE MY OPTIONS
                  </button>
                </div>
              </div>

              {/* Ligne 4 : Step 5 (FICO score) & Liquidity */}
              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Step 5: FICO score
                  </label>
                  <select
                    name="fico"
                    value={formData.fico}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-900 font-medium rounded px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]"
                  >
                    <option value="720+">720+ (Premier Tier)</option>
                    <option value="680-719">680 - 719</option>
                    <option value="650-679">650 - 679</option>
                    <option value="<650">Under 650</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Liquidity Inputs
                  </label>
                  <select
                    name="liquidity"
                    value={formData.liquidity}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-900 font-medium rounded px-3 py-2 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]"
                  >
                    <option value="$100k+">$100k+</option>
                    <option value="$250k+">$250k+</option>
                    <option value="$500k+">$500k+</option>
                    <option value="$1M+">$1M+</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* DROITE : LE PANNEAU "KEY LENDER METRICS" (4 colonnes) */}
          <div className="lg:col-span-4 relative flex flex-col justify-center pl-2 lg:pl-6">
            {/* Flèche ascendante géante translucide en arrière-plan (exactement comme sur l'image) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
              <svg width="180" height="240" viewBox="0 0 100 140" fill="none">
                <path d="M50 10 L90 60 H65 V130 H35 V60 H10 Z" fill="#22d3ee" />
              </svg>
            </div>

            {/* Titre doré */}
            <h3 className="text-base sm:text-lg font-black tracking-wider text-[#e5aa3a] uppercase mb-6 drop-shadow">
              KEY LENDER METRICS
            </h3>

            {/* Contenu avec le graphique à barres dorées */}
            <div className="flex items-center gap-6 relative z-10">
              {/* Barres du graphique stylisées avec la flèche */}
              <div className="shrink-0 w-24 h-24 relative flex items-end justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Les 4 barres ascendantes dorées */}
                  <rect x="10" y="60" width="14" height="35" rx="2" fill="#dca43b" />
                  <rect x="30" y="45" width="14" height="50" rx="2" fill="#dca43b" />
                  <rect x="50" y="30" width="14" height="65" rx="2" fill="#dca43b" />
                  <rect x="70" y="15" width="14" height="80" rx="2" fill="#dca43b" />
                  {/* Flèche montante au-dessus des barres */}
                  <path d="M12 52 L32 38 L52 24 L78 8" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                  <path d="M68 8 H78 V18" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Les 3 lignes métriques dorées */}
              <div className="space-y-3">
                <div className="text-base sm:text-lg font-black text-[#e5aa3a] tracking-tight">
                  DSCR Ratio &gt; 1.20x
                </div>
                <div className="text-base sm:text-lg font-black text-[#e5aa3a] tracking-tight">
                  Min FICO 720+
                </div>
                <div className="text-base sm:text-lg font-black text-[#e5aa3a] tracking-tight">
                  Min Liquidity $100k+
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 4. BANDE BLANCHE "HOW IT WORKS" ================= */}
      <section id="how-it-works" className="bg-white text-slate-900 py-10 px-6">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase mb-8">
            HOW IT WORKS
          </h2>

          {/* Les 3 bannières de chevron exactes de l'image */}
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-[#0b2230] text-white font-black text-xs sm:text-sm uppercase py-4 px-6 rounded-md flex items-center justify-center tracking-wider shadow-md">
              1. Enter Deal Info
            </div>
            <div className="bg-[#0b2230] text-white font-black text-xs sm:text-sm uppercase py-4 px-6 rounded-md flex items-center justify-center tracking-wider shadow-md">
              2. Get Prelim. Terms
            </div>
            <div className="bg-[#0b2230] text-white font-black text-xs sm:text-sm uppercase py-4 px-6 rounded-md flex items-center justify-center tracking-wider shadow-md">
              3. Connect &amp; Close
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. FEATURED LENDER PARTNERS ================= */}
      <section id="partners" className="bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 py-10 px-6 border-t border-slate-300">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 mb-6">
            FEATURED LENDER PARTNERS
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-300/80 p-6 flex flex-wrap items-center justify-around gap-8">
            {/* Logo Kiavi */}
            <div className="flex items-center gap-2">
              <span className="text-[#10b981] text-2xl font-black leading-none">▲</span>
              <span className="text-xl font-extrabold tracking-tight text-slate-800">Kiavi</span>
            </div>

            {/* Logo Visio Lending */}
            <div className="flex items-center gap-2">
              <span className="text-[#2563eb] text-2xl font-black italic leading-none">V</span>
              <span className="text-lg font-bold tracking-tight text-slate-800">Visio Lending</span>
            </div>

            {/* Logo Civic Financial */}
            <div className="flex items-center gap-2">
              <span className="text-[#0284c7] text-2xl font-black leading-none">C</span>
              <span className="text-lg font-bold tracking-tight text-slate-800">Civic Financial</span>
            </div>

            {/* Badge Secure & TCPA Compliant */}
            <div className="flex items-center gap-2 border border-emerald-600 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded text-xs font-black tracking-wider uppercase">
              <span className="text-emerald-600 text-base">✓</span>
              <span>SECURE &amp; TCPA COMPLIANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. FOOTER ================= */}
      <footer className="bg-[#051119] border-t border-[#0d2a3d] text-slate-400 py-10 px-6 text-xs">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#0d2a3d] pb-6">
            <div className="text-sm font-black text-white tracking-wider">
              multidealprop.com
            </div>
            <div className="flex gap-6 font-semibold">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-[11px] text-slate-500 max-w-2xl mx-auto pt-2 leading-relaxed">
            Connecting investors with Non-QM &amp; Commercial Mortgage Brokers. All leads are exclusive and validated. Commercial business-purpose financing only.
          </div>
        </div>
      </footer>

      {/* ================= MODAL FINALISATION COORDONNÉES (Se déclenche au clic sur SEE MY OPTIONS) ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#092230] border-2 border-[#16557a] w-full max-w-lg rounded-xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center font-bold text-xl border border-emerald-500/50">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Parameters Submitted</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Your deal has been sent to our desk underwriters. A quote sheet will be transmitted to your email within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSubmitted(false);
                  }}
                  className="bg-[#e5aa3a] text-slate-950 font-bold text-xs uppercase px-6 py-2.5 rounded mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <h3 className="text-base font-black text-[#e5aa3a] uppercase tracking-wider mb-2">
                  Receive Your Preliminary Term Sheet
                </h3>
                <p className="text-slate-300 text-xs mb-4">
                  Where should our participating lenders send the DSCR pre-approval options for this property?
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white text-slate-900 rounded px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white text-slate-900 rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Direct Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white text-slate-900 rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="tcpa-modal"
                    name="tcpa_accepted"
                    required
                    checked={formData.tcpa_accepted}
                    onChange={handleChange}
                    className="mt-1 accent-[#e5aa3a]"
                  />
                  <label htmlFor="tcpa-modal" className="text-[10px] text-slate-300 leading-tight">
                    I agree to receive rate sheets and loan quotes from multidealprop.com and partner lending desks at the number provided. TCPA compliant.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-[#e5aa3a] to-[#c98e26] hover:from-[#f0b543] hover:to-[#d89729] disabled:opacity-50 text-slate-950 font-black text-xs uppercase py-3 rounded shadow-md tracking-wider transition-all"
                >
                  {loading ? 'Transmitting...' : 'CONFIRM & RECEIVE TERMS'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
