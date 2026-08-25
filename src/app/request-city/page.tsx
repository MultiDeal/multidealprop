'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RequestCityPage() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const successCity = searchParams.get('city') || 'your requested area';
  const successState = searchParams.get('state') || '';

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayAndScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !state) {
      alert('Veuillez spécifier la ville et l’État.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/checkout/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, state, email }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection vers le paiement.');
      }
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-[#0d1527] border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            ✓
          </div>
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            🔒 48-Hour First-Look Lock Activated
          </span>
          <h2 className="text-3xl font-extrabold mb-3">Market Ingested & Secured!</h2>
          <p className="text-slate-300 mb-8">
            <strong className="text-emerald-400 capitalize">{successCity} {successState}</strong> is now live in your pipeline.
          </p>
          <a
            href="/"
            className="inline-block w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-90 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition"
          >
            🚀 Access {successCity} Live Inventory Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center mb-8">
        <span className="inline-block bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          ⏱ 48-HOUR EXCLUSIVE LOCKOUT WINDOW
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Unlock & Scan Any US City or County
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Ingest live multi-family inventory for any US market. You receive <span className="text-emerald-400 font-semibold">48 hours of exclusive private access</span> before deals are published.
        </p>
      </div>

      <div className="max-w-md w-full bg-[#0d1527] border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handlePayAndScan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target City</label>
            <input
              type="text"
              required
              placeholder="e.g. Cleveland"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">State</label>
            <input
              type="text"
              required
              placeholder="e.g. OH"
              maxLength={2}
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email for Delivery</label>
            <input
              type="email"
              placeholder="investor@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {loading ? 'Connecting to Stripe...' : 'Pay $4.99 & Scan Target Area'}
          </button>
        </form>
      </div>
    </div>
  );
}
