'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 font-sans antialiased pb-20">
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <span className="text-xs font-bold text-emerald-400">Data Protection</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Lock className="w-4 h-4" /> Privacy &amp; Security Compliance
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mb-8">Effective Date: August 2026</p>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl">
          
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Information We Collect</h2>
            <p>We collect only the necessary information to provide deal intelligence and deliver services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Contact Information:</strong> Email address provided during account registration, deal alert signups, or contact submissions.</li>
              <li><strong>Technical &amp; Usage Data:</strong> IP address, browser type, device information, and interactions with deal pages.</li>
              <li><strong>Payment Data:</strong> Handled entirely by Stripe via secure tokens. We never store credit card or bank account credentials on our infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. How We Use Your Information</h2>
            <p>Your data is processed strictly for the following operational needs:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Delivering off-market multi-family email notifications and pro-forma packs.</li>
              <li>Managing your Basic or VIP Pro subscription status.</li>
              <li>Preventing unauthorized API scraping, security breaches, and fraudulent abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Zero Third-Party Sale Guarantee</h2>
            <p>
              We do not sell, rent, lease, or monetize your personal information to third-party marketing brokers or advertising networks.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Third-Party Infrastructure Providers</h2>
            <p>We work with enterprise providers committed to strict data security standards:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Stripe:</strong> PCI-DSS Level 1 certified payment processing.</li>
              <li><strong>Resend / ImprovMX:</strong> Encrypted transactional email delivery.</li>
              <li><strong>Supabase:</strong> Encrypted PostgreSQL database storage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">5. Data Subject Rights &amp; Deletion Requests</h2>
            <p>
              You have the right to request access to, correction of, or permanent deletion of your personal data at any time. To exercise these rights, email our compliance team at <span className="text-emerald-400 font-mono">support@multidealprop.com</span>.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
