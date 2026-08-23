'use client';

import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 font-sans antialiased pb-20">
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <span className="text-xs font-bold text-emerald-400">Data Security</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Lock className="w-4 h-4" /> Compliance & Privacy
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">Privacy Policy</h1>

        <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Data Collection</h2>
            <p>
              We collect user-provided contact information (email address, investor preferences) to deliver deal alerts, pro-forma reports, and account administration. Payment information is processed directly by Stripe and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Usage of Information</h2>
            <p>
              Your email is used exclusively to send deal alerts, audit packs, and subscription notices. We do not sell, rent, or distribute personal data to third-party marketing brokers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Cookies and Analytics</h2>
            <p>
              We use standard session cookies to maintain authentication states and improve real estate scanner responsiveness.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Inquiries & Contact</h2>
            <p>
              For data access requests or privacy-related questions, contact our compliance desk at <span className="text-emerald-400 font-mono">support@multidealprop.com</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
