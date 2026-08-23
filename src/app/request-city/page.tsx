'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Compass, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign,
  Info,
  Radar,
  Lock,
  Clock,
  Layers
} from 'lucide-react';

export default function RequestCityPage() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);

  const handleScanCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !state) return;

    setLoading(true);

    try {
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
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased pb-24 selection:bg-emerald-500 selection:text-black">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#06080F]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-black font-mono">
            <DollarSign className="w-3.5 h-3.5" /> $4.99 Priority Ingestion
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3 bg-cyan-950/60 px-3.5 py-1 rounded-full border border-cyan-800/60">
            <Clock className="w-3.5 h-3.5" /> 48-Hour Exclusive Lockout Window
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Unlock &amp; Scan Any US City or County
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Ingest live multi-family inventory for any US market. You receive <span className="text-emerald-400 font-bold">48 hours of exclusive private access</span> to underwritten assets before they are released to the public feed.
          </p>
        </div>

        {scannedResult ? (
          <div className="bg-slate-900/60 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black mb-3">
                <Lock className="w-3.5 h-3.5" /> 48-Hour First-Look Lock Activated
              </div>
              <h2 className="text-2xl font-black text-white">Market Ingested &amp; Secured!</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                <span className="font-bold text-emerald-400">{scannedResult.city}, {scannedResult.state}</span> is now live in your pipeline.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-xs px-6 py-3.5 rounded-xl shadow-xl shadow-emerald-500/20 hover:opacity-95 transition-all"
              >
                🚀 Access {scannedResult.city} Live Inventory Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Form */}
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

                {/* Pricing & 48h Lock Card */}
                <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">48h Exclusive Ingestion Window</div>
                      <div className="text-[10px] text-slate-400">Automated RentCast Comps + First-Look Advantage</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono">$4.99</div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-xs sm:text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? '⚡ Contacting Underwriting API & Ingesting...' : '🚀 Pay $4.99 & Lock Market for 48 Hours'}
                </button>
              </form>

              <div className="border-t border-slate-800/80 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real-Time Algorithmic Pipeline. Instant Zero-Wait Processing.</span>
              </div>
            </div>

            {/* Coverage & Radius Terms */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Scanning Protocol &amp; 48-Hour Lockout Terms</span>
              </div>

              <div className="space-y-3 pt-1 text-[11px]">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">48-Hour Head-Start Advantage:</strong> You hold private first-look priority on this market for 48 hours to contact sellers and underwrite before the inventory becomes visible to all users.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Radar className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Automatic Geographic Radius Expansion:</strong> If a smaller municipality has zero active multi-family listings at the time of query, our algorithm expands the search radius up to <span className="text-emerald-400 font-semibold">15 to 25 miles</span> across the surrounding county corridor to source proximate cash-flow comps.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Continuous Pipeline Monitoring:</strong> Your market remains permanently active on our ingestion crawler to automatically capture upcoming off-market assignments.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
