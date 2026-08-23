'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldAlert, AlertTriangle } from 'lucide-react';

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
          <ShieldAlert className="w-4 h-4" /> Legal Framework &amp; Disclaimers
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Terms of Service &amp; Legal Disclaimers</h1>
        <p className="text-xs text-slate-400 mb-8">Effective Date: August 2026</p>

        {/* Highlighted Warning Box */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl mb-8 flex gap-3 text-amber-300 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>CRITICAL LEGAL NOTICE:</strong> MultiDealProp is a commercial data aggregation and software technology platform. We are NOT licensed real estate brokers, agents, mortgage lenders, attorneys, or certified financial planners. All users acknowledge that real estate investing involves substantial financial risk.
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl">
          
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. No Brokerage &amp; No Fiduciary Relationship</h2>
            <p>
              MultiDealProp (the "Company", "we", "us") does not represent buyers, sellers, assignors, or assignees in any transaction. We do not negotiate purchase agreements, hold escrow funds, draft binding closing contracts, or provide legal representation. No agency, partnership, joint venture, employee-employer, or fiduciary relationship is created by accessing this platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Accuracy of Data &amp; Financial Projections ("As-Is")</h2>
            <p>
              All property metrics, financial valuations, capitalization rates (Cap Rates), gross yields, estimated market rents, tax records, and pro-forma projections displayed on this platform are estimates compiled from public records, third-party wholesalers, and mathematical models. They are provided strictly for initial screening and educational purposes. We make no express or implied warranties regarding accuracy, rent roll validity, property condition, title status, environmental liabilities, or financial profitability.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Mandatory Independent Due Diligence</h2>
            <p>
              Users and prospective buyers agree to conduct full independent due diligence prior to executing any purchase contract, assignment agreement, or earnest money deposit. This includes, without limitation:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Ordering physical municipal and building inspections by licensed general contractors.</li>
              <li>Performing certified title and lien searches through licensed title companies or closing attorneys.</li>
              <li>Auditing actual leases, bank statements, tenant ledgers, and property management accounts.</li>
              <li>Consulting qualified CPA, tax, and legal counsel within the relevant municipal jurisdiction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Wholesaler Submissions &amp; Assignment Contracts</h2>
            <p>
              Third-party wholesalers and assignors who submit properties to our desk warrant that they hold valid, equitable interest via an executed purchase agreement granting assignment rights. MultiDealProp assumes no liability for failed contract assignments, seller cancellations, earnest money disputes, or wholesaler misrepresentations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">5. Subscriptions, Payments &amp; Refund Policy</h2>
            <p>
              Access to Basic ($29/month) and VIP Pro ($49/month) tiers is billed on a recurring basis via Stripe. You may cancel your subscription at any time via your billing dashboard. Cancellations take effect at the conclusion of the active billing cycle. Due to the immediate delivery of proprietary deal data, addresses, and contacts, all subscription payments are non-refundable except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">6. Limitation of Liability &amp; Indemnification</h2>
            <p>
              To the fullest extent permitted by applicable law, MultiDealProp, its officers, operators, and affiliates shall not be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including loss of profits, investment capital, or goodwill. You agree to defend, indemnify, and hold harmless MultiDealProp against any claims, losses, liabilities, or legal expenses arising from your reliance on data provided on this platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">7. Governing Law &amp; Arbitration</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws without regard to conflict of law principles. Any dispute arising under these Terms shall be resolved exclusively through binding individual arbitration.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
