'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, CheckCircle2, Upload, DollarSign, MapPin, Phone, Mail, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SubmitDealPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    state: 'OH',
    units: 2,
    price: '',
    arv: '',
    monthly_rent: '',
    rehab: '',
    image_url: '',
    wholesaler_name: '',
    wholesaler_phone: '',
    wholesaler_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const price = Number(formData.price) || 0;
      const units = Number(formData.units) || 2;
      const rent = Number(formData.monthly_rent) || 0;
      const arv = Number(formData.arv) || Math.round(price * 1.3);

      const dealId = 'deal_' + Math.random().toString(36).substring(2, 9);
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}`;

      const { error } = await supabase.from('deals').insert([
        {
          id: dealId,
          listing_id: dealId,
          title: formData.title || `${units}-Unit Multi-Family Plex`,
          location: `${formData.city}, ${formData.state}`,
          address: fullAddress,
          formatted_address: fullAddress,
          property_type: units >= 5 ? 'Apartment' : 'Multi-Family',
          units: units,
          price: price,
          arv: arv,
          monthly_rent: rent,
          other_income: units * 35,
          vacancy_rate: 5,
          taxes: Math.round(price * 0.018),
          insurance: Math.round(price * 0.009),
          management_rate: 8,
          maintenance_rate: 5,
          capex_rate: 5,
          water_sewer: units * 60 * 12,
          image_url: formData.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          wholesaler_name: formData.wholesaler_name,
          wholesaler_phone: formData.wholesaler_phone,
          wholesaler_email: formData.wholesaler_email,
          created_at: new Date().toISOString(),
        }
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting deal. Check Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 font-sans antialiased p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to MultiDealProp
        </Link>

        {submitted ? (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-black text-white">Deal Published Successfully!</h2>
            <p className="text-slate-400 text-sm">
              Your property has been listed with pre-calculated financial metrics (Cap Rate, DSCR). Investors can now contact you directly.
            </p>
            <Link
              href="/"
              className="inline-block bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-emerald-300 transition"
            >
              View on Platform
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                100% Free Listing
              </span>
              <h1 className="text-2xl font-black text-white mt-2">Submit Your Multi-Family Deal</h1>
              <p className="text-slate-400 text-xs mt-1">
                Post your assignment contract or direct listing. We automatically compute institutional financial metrics for cash buyers.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Informations du bien */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" /> Property Overview
              </h3>
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Deal Headline / Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Turnkey Duplex - High Cash Flow"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. 1428 E 120th St"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Cleveland"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Doors / Units</label>
                  <input
                    type="number"
                    name="units"
                    min="2"
                    required
                    value={formData.units}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Asking Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="85000"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    name="monthly_rent"
                    required
                    placeholder="1800"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Est. ARV ($)</label>
                  <input
                    type="number"
                    name="arv"
                    placeholder="130000"
                    value={formData.arv}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Photo URL (Direct Image or Cloud Link)</label>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://images.unsplash.com/... or hosted picture link"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Coordonnées du contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> Dispo Manager / Wholesaler Info
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Your Name / Desk</label>
                  <input
                    type="text"
                    name="wholesaler_name"
                    required
                    placeholder="e.g. John Doe Acquisitions"
                    value={formData.wholesaler_name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="wholesaler_phone"
                    required
                    placeholder="(216) 555-0199"
                    value={formData.wholesaler_phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    name="wholesaler_email"
                    required
                    placeholder="deals@acquisitions.com"
                    value={formData.wholesaler_email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Publishing Deal...' : 'Publish Deal to Investors (Free)'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
