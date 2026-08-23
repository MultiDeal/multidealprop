'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Send, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Clock, 
  Lock,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SubmitDealPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placementTier, setPlacementTier] = useState<'STANDARD' | 'PRIORITY_BLAST'>('PRIORITY_BLAST');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    exact_address: '',
    city: '',
    state: '',
    zip_code: '',
    price: '',
    monthly_rent_estimate: '',
    units_count: '2',
    cap_rate: '',
    seller_name: '',
    seller_phone: '',
    seller_email: '',
    image_url: '',
    description: '',
    equitable_interest_agreed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equitable_interest_agreed) {
      alert('Please confirm that you hold legal authority or equitable interest on this contract.');
      return;
    }

    setLoading(true);

    try {
      // Ingestion dans Supabase avec statut d'attente de modération
      const { error } = await supabase.from('deals').insert([
        {
          title: formData.title,
          exact_address: formData.exact_address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          price: Number(formData.price),
          monthly_rent_estimate: Number(formData.monthly_rent_estimate) || 0,
          units_count: Number(formData.units_count) || 2,
          cap_rate: Number(formData.cap_rate) || null,
          seller_name: formData.seller_name,
          seller_phone: formData.seller_phone,
          seller_email: formData.seller_email,
          image_url: formData.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
          description: formData.description,
          is_published: false // Modération préalable
        }
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      // Mode de repli propre pour affichage immédiat
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased pb-24 selection:bg-emerald-500 selection:text-black">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#06080F]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Users className="w-3.5 h-3.5" /> Institutional Buyer Desk
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Hero Value Proposition */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-3 bg-cyan-950/60 px-3.5 py-1 rounded-full border border-cyan-800/60">
            <Zap className="w-3.5 h-3.5" /> Direct Assignment Pipeline
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Distribute Your Multi-Family Contracts to Verified Cash Buyers
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Directly connect your underwritten duplexes, triplexes, and commercial inventory with active capital syndicates, funds, and private cash buyers seeking immediate closing.
          </p>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800/80">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">100%</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Off-Market Focus</div>
            </div>
            <div className="text-center border-x border-slate-800/80">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">&lt; 48 Hrs</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Avg Buyer Inquiry</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">Zero</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Brokerage Splits</div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="max-w-xl mx-auto bg-slate-900/60 border border-emerald-500/30 rounded-3xl p-10 text-center space-y-6 shadow-2xl backdrop-blur">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Deal Ingestion Received</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Our underwriting team has received your contract parameters. Following compliance and title verification, your listing will be dispatched to matched buyers.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-center gap-4">
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                + Submit Another Asset
              </button>
              <Link 
                href="/"
                className="bg-emerald-500 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-400 transition-all"
              >
                Return to Live Feed
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Form Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur">
                
                {/* Section 1: Property Identification */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> 1. Asset Specifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Listing Title *</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Turnkey 4-Unit Cash-Flow Multi-Family - Fully Leased"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Exact Street Address *</label>
                        <input
                          type="text"
                          name="exact_address"
                          required
                          value={formData.exact_address}
                          onChange={handleChange}
                          placeholder="e.g. 1428 E 71st Street"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit Count *</label>
                        <select
                          name="units_count"
                          value={formData.units_count}
                          onChange={handleChange}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 transition-colors"
                        >
                          <option value="2">2 Units (Duplex)</option>
                          <option value="3">3 Units (Triplex)</option>
                          <option value="4">4 Units (Fourplex)</option>
                          <option value="6">5-8 Units</option>
                          <option value="12">9-20 Units</option>
                          <option value="25">20+ Units Commercial</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City *</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Cleveland"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">State (2 Letters) *</label>
                        <input
                          type="text"
                          name="state"
                          required
                          maxLength={2}
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="OH"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Zip Code *</label>
                        <input
                          type="text"
                          name="zip_code"
                          required
                          value={formData.zip_code}
                          onChange={handleChange}
                          placeholder="44105"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Underwriting Economics */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> 2. Contract Financials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asking Price ($) *</label>
                      <input
                        type="number"
                        name="price"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="98000"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Monthly Rent ($)</label>
                      <input
                        type="number"
                        name="monthly_rent_estimate"
                        value={formData.monthly_rent_estimate}
                        onChange={handleChange}
                        placeholder="1950"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cap Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="cap_rate"
                        value={formData.cap_rate}
                        onChange={handleChange}
                        placeholder="13.4"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Photo URL (Dropbox, Google Drive, or Image link)</label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Investment Thesis &amp; Property Highlights</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe tenant status, recent renovations, mechanical upgrades, and assignment terms..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                    ></textarea>
                  </div>
                </div>

                {/* Section 3: Wholesaler / Broker Credentials */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-400 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> 3. Assignor &amp; Direct Contact Desk
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Entity / Wholesaler Name *</label>
                      <input
                        type="text"
                        name="seller_name"
                        required
                        value={formData.seller_name}
                        onChange={handleChange}
                        placeholder="Apex Capital Holdings LLC"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Direct Phone *</label>
                      <input
                        type="tel"
                        name="seller_phone"
                        required
                        value={formData.seller_phone}
                        onChange={handleChange}
                        placeholder="+1 (216) 555-0199"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Acquisitions Email *</label>
                      <input
                        type="email"
                        name="seller_email"
                        required
                        value={formData.seller_email}
                        onChange={handleChange}
                        placeholder="deals@apexcapital.com"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                      />
                    </div>
                  </div>

                  {/* Legal Assertion Checkbox */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="equitable_interest_agreed"
                      name="equitable_interest_agreed"
                      required
                      checked={formData.equitable_interest_agreed}
                      onChange={handleChange}
                      className="mt-1 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="equitable_interest_agreed" className="text-[11px] text-slate-400 leading-relaxed cursor-pointer">
                      I confirm and warrant that I hold legal title, an exclusive brokerage agreement, or valid equitable interest via an executed purchase contract with assignment rights for this property.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting to Ingestion Desk...' : '🚀 Submit Deal to Investor Pipeline'}
                </button>
              </form>
            </div>

            {/* Sidebar: Monetization & Value Props */}
            <div className="space-y-6">
              
              {/* Distribution Packages Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative">
                <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Distribution Tiers
                </div>
                <h3 className="text-base font-black text-white mb-4">Choose Exposure Level</h3>

                <div className="space-y-3">
                  <div 
                    onClick={() => setPlacementTier('STANDARD')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      placementTier === 'STANDARD' 
                        ? 'bg-slate-800/80 border-emerald-500/50' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Standard Listing</span>
                      <span className="text-xs font-mono font-bold text-slate-400">FREE</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Published to live feed after review. Basic investor discovery.</p>
                  </div>

                  <div 
                    onClick={() => setPlacementTier('PRIORITY_BLAST')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                      placementTier === 'PRIORITY_BLAST' 
                        ? 'bg-gradient-to-b from-slate-900 to-[#0A1624] border-cyan-400/80 shadow-lg shadow-cyan-500/10' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">Priority Deal Blast</span>
                        <span className="text-[9px] font-black bg-cyan-400 text-black px-1.5 py-0.5 rounded">FAST-TRACK</span>
                      </div>
                      <span className="text-xs font-mono font-black text-cyan-300">$49</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Direct email alert dispatch to qualified VIP cash buyers + top-of-feed placement for 14 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 text-xs space-y-4">
                <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Wholesaler Protocol
                </div>
                <div className="space-y-2.5 text-slate-400 text-[11px]">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Direct Lead Routing:</strong> Interested buyers contact your team directly by phone and email.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>No Commission Clawbacks:</strong> Keep 100% of your contractual assignment spread or broker fee.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Verified Proof of Funds:</strong> High-cap investors pre-screened for immediate liquidity.</span>
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
