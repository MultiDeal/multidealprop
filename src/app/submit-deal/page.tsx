'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Home, 
  Send, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles, 
  Loader2,
  Copy,
  Code,
  Upload,
  X,
  Plus
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SubmitDealPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  
  // Tableau pour supporter plusieurs images
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    monthly_rent: '',
    units: '2',
    arv: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  // Gestion de l'ajout de plusieurs fichiers locaux
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large (> 5MB)`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagesList((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Ajout d'image par URL
  const handleAddUrlImage = () => {
    if (urlInput.trim()) {
      setImagesList((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  // Suppression d'une image de la sélection
  const removeImage = (indexToRemove: number) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Image principale (la 1ère de la liste) ou fallback
      const primaryImage = imagesList.length > 0 
        ? imagesList[0] 
        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

      const { error } = await supabase.from('deals').insert([
        {
          title: formData.title,
          formatted_address: formData.address,
          price: Number(formData.price),
          monthly_rent: Number(formData.monthly_rent),
          units: Number(formData.units),
          arv: formData.arv ? Number(formData.arv) : null,
          image_url: primaryImage,
          images: imagesList,
          description: formData.description,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone
        }
      ]);

      if (error) throw error;
      setIsSubmitted(true);
    } catch (err: any) {
      alert('Error submitting deal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#04060C]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Underwriter</span>
          </Link>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Deal Portal</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        
        {isSubmitted ? (
          /* ÉCRAN DE SUCCÈS & GÉNÉRATEUR DE BACKLINKS */
          <div className="bg-[#0b1222] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Deal Published &amp; Underwritten!</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Your property is now live with {imagesList.length} uploaded photo{imagesList.length > 1 ? 's' : ''}.
              </p>
            </div>

            {/* OUTIL 1 : Le Pitch 1-Clic pour Groupes Facebook */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Share Post (Facebook &amp; BiggerPockets)
                </span>
                <button
                  onClick={() => handleCopy(
                    `🔥 Off-Market Deal: ${formData.title} (${formData.address})\n` +
                    `• Asking Price: $${Number(formData.price).toLocaleString()}\n` +
                    `• Units: ${formData.units} Doors\n` +
                    `• Gross Rent: $${Number(formData.monthly_rent).toLocaleString()}/mo\n` +
                    `• Complete Underwriting & Lender DSCR Audit: ${window.location.origin}/?address=${encodeURIComponent(formData.address)}`,
                    'pitch'
                  )}
                  className="text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copySuccess === 'pitch' ? 'Copied!' : 'Copy Post'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 font-mono bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 select-all leading-relaxed">
                🔥 Off-Market Deal: {formData.title} ({formData.address})<br />
                • Asking Price: ${Number(formData.price).toLocaleString()}<br />
                • Units: {formData.units} Doors<br />
                • Gross Rent: ${Number(formData.monthly_rent).toLocaleString()}/mo<br />
                • Complete Underwriting &amp; Lender DSCR Audit: {typeof window !== 'undefined' ? window.location.origin : 'multidealprop.com'}/?address={encodeURIComponent(formData.address)}
              </p>
            </div>

            {/* OUTIL 2 : Le Badge HTML Embeddable pour leur site web */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" /> Website Embed Badge (Verified Backlink)
                </span>
                <button
                  onClick={() => handleCopy(
                    `<a href="${window.location.origin}" target="_blank" rel="noopener">\n` +
                    `  <img src="${window.location.origin}/badge-underwritten.svg" alt="Underwritten by MultiDealProp" width="220" />\n` +
                    `</a>`,
                    'badge'
                  )}
                  className="text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copySuccess === 'badge' ? 'Copied HTML!' : 'Copy HTML'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste this badge on your website to display an institutional verification checkmark for your buyers.
              </p>
              <code className="text-[11px] text-emerald-300 block font-mono bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 truncate">
                {`<a href="${typeof window !== 'undefined' ? window.location.origin : 'multidealprop.com'}" target="_blank">...</a>`}
              </code>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setImagesList([]);
                  setFormData({
                    title: '',
                    address: '',
                    price: '',
                    monthly_rent: '',
                    units: '2',
                    arv: '',
                    description: '',
                    contact_name: '',
                    contact_email: '',
                    contact_phone: ''
                  });
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Post Another Deal
              </button>
              <Link
                href="/"
                className="flex-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition text-center shadow-lg shadow-emerald-500/20"
              >
                Go to Underwriter
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULAIRE DE SOUMISSION DU DEAL */
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                100% Free Listing
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                List Your Multi-Family Deal
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Reach active cash buyers and provide automatic lender-ready DSCR underwriting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* Infos Propriété */}
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Building2 className="w-4 h-4" /> 1. Property Details
                </h2>

                <div>
                  <label className="text-slate-300 text-xs font-bold block mb-1">Deal Headline / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Turnkey University Circle Duplex"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-xs font-bold block mb-1">Physical Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1428 E 120th St, Cleveland, OH 44106"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">Asking Price ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="98000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">Total Monthly Rent ($) *</label>
                    <input
                      type="number"
                      required
                      placeholder="1950"
                      value={formData.monthly_rent}
                      onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">Units (Doors) *</label>
                    <select
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    >
                      <option value="2">2 Units (Duplex)</option>
                      <option value="3">3 Units (Triplex)</option>
                      <option value="4">4 Units (Fourplex)</option>
                      <option value="5">5-8 Units</option>
                      <option value="9">9+ Units</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-xs font-bold block mb-1">Estimated ARV ($) (Optional)</label>
                  <input
                    type="number"
                    placeholder="145000"
                    value={formData.arv}
                    onChange={(e) => setFormData({ ...formData, arv: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>

                {/* SÉLECTEUR DE PLUSIEURS PHOTOS */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 text-xs font-bold">
                      Property Photos ({imagesList.length} added)
                    </label>
                    <span className="text-[10px] text-slate-500">First photo will be the main cover</span>
                  </div>

                  {/* Galerie d'aperçu des photos sélectionnées */}
                  {imagesList.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      {imagesList.map((imgUrl, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group">
                          <img src={imgUrl} alt={`deal-${index}`} className="w-full h-full object-cover" />
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-90 group-hover:opacity-100 transition shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Zone de glisser-déposer / sélection multiple */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950 rounded-2xl p-4 cursor-pointer transition group text-center">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-1 transition" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                        Upload Photos (Select Multiple)
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleMultipleFiles}
                        className="hidden" 
                      />
                    </label>

                    {/* Ajout par URL */}
                    <div className="flex flex-col justify-center space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400">Or add via Image Web Link:</span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://images.site.com/photo.jpg"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={handleAddUrlImage}
                          className="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contact Grossiste */}
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Home className="w-4 h-4" /> 2. Seller / Wholesaler Info
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@acquisitions.com"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(216) 555-0182"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Deal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Deal &amp; Get Diligence Link</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </main>

    </div>
  );
}
