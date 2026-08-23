'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Building2, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Investor Support');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200 font-sans antialiased pb-20">
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <span className="text-xs font-bold text-emerald-400">Desk &amp; Support</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Investor &amp; Wholesaler Support Desk</h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-8">
          Submit off-market multi-family contracts or contact our operations team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
              <Mail className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-slate-400 uppercase">Support Email</div>
              <div className="text-xs font-mono text-white mt-1">support@multidealprop.com</div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
              <Building2 className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold text-slate-400 uppercase">Deal Ingestion</div>
              <div className="text-xs text-slate-300 mt-1">
                Direct assignment contract intake for verified off-market residential &amp; multi-family properties.
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-emerald-400 font-bold text-lg">Inquiry Received</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your message has been routed to our operations team. We will respond within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Inquiry Type</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Investor Support">Investor / Account Support</option>
                    <option value="Wholesale Submission">Wholesaler Deal Submission</option>
                    <option value="Billing">Billing &amp; Stripe Inquiries</option>
                    <option value="Legal">Legal &amp; Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Details / Property Information</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your request or property assignment..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
