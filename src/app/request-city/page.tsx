'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RequestCityPage() {
  const [userTier, setUserTier] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);

  const [city, setCity] = useState('');
  const [state, setState] = useState('OH');
  const [propertyType, setPropertyType] = useState('duplex_triplex');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isVip = localStorage.getItem('multideal_vip') === 'true';
      const tier = localStorage.getItem('multideal_tier') || (isVip ? 'starter' : null);
      setUserTier(tier);

      // Load credits
      const storedCredits = localStorage.getItem('multideal_scan_credits');
      if (storedCredits !== null) {
        setCredits(parseInt(storedCredits, 10));
      } else if (tier === 'vip') {
        setCredits(5);
        localStorage.setItem('multideal_scan_credits', '5');
      } else if (tier === 'starter') {
        setCredits(1);
        localStorage.setItem('multideal_scan_credits', '1');
      } else {
        setCredits(0);
      }
    }
  }, []);

  const isElite = userTier === 'vip';
  const hasCredits = credits > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      alert('Please enter a target city or county name.');
      return;
    }

    setSubmitting(true);

    try {
      if (hasCredits) {
        // Deduct 1 VIP credit (Free of charge)
        const newCredits = credits - 1;
        setCredits(newCredits);
        localStorage.setItem('multideal_scan_credits', newCredits.toString());

        // Simulate backend scan initiation
        await new Promise((resolve) => setTimeout(resolve, 800));

        setSuccessMessage(
          `🎉 Scan initiated successfully for ${city}, ${state}! Your complete underwriting audit pack will be delivered to ${email} within 2 hours. You have ${newCredits} scan credit(s) remaining this month.`
        );
      } else {
        // Redirect to single scan checkout ($4.99 USD)
        const res = await fetch('/api/checkout/city-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city, state, propertyType, email }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || 'Failed to initialize market scan checkout.');
        }
      }
    } catch (err: any) {
      alert('An error occurred: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/deals"
            className="text-slate-400 hover:text-white transition flex items-center gap-2 text-xs font-medium"
          >
            ← Back to Deals Feed
          </Link>

          {isElite ? (
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider py-1.5 px-3.5 rounded-full flex items-center gap-1.5">
              ⚡ {credits}/5 VIP Credits Available
            </span>
          ) : (
            <Link
              href="/vip"
              className="text-amber-400 text-xs font-bold hover:underline flex items-center gap-1"
            >
              Unlock 5 Free Monthly Scans with VIP Elite →
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
            Custom Market Underwriting
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Scan a Target City or County
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Need high-cap Section 8 or multi-family inventory in a specific US zip code? Request an automated 24/7 desk scan.
          </p>
        </div>

        {successMessage ? (
          <div className="bg-[#0d1527] border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-black text-white">Market Scan Scheduled!</h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {successMessage}
            </p>
            <div className="pt-4">
              <Link
                href="/deals"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-extrabold py-3 px-6 rounded-xl transition text-xs uppercase tracking-wider shadow-lg inline-block"
              >
                Back to Deals Feed
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            {hasCredits ? (
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <span>💎</span>
                  <span><strong>VIP Member Perk:</strong> This scan will use 1 monthly credit ($0.00 charged).</span>
                </div>
                <span className="font-mono font-black text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  {credits} Remaining
                </span>
              </div>
            ) : (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs">
                <span className="text-slate-300">Single Scan Price: <strong className="text-white">$4.99 USD</strong></span>
                <Link href="/vip" className="text-amber-400 hover:underline font-bold">
                  Or get 5 scans/mo included with VIP Elite ($49)
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Target City or County Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cleveland, Wayne County, Dayton..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  US State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="OH">Ohio (OH)</option>
                  <option value="MI">Michigan (MI)</option>
                  <option value="TN">Tennessee (TN)</option>
                  <option value="IN">Indiana (IN)</option>
                  <option value="PA">Pennsylvania (PA)</option>
                  <option value="MD">Maryland (MD)</option>
                  <option value="MO">Missouri (MO)</option>
                  <option value="FL">Florida (FL)</option>
                  <option value="TX">Texas (TX)</option>
                  <option value="NC">North Carolina (NC)</option>
                  <option value="GA">Georgia (GA)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Target Asset Focus
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="duplex_triplex">Duplex & Triplex (High Cashflow)</option>
                  <option value="fourplex">Fourplex (Maximum Leverage)</option>
                  <option value="section8_sfr">Single Family Section 8 Ready</option>
                  <option value="commercial_5plus">Commercial 5+ Units (VIP Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Notification Email for Audit Pack *
                </label>
                <input
                  type="email"
                  required
                  placeholder="investor@capitalfirm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black py-4 px-6 rounded-xl transition shadow-xl text-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {submitting
                ? 'Processing...'
                : hasCredits
                ? '⚡ Launch Market Scan (1 VIP Credit)'
                : '🚀 Order City Scan ($4.99 USD)'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
