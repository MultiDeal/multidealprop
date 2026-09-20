import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | MultiDealProp',
  description: 'Privacy Policy and TCPA data handling practices for multidealprop.com.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-white/5 px-6 lg:px-12 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black text-sm">M</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">multidealprop<span className="text-cyan-500">.</span></span>
        </Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          &larr; Back to Platform
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Legal Compliance</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-2">Last Updated: September 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-slate-400 border-t border-white/5 pt-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Information We Collect</h2>
          <p>
            When you request loan pre-qualification terms through multidealprop.com, we collect transaction-related details, including property type, estimated valuation, requested loan amounts, Net Operating Income (NOI), estimated credit score tiers, and contact information (full legal name, corporate or personal email address, and direct phone number).
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">2. Purpose &amp; Data Transmission</h2>
          <p>
            MultiDealProp operates as an introductory underwriting technology portal. We use collected parameters to evaluate eligibility and route deal inquiries to our participating network of accredited commercial mortgage brokers, Non-QM originators, and private balance-sheet lenders.
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">3. TCPA &amp; Communications Consent</h2>
          <p>
            By submitting an inquiry via our platform and checking the TCPA consent box, you provide express written authorization for multidealprop.com and its affiliated lending partners to contact you via telephone calls, automated text messages (SMS), and emails regarding your financing request at the contact number and address provided. You may opt out of communications at any time by replying STOP to any SMS or contacting support.
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">4. Data Security</h2>
          <p>
            We implement administrative and technical safeguards to protect borrower information against unauthorized access, loss, or alteration. All form submissions are transmitted via encrypted protocols (HTTPS/SSL).
          </p>

          <h2 className="text-base font-bold text-white uppercase tracking-wider pt-4">5. Contact Information</h2>
          <p>
            For inquiries regarding personal data deletion or privacy practices, please contact us at <span className="text-cyan-400">privacy@multidealprop.com</span>.
          </p>
        </section>
      </main>
    </div>
  );
}
