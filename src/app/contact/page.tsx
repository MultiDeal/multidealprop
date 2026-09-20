'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Lender Network Partnership',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Unable to submit message.'}`);
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Inquiries &amp; Desk Access</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Contact Capital Desk</h1>
          <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
            Direct communications for real estate operators, commercial mortgage brokers, and capital partners.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs">
            <span className="text-slate-400">Direct Email:</span>
            <a href="mailto:support@multidealprop.com" className="text-cyan-400 font-mono hover:underline">
              support@multidealprop.com
            </a>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Message Transmitted</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Thank you. A capital desk coordinator will review your inquiry and reply to <span className="text-white">{formData.email}</span> within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject / Inquiry Type</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Lender Network Partnership">Lender Network Partnership</option>
                    <option value="Broker Deal Submission">Broker Deal Submission</option>
                    <option value="General Support / Inquiries">General Support / Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  placeholder="Describe your inquiry or deal volume..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Send Message \u2192'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
