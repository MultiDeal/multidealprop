'use client';

import { useState } from 'react';
import { 
  Check, 
  Zap, 
  Lock, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Layers,
  FileCheck2,
  BellRing,
  CreditCard,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function VipPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'vip'>('vip');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    const planCode = selectedPlan === 'starter' 
      ? 'starter' 
      : (billingCycle === 'annual' ? 'vip_annual' : 'vip_monthly');

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          interested_in: `Tier Selection: ${planCode}`
        })
      });

      const res = await fetch('/api/checkout/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: planCode })
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

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 selection:bg-emerald-500 selection:text-black antialiased relative">
      
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Top Bar */}
      <header className="border-b border-slate-800/60 bg-[#06080F]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-emerald-500 text-black font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="font-bold text-base tracking-tight text-white">MultiDeal<span className="text-emerald-400">Prop</span></span>
          </Link>

          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            ← Live Scanner
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-12 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Institutional Deal-Flow Access
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5 leading-[1.1]">
          Acquire High-Yield Duplexes <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Before Retail Buyers.
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Zero-day early deal access, direct unredacted wholesaler contacts, and complete audited due diligence packets.
        </p>

        {/* Global Cycle Toggle */}
        <div className="mt-8 inline-flex items-center bg-slate-900/80 border border-slate-800 p-1 rounded-2xl backdrop-blur">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annual <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.5 rounded-full font-bold">Save 15%</span>
          </button>
        </div>
      </section>

      {/* Large 3-Column Plan Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* TIER 1: FREE */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Explorer</div>
              <h3 className="text-2xl font-black text-white mb-2">Free</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-8">For casual market browsing and basic research.</p>

              <div className="mb-8">
                <div className="text-5xl font-black text-white tracking-tight">$0</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Free forever</div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>Public deal feed (<strong>48h delay</strong>)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>Standard Cap Rate &amp; Rent estimates</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>5 default market searches</span>
                </div>
                <div className="flex items-start gap-3 text-slate-500">
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Seller phone &amp; desk locked</span>
                </div>
                <div className="flex items-start gap-3 text-slate-500">
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>No PDF audit packs</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="mt-10 w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-center font-bold text-xs py-3.5 rounded-xl border border-slate-700/50 transition-all block"
            >
              Continue Free
            </Link>
          </div>

          {/* TIER 2: STARTER ($29/mo) */}
          <div 
            onClick={() => setSelectedPlan('starter')}
            className={`bg-slate-900/70 border-2 ${selectedPlan === 'starter' ? 'border-cyan-400 shadow-2xl shadow-cyan-500/10' : 'border-slate-800 hover:border-slate-700'} rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm relative cursor-pointer transition-all`}
          >
            <div className="absolute -top-3 right-8 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Starter Choice
            </div>

            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Individual Investor
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Starter Pro</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-8">Speed advantage with unlocked seller numbers.</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-white tracking-tight">$29</span>
                  <span className="text-xs font-semibold text-slate-400">/ month</span>
                </div>
                <div className="text-xs text-cyan-400/90 mt-1 font-medium">Billed monthly • Cancel anytime</div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800/80 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Zero-Day Priority :</strong> See deals 48h before the public</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Direct Seller Desk :</strong> Phone numbers &amp; assignment contacts</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>10 PDF Due Diligence Packs :</strong> Instant exports/mo</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Full Airbnb Yield Matrix :</strong> Nightly STR revenue comps</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Email Deal Alerts :</strong> Instant custom criteria drops</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`mt-10 w-full font-bold text-xs py-3.5 rounded-xl transition-all ${
                selectedPlan === 'starter'
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {selectedPlan === 'starter' ? 'Selected: Starter ($29/mo)' : 'Select Starter'}
            </button>
          </div>

          {/* TIER 3: VIP PRO ($49/mo OR $499/yr) - BIG NUMBERS */}
          <div 
            onClick={() => setSelectedPlan('vip')}
            className={`bg-gradient-to-b from-slate-900 via-slate-900 to-[#0A121E] border-2 ${selectedPlan === 'vip' ? 'border-emerald-400 shadow-2xl shadow-emerald-500/20' : 'border-emerald-500/40 hover:border-emerald-400/80'} rounded-3xl p-8 flex flex-col justify-between relative cursor-pointer transition-all scale-[1.02]`}
          >
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-emerald-400 to-teal-300 text-black text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
              Most Popular • VIP Club
            </div>

            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Complete Power Tier
              </div>
              <h3 className="text-2xl font-black text-white mb-2">VIP Pro Elite</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-8">Unlimited deal flow &amp; priority instant email drop alerts.</p>

              {/* HUGE NUMBERS DISPLAY */}
              <div className="mb-8 bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tight font-mono">
                    {billingCycle === 'annual' ? '$499' : '$49'}
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    {billingCycle === 'annual' ? '/ year' : '/ month'}
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  {billingCycle === 'annual' ? '⚡ Billed annually (Save $89/year)' : '⚡ Instant access • Cancel anytime'}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800/80 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Everything in Starter Plan</strong> included</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Unlimited Due Diligence PDF Packs :</strong> Full inspection &amp; rent rolls</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Priority VIP Deal Drops :</strong> Instant alert for Cap Rate &gt; 12%</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>3 Free County Scans / Month :</strong> ($15 monthly value)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Verified Rent Rolls &amp; Lease Audits :</strong> Full tenant schedules</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`mt-10 w-full font-extrabold text-xs py-3.5 rounded-xl transition-all ${
                selectedPlan === 'vip'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:opacity-95 text-black shadow-xl shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {selectedPlan === 'vip' 
                ? `Selected: VIP Pro (${billingCycle === 'annual' ? '$499/yr' : '$49/mo'})` 
                : 'Select VIP Pro'}
            </button>
          </div>

        </div>
      </section>

      {/* Direct Checkout Terminal Box */}
      <section className="max-w-xl mx-auto px-4 pb-24">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur">
          {subscribed ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Access Initialized</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Check your inbox to finalize your feed preferences.
              </p>
              <Link href="/" className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all">
                Return to Live Feed
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
                  Ready to Activate
                </div>
                <h3 className="text-2xl font-black text-white">
                  {selectedPlan === 'starter' 
                    ? 'Starter Plan ($29/mo)' 
                    : (billingCycle === 'annual' ? 'VIP Pro Annual ($499/year)' : 'VIP Pro Monthly ($49/month)')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Enter your email to connect with Stripe.</p>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your investor email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:opacity-95 text-black font-black text-xs sm:text-sm py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {submitting ? 'Connecting to Stripe...' : 'Proceed to Checkout →'}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                <span>✓ 30-Day Guarantee</span>
                <span>•</span>
                <span>✓ 1-Click Cancel</span>
                <span>•</span>
                <span>✓ Instant Delivery</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#04060A] text-slate-500 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p>© {new Date().getFullYear()} MultiDealProp. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 max-w-lg mx-auto">
            MultiDealProp is an underwriting &amp; discovery software engine. Real estate investments involve risk.
          </p>
        </div>
      </footer>

    </div>
  );
}
