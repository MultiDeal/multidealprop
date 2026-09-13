'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: '5+ Units Multifamily',
    loanPurpose: 'Purchase',
    propertyValue: '',
    loanAmount: '',
    state: 'FL',
    creditScore: '720-740+',
    fullName: '',
    email: '',
    phone: '',
    tcpa_accepted: false
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

    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert('Error submitting lead. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded font-mono text-sm">MULTI</span>
            <span>DEALPROP</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span className="hidden sm:inline">Commercial & DSCR Lending Portal</span>
            <a href="#qualify" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg transition-colors">
              Get Terms
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <span>National Lending Network</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Fast Capital for Multifamily & DSCR Deals.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Connect directly with verified Non-QM and commercial private lenders across the US. Approvals based on asset cashflow — no W-2 tax returns required.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-2xl font-black text-cyan-400">$100k-$25M</div>
                <div className="text-xs text-slate-500">Loan Amounts</div>
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-400">Up to 80%</div>
                <div className="text-xs text-slate-500">LTV Leverage</div>
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-400">14 Days</div>
                <div className="text-xs text-slate-500">Target Close</div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div id="qualify" className="lg:col-span-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <span className="text-sm font-semibold tracking-wide text-cyan-400">
                {submitted ? 'COMPLETED' : `STEP ${step} OF 3`}
              </span>
              <span className="text-xs text-slate-500">No Hard Credit Pull</span>
            </div>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-full mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-white">Deal Submitted</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Your parameters have been logged. A matched lending desk will review your DSCR/LTV criteria and follow up directly within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-4">
                {/* Step 1: Asset Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Property Type</label>
                      <select 
                        name="propertyType" 
                        value={formData.propertyType} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      >
                        <option value="5+ Units Multifamily">5+ Units Multifamily</option>
                        <option value="1-4 Family Residential">1-4 Family Residential</option>
                        <option value="Mixed-Use Commercial">Mixed-Use Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Loan Purpose</label>
                      <select 
                        name="loanPurpose" 
                        value={formData.loanPurpose} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      >
                        <option value="Purchase">Purchase</option>
                        <option value="Refinance (Rate & Term)">Refinance (Rate & Term)</option>
                        <option value="Cash-Out Refinance">Cash-Out Refinance</option>
                        <option value="Bridge / Value-Add">Bridge / Value-Add</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Property State</label>
                      <select 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      >
                        <option value="FL">Florida</option>
                        <option value="TX">Texas</option>
                        <option value="OH">Ohio</option>
                        <option value="GA">Georgia</option>
                        <option value="NC">North Carolina</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 rounded-lg transition-all text-sm tracking-wide">
                      Continue to Loan Details →
                    </button>
                  </div>
                )}

                {/* Step 2: Financial Metrics */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Estimated Value / Purchase Price ($)</label>
                      <input 
                        type="number" 
                        name="propertyValue" 
                        required
                        placeholder="e.g. 1200000"
                        value={formData.propertyValue} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Requested Loan Amount ($)</label>
                      <input 
                        type="number" 
                        name="loanAmount" 
                        required
                        placeholder="e.g. 900000"
                        value={formData.loanAmount} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Estimated Credit Score (FICO)</label>
                      <select 
                        name="creditScore" 
                        value={formData.creditScore} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      >
                        <option value="740+">740+ (Excellent)</option>
                        <option value="700-739">700 - 739 (Good)</option>
                        <option value="660-699">660 - 699 (Fair)</option>
                        <option value="<660">Under 660</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-lg transition-colors text-sm">
                        Back
                      </button>
                      <button type="submit" className="w-2/3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 rounded-lg transition-all text-sm">
                        Continue to Contact →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact & TCPA Consent */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        name="fullName" 
                        required
                        placeholder="John Doe"
                        value={formData.fullName} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Business Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        placeholder="john@example.com"
                        value={formData.email} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required
                        placeholder="(555) 000-0000"
                        value={formData.phone} 
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    
                    {/* Mandatory TCPA Checkbox */}
                    <div className="flex items-start gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="tcpa"
                        name="tcpa_accepted" 
                        required
                        checked={formData.tcpa_accepted}
                        onChange={handleChange}
                        className="mt-1 accent-cyan-500 rounded cursor-pointer"
                      />
                      <label htmlFor="tcpa" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                        By submitting, I agree to receive loan quotes and communications from multidealprop.com and partner lending desks at the phone number provided. Consent is not required to purchase.
                      </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-lg transition-colors text-sm">
                        Back
                      </button>
                      <button type="submit" disabled={loading} className="w-2/3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-lg transition-all text-sm">
                        {loading ? 'Processing...' : 'Get Loan Terms'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Trust & Criteria Grid */}
      <section className="border-t border-slate-900 bg-slate-900/40 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Program Lending Standards</h2>
            <p className="text-slate-400 text-sm">Fast-track qualifications designed for active real estate investors.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="text-cyan-400 font-mono text-xs mb-1">01 / DEBT SERVICE</div>
              <div className="text-xl font-bold text-white mb-2">1.00x - 1.25x DSCR</div>
              <p className="text-slate-400 text-xs leading-relaxed">Calculated using property net operating income or gross market rent against PITI debt service.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="text-cyan-400 font-mono text-xs mb-1">02 / LEVERAGE</div>
              <div className="text-xl font-bold text-white mb-2">Up to 80% LTV</div>
              <p className="text-slate-400 text-xs leading-relaxed">Available for acquisitions. Refinance cash-out options structured up to 75% loan-to-value.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="text-cyan-400 font-mono text-xs mb-1">03 / BORROWER</div>
              <div className="text-xl font-bold text-white mb-2">No W-2 Forms</div>
              <p className="text-slate-400 text-xs leading-relaxed">No personal tax returns or employment verification required. Entity close supported (LLC, Corp).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <div className="text-cyan-400 font-mono text-xs mb-1">04 / SPEED</div>
              <div className="text-xl font-bold text-white mb-2">Expedited Close</div>
              <p className="text-slate-400 text-xs leading-relaxed">Desk-based underwriting and streamlined appraisals allow closings in 14 to 21 business days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 multidealprop.com. All rights reserved. Commercial and private business-purpose financing only.</p>
      </footer>
    </div>
  );
}
