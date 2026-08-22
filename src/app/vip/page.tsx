'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Star,
  Flame,
  CheckCircle2,
  Building2,
  BellRing
} from 'lucide-react';
import Link from 'next/link';

export default function VipPage() {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'vip_monthly' | 'vip_annual'>('starter');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      // 1. Enregistrement du lead
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          interested_in: `Tier Selection: ${selectedPlan}`
        })
      });

      // 2. Appel Checkout
      const res = await fetch('/api/checkout/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: selectedPlan })
      });

      const data = await res.json();
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        setSubscribed(true);
      }
    } catch (err) {
      console.error('Error starting checkout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const planTitles = {
    starter: 'Starter ($29/month)',
    vip_monthly: 'VIP Pro ($49/month)',
    vip_annual: 'VIP Pro Annual ($499/year)'
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500 text-black font-black text-xl w-9 h-9 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              M
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">MultiDeal<span className="text-emerald-400">Prop</span></span>
          </Link>

          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; Back to Deal Scanner
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-5 backdrop-blur shadow-inner">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          Choose Your Real Estate Cash-Flow Advantage
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
          Institutional Multi-Family <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Deal Flow</span> Plans.
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          From casual market tracking to high-speed 0-day early acquisitions. Lock in off-market duplexes and verified high-yield deals before retail buyers.
        </p>
      </section>

      {/* 3-Tier Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* TIER 1: FREE EXPLORER */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between backdrop-blur">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Explorer</div>
              <h3 className="text-xl font-black text-white mb-1">Free Tier</h3>
              <p className="text-xs text-slate-400 mb-5">For casual research &amp; public comps.</p>

              <div className="text-3xl font-black text-white mb-5">
                $0 <span className="text-xs text-slate-500 font-normal">/ forever</span>
              </div>

              <div className="space-y-3 pt-5 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Public feed with <strong>48-hour delay</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Basic Cap Rate &amp; Price estimates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Standard 5 default market filters</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Seller contact desk locked</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>No PDF due diligence exports</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white text-center font-bold text-xs py-3 rounded-xl transition-all block"
            >
              Continue Free
            </Link>
          </div>

          {/* TIER 2: STARTER ($29/mo) */}
          <div className={`bg-slate-900/90 border-2 ${selectedPlan === 'starter' ? 'border-cyan-500 shadow-xl shadow-cyan-500/10' : 'border-slate-800'} rounded-3xl p-6 flex flex-col justify-between relative transition-all`}>
            
            <div className="absolute -top-3 right-6 bg-cyan-500 text-black text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full shadow-md">
              Fast ROI
            </div>

            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Individual Investor
              </div>
              <h3 className="text-xl font-black text-white mb-1">Starter Pro</h3>
              <p className="text-xs text-slate-400 mb-5">Direct speed &amp; unlocked seller contacts.</p>

              <div className="text-3xl font-black text-white mb-5">
                $29 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>

              <div className="space-y-3 pt-5 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Zero-Day Speed :</strong> See deals 48h before public</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Direct Wholesaler Phone :</strong> Unlocked contacts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>10 PDF Due Diligence Packs :</strong> Audit exports/mo</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Full Airbnb Yield Matrix :</strong> Nightly STR comps</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Email Deal Alerts :</strong> Instant custom criteria drops</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlan('starter')}
              className={`mt-8 w-full font-bold text-xs py-3 rounded-xl transition-all cursor-pointer ${
                selectedPlan === 'starter'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {selectedPlan === 'starter' ? 'Selected: Starter ($29/mo)' : 'Select Starter Plan'}
            </button>
          </div>

          {/* TIER 3: VIP PRO ($49/mo or $499/yr) */}
          <div className={`bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] border-2 ${selectedPlan.startsWith('vip') ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20' : 'border-emerald-500/60'} rounded-3xl p-6 flex flex-col justify-between relative`}>
            
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-black text-[9px] uppercase tracking-widest font-black px-3 py-0.5 rounded-full shadow-md">
              Most Popular • Max Power
            </div>

            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> VIP Network Tier
              </div>
              <h3 className="text-xl font-black text-white mb-1">VIP Pro Elite</h3>
              <p className="text-xs text-slate-300 mb-4">Unlimited deal drops &amp; high-volume pipeline.</p>

              {/* Toggle Monthly / Annual */}
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center mb-4 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('vip_monthly')}
                  className={`flex-1 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPlan === 'vip_monthly' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  $49 / mo
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan('vip_annual')}
                  className={`flex-1 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPlan === 'vip_annual' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  $499 / yr <span className="text-[9px] ml-0.5 uppercase text-purple-900 font-extrabold">-15%</span>
                </button>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Everything in Starter Plan</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Unlimited PDF Due Diligence Packs</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Instant SMS &amp; WhatsApp Alerts :</strong> Cap Rate &gt; 12%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>3 Free County Scans Included :</strong> ($15 value/mo)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Verified Rent Rolls &amp; Leases</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!selectedPlan.startsWith('vip')) setSelectedPlan('vip_monthly');
              }}
              className={`mt-8 w-full font-bold text-xs py-3 rounded-xl transition-all cursor-pointer ${
                selectedPlan.startsWith('vip')
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {selectedPlan.startsWith('vip') ? `Selected: ${selectedPlan === 'vip_annual' ? 'VIP Annual ($499/yr)' : 'VIP Monthly ($49/mo)'}` : 'Select VIP Pro Plan'}
            </button>
          </div>

        </div>
      </section>

      {/* CHECKOUT ACTION BOX */}
      <section className="max-w-xl mx-auto px-4 pb-20">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
          {subscribed ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Subscription Order Initiated!</h3>
              <p className="text-xs text-slate-300 mb-4">
                You will receive confirmation and instant access setup in your inbox.
              </p>
              <Link href="/" className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
                Return to Live Deals
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Selected Plan</div>
                <h3 className="text-2xl font-black text-white">{planTitles[selectedPlan]}</h3>
                <p className="text-xs text-slate-400 mt-1">Enter your email to activate instant deal-flow access.</p>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your investor email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-black font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  {submitting ? 'Connecting to Stripe...' : `Proceed to Secure Checkout (${planTitles[selectedPlan]})`}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                <span>&check; 30-Day Money-Back</span>
                <span>&bull;</span>
                <span>&check; Cancel in 1-Click</span>
                <span>&bull;</span>
                <span>&check; Instant Activation</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070A10] text-slate-500 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p>&copy; {new Date().getFullYear()} MultiDealProp. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 max-w-xl mx-auto">
            MultiDealProp is an analytics engine. All financial computations are algorithmic projections for informational purposes.
          </p>
        </div>
      </footer>

    </div>
  );
}
