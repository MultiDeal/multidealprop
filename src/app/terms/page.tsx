'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 font-sans antialiased pb-20">
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <span className="text-xs font-bold text-emerald-400">MultiDealProp Legal</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
          <ShieldAlert className="w-4 h-4" /> Legal Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">Terms of Service & Investment Disclaimer</h1>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Real Estate Investment Disclaimer</h2>
            <p>
              MultiDealProp is an analytical software platform and deal aggregation service. We do not act as licensed real estate brokers, financial advisors, or attorneys. All financial data, including cap rates, gross yields, estimated rents, and pro-forma projections, are provided solely for informational and screening purposes. Past performance is no guarantee of future returns.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Independent Due Diligence</h2>
            <p>
              Investors are strictly required to conduct independent due diligence, title searches, physical inspections, and contractor feasibility reviews prior to executing any purchase or assignment agreement. MultiDealProp assumes no liability for contract disputes, inspection failures, or property performance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Subscription & Billing</h2>
            <p>
              Basic ($29/mo) and VIP Pro ($49/mo) subscriptions are billed on a recurring monthly cycle via Stripe. Members may cancel at any time through their customer portal. Access remains active until the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Wholesaler & Contact Desk</h2>
            <p>
              MultiDealProp does not represent nor warrant the validity of third-party contracts submitted to our assignment desk. Buyers negotiate directly with assignors and sellers.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
