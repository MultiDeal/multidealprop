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
  Plus,
  FileSpreadsheet,
  Download,
  PlusCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SubmitDealPage() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [batchCount, setBatchCount] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState('');
  
  // Images formulaire manuel
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');

  // Données formulaire manuel
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

  // États pour l'Option 1 : Bulk CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedDeals, setParsedDeals] = useState<any[]>([]);
  const [csvContact, setCsvContact] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  // Gestion des images locales
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

  const handleAddUrlImage = () => {
    if (urlInput.trim()) {
      setImagesList((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Envoi d'un deal individuel (avec option saisie en chaîne)
  const handleSingleSubmit = async (e: React.FormEvent, chainMode: boolean = false) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      if (chainMode) {
        // Option 2 : On garde le contact, on vide les infos du bien
        setFormData((prev) => ({
          ...prev,
          title: '',
          address: '',
          price: '',
          monthly_rent: '',
          units: '2',
          arv: '',
          description: ''
        }));
        setImagesList([]);
        alert('Deal saved! You can now enter the next building.');
      } else {
        setBatchCount(1);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      alert('Error submitting deal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Télécharger le modèle CSV officiel
  const downloadCsvTemplate = () => {
    const headers = 'title,address,price,monthly_rent,units,arv\n';
    const sample1 = '"Turnkey 4-Plex Portfolio 1","3410 W Chicago Blvd, Detroit, MI 48206",135000,3600,4,210000\n';
    const sample2 = '"High Cash Flow Duplex","1428 E 120th St, Cleveland, OH 44106",98000,1950,2,145000\n';
    const blob = new Blob([headers + sample1 + sample2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'multidealprop_portfolio_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lecture et parsing du fichier CSV
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        alert('CSV file is empty or missing data rows.');
        return;
      }

      const parsed: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        // Regex pour séparer par virgules en respectant les guillemets
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        if (row.length >= 5) {
          parsed.push({
            title: row[0]?.replace(/"/g, '').trim(),
            address: row[1]?.replace(/"/g, '').trim(),
            price: Number(row[2]?.replace(/[^0-9.]/g, '')) || 0,
            monthly_rent: Number(row[3]?.replace(/[^0-9.]/g, '')) || 0,
            units: Number(row[4]?.replace(/[^0-9.]/g, '')) || 2,
            arv: row[5] ? Number(row[5]?.replace(/[^0-9.]/g, '')) : null
          });
        }
      }
      setParsedDeals(parsed);
    };
    reader.readAsText(file);
  };

  // Soumission en masse (Bulk Upload)
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedDeals.length === 0) {
      alert('Please upload a valid CSV with properties first.');
      return;
    }
    setLoading(true);

    try {
      const dealsToInsert = parsedDeals.map((deal) => ({
        title: deal.title,
        formatted_address: deal.address,
        price: deal.price,
        monthly_rent: deal.monthly_rent,
        units: deal.units,
        arv: deal.arv,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        contact_name: csvContact.contact_name,
        contact_email: csvContact.contact_email,
        contact_phone: csvContact.contact_phone
      }));

      const { error } = await supabase.from('deals').insert(dealsToInsert);
      if (error) throw error;

      setBatchCount(parsedDeals.length);
      setIsSubmitted(true);
    } catch (err: any) {
      alert('Error importing portfolio: ' + err.message);
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
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {batchCount > 1 ? `${batchCount} Properties Published!` : 'Deal Published & Underwritten!'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Your listings are now live and featured on the MultiDealProp deal feed.
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
                    `🔥 Multi-Family Deals Available:\n` +
                    `• Verified Cash Flow Portfolio Listings\n` +
                    `• Complete Underwriting & Lender DSCR Audit: ${window.location.origin}`,
                    'pitch'
                  )}
                  className="text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copySuccess === 'pitch' ? 'Copied!' : 'Copy Post'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 font-mono bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 select-all leading-relaxed">
                🔥 Multi-Family Deals Available<br />
                • Verified Cash Flow Portfolio Listings<br />
                • Complete Underwriting &amp; Lender DSCR Audit: {typeof window !== 'undefined' ? window.location.origin : 'multidealprop.com'}
              </p>
            </div>

            {/* OUTIL 2 : Le Badge HTML Embeddable */}
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
                  setParsedDeals([]);
                  setCsvFile(null);
                  setImagesList([]);
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Upload More Deals
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
          <div className="space-y-6">
            
            {/* Header & Sélecteur d'onglets (Single vs Portfolio CSV) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  100% Free Listing
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  List Multi-Family Properties
                </h1>
              </div>

              <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('single')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'single'
                      ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Single Deal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('bulk')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'bulk'
                      ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Bulk CSV (Portfolio)</span>
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* ONGLET 1 : FORMULAIRE MANUEL (AVEC SAISIE EN CHAÎNE)        */}
            {/* ============================================================ */}
            {activeTab === 'single' ? (
              <form onSubmit={(e) => handleSingleSubmit(e, false)} className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
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

                  {/* Photos */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 text-xs font-bold">
                        Property Photos ({imagesList.length} added)
                      </label>
                      <span className="text-[10px] text-slate-500">First photo will be the main cover</span>
                    </div>

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

                {/* Boutons d'actions : Unique vs Saisie en Chaîne (Option 2) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => handleSingleSubmit(e, true)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Save &amp; Add Another Deal</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Publish Deal &amp; Finish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* ============================================================ */
              /* ONGLET 2 : OPTION 1 - BULK CSV PORTFOLIO IMPORT              */
              /* ============================================================ */
              <form onSubmit={handleBulkSubmit} className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> 1. Portfolio CSV Spreadsheet
                      </h2>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Import 5, 10 or 50 multi-family buildings at once.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={downloadCsvTemplate}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Sample CSV Template</span>
                    </button>
                  </div>

                  {/* Drag and drop CSV */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950 rounded-2xl p-8 cursor-pointer transition text-center group">
                    <FileSpreadsheet className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 mb-2 transition" />
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white">
                      {csvFile ? csvFile.name : 'Click to Upload your Portfolio CSV'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {parsedDeals.length > 0 ? `${parsedDeals.length} properties detected` : 'Columns: title, address, price, monthly_rent, units, arv'}
                    </span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Aperçu des propriétés trouvées dans le CSV */}
                  {parsedDeals.length > 0 && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block">
                        Preview: {parsedDeals.length} Properties Ready to Import
                      </span>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2 font-mono text-xs text-slate-300">
                        {parsedDeals.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-900">
                            <span className="truncate max-w-[280px] font-sans font-bold text-white">{p.title} ({p.units} Doors)</span>
                            <span className="text-emerald-400">${p.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coordonnées globales pour tout le portfolio */}
                <div className="space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Home className="w-4 h-4" /> 2. Portfolio Sponsor / Promoter Contact
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Smith"
                        value={csvContact.contact_name}
                        onChange={(e) => setCsvContact({ ...csvContact, contact_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@acquisitions.com"
                        value={csvContact.contact_email}
                        onChange={(e) => setCsvContact({ ...csvContact, contact_email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(216) 555-0182"
                        value={csvContact.contact_phone}
                        onChange={(e) => setCsvContact({ ...csvContact, contact_phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || parsedDeals.length === 0}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Importing Portfolio Deals...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Import {parsedDeals.length > 0 ? `${parsedDeals.length} Deals` : 'Portfolio'} &amp; Publish</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
