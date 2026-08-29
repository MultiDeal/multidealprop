'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Si Supabase n'est pas encore configuré dans Vercel, redirection douce vers /deals
      window.location.href = `/deals?email=${encodeURIComponent(email.trim().toLowerCase())}`;
      return;
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/deals`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0d1527] border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Member Access Portal
          </span>
          <h1 className="text-2xl font-black text-white mt-4 mb-2">Sign In to MultiDealProp</h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            Enter the email address tied to your active Stripe membership.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {sent ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
            <span className="text-3xl block mb-2">📩</span>
            <h3 className="text-base font-bold text-emerald-400 mb-1">Magic Link Dispatched!</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              We have sent an instant 1-click access link to <strong className="text-white">{email}</strong>.
            </p>
            <p className="text-[11px] text-slate-400">
              Check your inbox and Spam/Junk folder. Clicking the link will authenticate your session automatically.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@domain.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending Link...' : 'Send Instant Access Link →'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400 mb-2">Don't have an active subscription yet?</p>
          <Link
            href="/vip"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            View Membership Plans & Pricing &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
