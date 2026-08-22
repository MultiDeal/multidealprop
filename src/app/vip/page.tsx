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
  Clock, 
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      // 1. Enregistrement du lead abonné dans Supabase / API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          interested_in: `VIP Pro Subscription (${billingCycle === 'annual' ? '$499/year' : '$49/month'})`
        })
      });

      // 2. Appel de la session Stripe Checkout
      const res = await fetch('/api/checkout/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: billingCycle })
      });

      const data = await res.json();
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        setSubscribed(true);
      }
    } catch (err) {
      console.error('Error starting VIP checkout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

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
            ← Back to Deal Scanner
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6 backdrop-blur shadow-inner">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          MultiDealProp VIP Pro Institutional Network
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">12%+ Cap Rate</span> Deal Again.
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The best off-market duplexes and under-priced plexes sell in under 48 hours. Get private 0-day early access, complete audited rent rolls, and direct wholesaler contacts before retail investors.
        </p>

        {/* Pricing Cycle Switcher */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl inline-flex items-center gap-1 shadow-xl backdrop-blur">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Billing <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Save 15%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Pricing Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* FREE PLAN */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between backdrop-blur">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public Feed</div>
              <h3 className="text-2xl font-black text-white mb-2">Free Explorer</h3>
              <p className="text-xs text-slate-400 mb-6">For casual real estate onlookers and market researchers.</p>

              <div className="text-4xl font-black text-white mb-6">
                $0 <span className="text-xs text-slate-500 font-normal">/ forever</span>
              </div>

              <div className="space-y-3.5 pt-6 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Public feed with <strong>48-hour delay</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Basic Cap Rate and estimated price values</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>Limited search queries across 5 default metros</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>No instant SMS / WhatsApp Deal Drops</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>Seller contact &amp; rent rolls blurred</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white text-center font-bold text-xs py-3.5 rounded-xl transition-all block"
            >
              Continue Free
            </Link>
          </div>

          {/* VIP PRO PLAN (HIGH CONVERSION) */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] border-2 border-emerald-500/80 rounded-3xl p-8 relative shadow-2xl shadow-emerald-500/10 flex flex-col justify-between">
            
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-emerald-400 to-teal-400 text-black text-[10px] uppercase tracking-widest font-black px-3.5 py-1 rounded-full shadow-md">
              Most Popular • High ROI
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> Professional Investor Tier
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">VIP Pro Deal Club</h3>
              <p className="text-xs text-slate-300 mb-6">Direct access to institutional multi-family deal flow.</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-white">
                  {billingCycle === 'annual' ? '$499' : '$49'}
                </span>
                <span className="text-xs text-slate-400">
                  {billingCycle === 'annual' ? '/ year (Save $89)' : '/ month (Cancel anytime)'}
                </span>
              </div>

              <div className="space-y-3.5 pt-6 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Zero-Day Priority Access :</strong> See new listings 48 hours before the public</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Unlocked Wholesaler &amp; Seller Desk :</strong> Direct phone &amp; assignment contracts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Real-Time Deal Drops :</strong> SMS / Email alerts for Cap Rates &gt; 12%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Full Rent Rolls &amp; Inspection Audit :</strong> One-click PDF due diligence pack</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Short-Term Rental Matrix :</strong> Complete Airbnb nightly yield projections</span>
                </div>
              </div>
            </div>

            {/* Subscribe Form / Stripe Button */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              {subscribed ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-white">Welcome to the VIP Club!</div>
                  <p className="text-[11px] text-slate-300 mt-1">Check your inbox to finalize your priority feed setup.</p>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your investor email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    {submitting ? 'Connecting to Stripe...' : `Unlock VIP Pro Access (${billingCycle === 'annual' ? '$499/year' : '$49/month'})`}
                  </button>
                </form>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                <span>✓ 30-Day Money-Back</span>
                <span>•</span>
                <span>✓ Cancel in 1-Click</span>
                <span>•</span>
                <span>✓ Instant Delivery</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Unlocked Deal Preview Demonstration */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Live Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2">
            What Unlocking a Deal Looks Like
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8">
            Free users see blurred placeholders. VIP Pro members receive full verified seller contacts and unredacted leases.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Public View (Free)</div>
                <div className="text-xs text-slate-400 filter blur-sm select-none">
                  Wholesaler Contact: John Doe Deals LLC<br />
                  Direct Phone: +1 (216) 555-0198<br />
                  Rent Roll: Unit A ($950), Unit B ($975)<br />
                  Title Search: Clean Warranty Deed
                </div>
                <div className="mt-3 text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" /> Locked for 48h
                </div>
              </div>

              <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> VIP Pro Member View
                </div>
                <div className="text-xs text-slate-200">
                  <strong>Acquisitions Desk :</strong> Midwest Capital Group<br />
                  <strong>Direct Line :</strong> +1 (313) 482-9901<br />
                  <strong>HUD Leases :</strong> 2x $1,025/mo Section 8 Approved<br />
                  <strong>Assignment Fee :</strong> Flat $3,500 Included
                </div>
                <div className="mt-3 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Ready to Purchase
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070A10] text-slate-500 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p>© {new Date().getFullYear()} MultiDealProp VIP Network. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 max-w-xl mx-auto">
            MultiDealProp is an analytics software. We do not act as mortgage brokers or registered securities representatives.
          </p>
        </div>
      </footer>

    </div>
  );
}
