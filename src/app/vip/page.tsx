'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VipContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('starter');

  useEffect(() => {
    if (isSuccess && typeof window !== 'undefined') {
      const selectedPlan = localStorage.getItem('pending_tier') || 'starter';
      localStorage.setItem('multideal_tier', selectedPlan);
      localStorage.setItem('multideal_vip', 'true');
      
      // If VIP Elite, initialize 5 free monthly scan credits
      if (selectedPlan === 'vip') {
        localStorage.setItem('multideal_scan_credits', '5');
      } else {
        localStorage.setItem('multideal_scan_credits', '1');
      }
      
      setCurrentTier(selectedPlan);
    }
  }, [isSuccess]);

  const handleCheckout = async (planKey: 'starter_29' | 'vip_49') => {
    try {
      setLoadingPlan(planKey);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_tier', planKey === 'starter_29' ? 'starter' : 'vip');
      }

      const res = await fetch('/api/checkout/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout initialization failed. Please try again.');
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (isSuccess) {
    const isElite = currentTier === 'vip';
    return (
      <div className="max-w-xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
          {isElite ? '🎉 VIP Elite Plan ($49/mo) Active' : '🎉 Pro Starter Plan ($29/mo) Active'}
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-3">Welcome Aboard!</h2>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Your <strong>{isElite ? 'VIP Elite' : 'Pro Starter'}</strong> membership is active. All institutional underwriting dossiers, exact street addresses, and direct wholesaler contacts are unlocked.
          {isElite && ' You also have 5 complimentary custom market scans available each month!'}
        </p>
        <div className="space-y-3">
          <Link
            href="/deals"
            className="inline-block w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg text-sm"
          >
            🚀 View Unlocked Live Deals Feed
          </Link>
          {isElite && (
            <Link
              href="/request-city"
              className="inline-block w-full bg-[#131d36] hover:bg-[#1a2747] text-sky-400 border border-slate-700 font-bold py-3 px-6 rounded-xl transition text-xs"
            >
              📍 Launch a Target Market Scan (5 Credits Available)
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      {isCanceled && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-sm">
          Payment process was canceled. You can select your plan below.
        </div>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
        Choose Your MultiDealProp Plan
      </h1>
      <p className="text-base sm:text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
        Gain instant access to direct off-market wholesaler contacts, institutional pro-forma cashflow models, and downloadable Due Diligence audit packs.
      </p>

      <div className="grid md:grid-cols-2 gap-8 text-left">
        {/* Pro Starter - $29 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Starter</h3>
            <p className="text-slate-400 text-sm mb-6">Essential toolset for residential multi-family cashflow investors.</p>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold">$29</span>
              <span className="text-slate-400 ml-2">/ month</span>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm mb-8">
              <li className="flex items-center">✓ Full Pipeline Access (1-4 Unit Residential Properties)</li>
              <li className="flex items-center">✓ 12-Month Pro-Forma P&L & True Cap Rates</li>
              <li className="flex items-center">✓ Direct Wholesaler Phone & Email Contacts</li>
              <li className="flex items-center">✓ Downloadable Institutional Due Diligence PDF Packs</li>
              <li className="flex items-center text-slate-400">✓ 1 On-Demand City Scan Included per Month</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout('starter_29')}
            disabled={loadingPlan !== null}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition cursor-pointer"
          >
            {loadingPlan === 'starter_29' ? 'Redirecting to Checkout...' : 'Select Pro Starter ($29/mo)'}
          </button>
        </div>

        {/* VIP Elite - $49 */}
        <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
          <span className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Most Popular
          </span>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">VIP Elite</h3>
            <p className="text-slate-400 text-sm mb-6">Built for active acquisitions looking for the highest spreads and first access.</p>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold">$49</span>
              <span className="text-slate-400 ml-2">/ month</span>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm mb-8">
              <li className="flex items-center">✓ <strong>Everything included in Pro Starter</strong></li>
              <li className="flex items-center text-amber-400 font-bold">
                ✓ 5 Free On-Demand City/County Scans / Month ($25 Value)
              </li>
              <li className="flex items-center">✓ 48-Hour Priority Early Access Window</li>
              <li className="flex items-center">✓ Commercial Multi-Family Portfolios (5+ Units)</li>
              <li className="flex items-center">✓ Instant SMS / Webhook Deal Drop Notifications</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout('vip_49')}
            disabled={loadingPlan !== null}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition shadow-lg cursor-pointer"
          >
            {loadingPlan === 'vip_49' ? 'Redirecting to Checkout...' : 'Join VIP Elite ($49/mo)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VipPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400">Loading plans...</div>}>
        <VipContent />
      </Suspense>
    </div>
  );
}
