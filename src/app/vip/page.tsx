'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VipContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (tier: 'starter' | 'vip') => {
    try {
      setLoadingPlan(tier);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Unable to initiate checkout. Please try again.');
        setLoadingPlan(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('A network error occurred.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Post-Purchase Success Alert Banner */}
        {isSuccess && (
          <div className="mb-12 p-6 sm:p-8 bg-[#0d1527] border-2 border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/40 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-2xl shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Payment Confirmed
                  </span>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                  Welcome to MultiDealProp Intelligence Desk!
                </h2>
                
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Your membership account is now fully active. An official confirmation email with your direct access details has been dispatched from <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700">deals@multidealprop.com</span>.
                </p>

                {/* Yahoo / Outlook / Spam Delivery Guidance */}
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span>⚠️</span> Important Notice for Yahoo, Hotmail & Outlook Users:
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If our confirmation email landed in your <strong>Spam or Junk folder</strong>, links and buttons will remain disabled by your email provider. Please open the email and click <strong>"Not Spam"</strong> (or move it to your Primary Inbox) to unlock the live feed button and guarantee receipt of instant deal alerts.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/deals"
                    className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20"
                  >
                    Access Live Deals Feed &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Direct Institutional Intelligence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Institutional Off-Market Multifamily & Commercial Deal Flow
          </h1>
          <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
            Gain immediate access to verified off-market assignment contracts, unmasked property addresses, deep underwriting vaults, and direct wholesaler contact lines.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Plan 1: Pro Starter */}
          <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition duration-200 shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  Standard Access
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">Pro Starter</h3>
              <p className="text-slate-400 text-sm mt-1">Essential deal intelligence for active real estate investors.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white">$29</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-6">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Included with Starter:</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Unmasked Addresses:</strong> Full street address & APN parcel records.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Direct Wholesaler Contacts:</strong> Phone numbers & verified direct emails.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Financial Underwriting:</strong> Pro-forma cashflows, Cap Rates, and rent rolls.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>1-Click LOI Generator:</strong> Generate legal Letter of Intent PDFs instantly.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => handleCheckout('starter')}
                disabled={loadingPlan === 'starter'}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm py-4 rounded-xl transition duration-200 border border-slate-700 disabled:opacity-50"
              >
                {loadingPlan === 'starter' ? 'Connecting to Stripe...' : 'Activate Pro Starter Plan ($29/mo)'}
              </button>
            </div>
          </div>

          {/* Plan 2: VIP Elite */}
          <div className="bg-[#0d1527] border-2 border-emerald-500/50 rounded-3xl p-8 flex flex-col justify-between relative hover:border-emerald-400 transition duration-200 shadow-2xl shadow-emerald-950/30">
            <div className="absolute -top-3.5 right-8">
              <span className="bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg">
                Most Popular • Complete Desk
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Priority Access
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">VIP Elite</h3>
              <p className="text-slate-400 text-sm mt-1">First-look exclusivity and custom deal-sourcing requests.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white">$49</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-6">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">Everything in Starter, plus:</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold shrink-0">★</span>
                    <span><strong>48-Hour Priority Window:</strong> View newly contracted deals 48 hours before general release.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold shrink-0">★</span>
                    <span><strong>5 Free Custom City Scans:</strong> On-demand underwriting scans in your targeted zip codes every month.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Full Due Diligence Vaults:</strong> Institutional underwriting spreadsheets & rehab repair estimates.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>Priority Wholesaler Desk:</strong> Fast-track communication routing directly to assignors.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => handleCheckout('vip')}
                disabled={loadingPlan === 'vip'}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider py-4 rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loadingPlan === 'vip' ? 'Connecting to Stripe...' : 'Activate VIP Elite Plan ($49/mo)'}
              </button>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 border-t border-slate-800 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-black text-white">Why Real Estate Investors Rely on MultiDealProp</h2>
            <p className="text-slate-400 text-sm mt-2">Zero broker markups. Direct contact with primary wholesale contract holders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0d1527] border border-slate-800/80 p-6 rounded-2xl">
              <div className="text-2xl mb-3">⚡</div>
              <h4 className="text-white font-bold text-base mb-1">Direct Assignment Contracts</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect directly with principal wholesalers and assignors. No secondary daisy chains or inflated middleman assignment fees.
              </p>
            </div>

            <div className="bg-[#0d1527] border border-slate-800/80 p-6 rounded-2xl">
              <div className="text-2xl mb-3">📊</div>
              <h4 className="text-white font-bold text-base mb-1">Standardized Underwriting</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every deal includes audited pro-forma statements, current actuals, capitalization rate calculations, and projected value-add upside.
              </p>
            </div>

            <div className="bg-[#0d1527] border border-slate-800/80 p-6 rounded-2xl">
              <div className="text-2xl mb-3">📄</div>
              <h4 className="text-white font-bold text-base mb-1">Instant Legal LOI Submissions</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate tailored, professional Letter of Intent documents in seconds with pre-populated purchase price and contingency terms.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto border-t border-slate-800 pt-16">
          <h3 className="text-xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div className="bg-[#0d1527] border border-slate-800 p-5 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-1">Can I cancel my membership at any time?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes. There are no contracts or long-term commitments. You can cancel your subscription with 1 click directly inside your billing settings at any time.
              </p>
            </div>

            <div className="bg-[#0d1527] border border-slate-800 p-5 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-1">How often are new off-market properties added?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our desk continuously sources and audits new multifamily and commercial contract opportunities daily across primary and secondary US markets.
              </p>
            </div>

            <div className="bg-[#0d1527] border border-slate-800 p-5 rounded-xl">
              <h4 className="text-sm font-bold text-white mb-1">How do the VIP On-Demand Custom City Scans work?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                VIP Elite subscribers can request up to 5 custom acquisition scans per month by specifying target zip codes, minimum unit count, or cap rate parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-xs text-slate-600 border-t border-slate-800/60 pt-8">
          MultiDealProp Inc. • Institutional Real Estate Intelligence & Deal Flow Desk
        </div>

      </div>
    </div>
  );
}

export default function VipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">Loading MultiDealProp Desk...</div>}>
      <VipContent />
    </Suspense>
  );
}
