'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass, Zap, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function RequestCityPage() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);

  const handleScanCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !state) return;

    setLoading(true);

    try {
      // 1. Déclenchement de la requête automatisée RentCast / Supabase
      const res = await fetch('/api/scanner/fetch-city', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, state })
      });

      const data = await res.json();

      if (res.ok) {
        setScannedResult(data);
      } else {
        alert(data.error || 'Unable to scan target city. Please check parameters.');
      }
    } catch (err: any) {
      alert('Error triggering scanner: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased pb-20 selection:bg-emerald-500 selection:text-black">
      
      <header className="border-b border-slate-800 bg-[#06080F]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-black font-mono">
            <DollarSign className="w-3.5 h-3.5" /> $4.99 On-Demand Ingestion
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3 bg-cyan-950/60 px-3.5 py-1 rounded-full border border-cyan-800/60">
            <Compass className="w-3.5 h-3.5" /> On-Demand Market Ingestion
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Unlock &amp; Scan Any US City or County
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Specify any US municipality or county. Our automated RentCast underwriting engine will query active off-market multi-family listings, calculate real Cap Rates, and publish them to your dashboard.
          </p>
        </div>

        {scannedResult ? (
          <div className="bg-slate-900/60 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Market Successfully Ingested!</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                <span className="font-bold text-emerald-400">{scannedResult.city}, {scannedResult.state}</span> is now active with live underwritten properties.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all"
              >
                🚀 View {scannedResult.city} on Live Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 backdrop-blur">
            <form onSubmit={handleScanCity} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target City or County Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Akron, Cincinnati, Wayne County..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    State (2 Letters) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="OH"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Price & Guarantee box */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Instant API Ingestion Fee</div>
                    <div className="text-[10px] text-slate-400">Automated RentComps + Multi-Family Query</div>
                  </div>
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono">$4.99</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-xs sm:text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? '⚡ Contacting Underwriting API & Ingesting...' : '🚀 Pay $4.99 & Scan Live Deals Now'}
              </button>
            </form>

            <div className="border-t border-slate-800/80 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time RentCast Algorithmic Data Feed. Zero Manual Wait Time.</span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
