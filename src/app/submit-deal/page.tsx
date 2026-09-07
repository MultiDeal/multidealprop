'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
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
  PlusCircle,
  LayoutDashboard,
  Calculator,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SubmitDealPage() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [batchCount, setBatchCount] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Stocke l'ID généré pour le lien direct /deals/[id]
  const [createdDealId, setCreatedDealId] = useState<string | number | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        if (user.email) {
          setFormData((prev) => ({ ...prev, contact_email: prev.contact_email || user.email! }));
          setCsvContact((prev) => ({ ...prev, contact_email: prev.contact_email || user.email! }));
        }
      }
    }
    checkAuth();
  }, []);

  // Photos réelles stockées en URLs Supabase Storage
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    monthly_rent: '',
    units: '2',
    arv: '',
    taxes: '',
    insurance: '',
    maintenance: '',
    management_rate: '8',
    vacancy_rate: '5',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedDeals, setParsedDeals] = useState<any[]>([]);
  const [csvContact, setCsvContact] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  // Calculs financiers instantanés
  const metrics = useMemo(() => {
    const p = Number(formData.price) || 0;
    const rent = Number(formData.monthly_rent) || 0;
    const grossAnnual = rent * 12;

    const taxes = formData.taxes !== '' ? Number(formData.taxes) : (p * 0.015);
    const insurance = formData.insurance !== '' ? Number(formData.insurance) : (Number(formData.units) * 450);
    const maintenance = formData.maintenance !== '' ? Number(formData.maintenance) : (grossAnnual * 0.05);
    const mgmt = grossAnnual * ((Number(formData.management_rate) || 0) / 100);
    const vac = grossAnnual * ((Number(formData.vacancy_rate) || 0) / 100);

    const totalOpEx = taxes + insurance + maintenance + mgmt + vac;
    const effectiveNOI = Math.max(0, grossAnnual - totalOpEx);
    const capRate = p > 0 ? (effectiveNOI / p) * 100 : 0;

    const loanAmount = p * 0.75;
    const monthlyRate = 0.07 / 12;
    const nPayments = 360;
    const monthlyDebt = loanAmount > 0 
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments))) / (Math.pow(1 + monthlyRate, nPayments) - 1)
      : 0;
    const annualDebt = monthlyDebt * 12;
    const dscr = annualDebt > 0 ? effectiveNOI / annualDebt : 0;

    return {
      effectiveNOI,
      capRate: capRate.toFixed(2),
      dscr: dscr.toFixed(2)
    };
  }, [formData]);

  // Upload automatique et transparent vers le bucket existant "deal-images"
  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large (> 10MB)`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('deal-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          alert("Storage upload failed: " + uploadError.message);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('deal-images')
          .getPublicUrl(filePath);

        if (publicUrl) {
          setImagesList((prev) => [...prev, publicUrl]);
        }
      }
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploadingImage(false);
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

  // Envoi du deal
  const handleSingleSubmit = async (e: React.FormEvent, chainMode: boolean = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const primaryImage = imagesList.length > 0 
        ? imagesList[0] 
        : 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80';

      const { data: insertedDeal, error } = await supabase.from('deals').insert([
        {
          user_id: user?.id ?? null,
          title: formData.title,
          formatted_address: formData.address,
          price: Number(formData.price),
          monthly_rent: Number(formData.monthly_rent),
          units: Number(formData.units),
          arv: formData.arv ? Number(formData.arv) : null,
          taxes: formData.taxes ? Number(formData.taxes) : null,
          insurance: formData.insurance ? Number(formData.insurance) : null,
          maintenance: formData.maintenance ? Number(formData.maintenance) : null,
          management_rate: formData.management_rate ? Number(formData.management_rate) : 8,
          vacancy_rate: formData.vacancy_rate ? Number(formData.vacancy_rate) : 5,
          image_url: primaryImage,
          images: imagesList,
          description: formData.description,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone
        }
      ])
      .select('id')
      .single();

      if (error) throw error;

      if (insertedDeal) {
        setCreatedDealId(insertedDeal.id);
      }

      if (chainMode) {
        setFormData((prev) => ({
          ...prev,
          title: '',
          address: '',
          price: '',
          monthly_rent: '',
          units: '2',
          arv: '',
          taxes: '',
          insurance: '',
          maintenance: '',
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

  // Modèle CSV
  const downloadCsvTemplate = () => {
    const headers = 'title,address,price,monthly_rent,units,arv,taxes,insurance,maintenance\n';
    const sample1 = '"Turnkey 4-Plex Portfolio 1","3410 W Chicago Blvd, Detroit, MI 48206",135000,3600,4,210000,1850,950,1200\n';
    const sample2 = '"High Cash Flow Duplex","1428 E 120th St, Cleveland, OH 44106",98000,1950,2,145000,1450,850,1000\n';
    const blob = new Blob([headers + sample1 + sample2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'multidealprop_portfolio_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        if (row.length >= 5) {
          parsed.push({
            title: row[0]?.replace(/"/g, '').trim(),
            address: row[1]?.replace(/"/g, '').trim(),
            price: Number(row[2]?.replace(/[^0-9.]/g, '')) || 0,
            monthly_rent: Number(row[3]?.replace(/[^0-9.]/g, '')) || 0,
            units: Number(row[4]?.replace(/[^0-9.]/g, '')) || 2,
            arv: row[5] ? Number(row[5]?.replace(/[^0-9.]/g, '')) : null,
            taxes: row[6] ? Number(row[6]?.replace(/[^0-9.]/g, '')) : null,
            insurance: row[7] ? Number(row[7]?.replace(/[^0-9.]/g, '')) : null,
            maintenance: row[8] ? Number(row[8]?.replace(/[^0-9.]/g, '')) : null
          });
        }
      }
      setParsedDeals(parsed);
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedDeals.length === 0) {
      alert('Please upload a valid CSV with properties first.');
      return;
    }
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const dealsToInsert = parsedDeals.map((deal) => ({
        user_id: user?.id ?? null,
        title: deal.title,
        formatted_address: deal.address,
        price: deal.price,
        monthly_rent: deal.monthly_rent,
        units: deal.units,
        arv: deal.arv,
        taxes: deal.taxes,
        insurance: deal.insurance,
        maintenance: deal.maintenance,
        management_rate: 8,
        vacancy_rate: 5,
        image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        contact_name: csvContact.contact_name,
        contact_email: csvContact.contact_email,
        contact_phone: csvContact.contact_phone
      }));

      const { data, error } = await supabase.from('deals').insert(dealsToInsert).select('id');
      if (error) throw error;

      if (data && data.length > 0) {
        setCreatedDealId(data[0].id);
      }

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

  // URL propre SEO directe pour Facebook
  const canonicalDealUrl = typeof window !== 'undefined' && createdDealId
    ? `${window.location.origin}/deals/${createdDealId}`
    : 'https://www.multidealprop.com/deals';

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* En-tête */}
      <header className="border-b border-slate-800/80 bg-[#04060C]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Underwriter</span>
          </Link>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link 
                href="/my-deals"
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Listings</span>
              </Link>
            ) : (
              <Link 
                href="/auth"
                className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition"
              >
                Login to Edit Listings
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {!currentUser && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0b1222] border border-slate-800 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              <span className="text-white font-bold block mb-0.5">Posting as Guest</span>
              Create an account or log in to manage, edit, or delete your deals later.
            </div>
            <Link 
              href="/auth"
              className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition shrink-0"
            >
              Sign Up / Login
            </Link>
          </div>
        )}
        
        {isSubmitted ? (
          /* ÉCRAN DE SUCCÈS & PARTAGE FACEBOOK */
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

            {/* Post 1-Clic Facebook avec URL SEO /deals/[id] */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Share Post (Facebook &amp; BiggerPockets)
                </span>
                <button
                  onClick={() => handleCopy(
                    `🔥 Multi-Family Deal: ${formData.title || 'Turnkey Opportunity'} - $${Number(formData.price || 0).toLocaleString()} (${formData.units} Doors).\n` +
                    `View live DSCR Underwriting & Memo:\n${canonicalDealUrl}`,
                    'pitch'
                  )}
                  className="text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copySuccess === 'pitch' ? 'Copied!' : 'Copy Post'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 font-mono bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 select-all leading-relaxed">
                🔥 Multi-Family Deal: {formData.title || 'Turnkey Opportunity'} - ${Number(formData.price || 0).toLocaleString()} ({formData.units} Doors)<br />
                View live DSCR Underwriting &amp; Memo:<br />
                <span className="text-emerald-400 font-bold underline">{canonicalDealUrl}</span>
              </p>
            </div>

            {/* Badge Embed */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" /> Website Embed Badge (Verified Backlink)
                </span>
                <button
                  onClick={() => handleCopy(
                    `<a href="${canonicalDealUrl}" target="_blank" rel="noopener">\n` +
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
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {currentUser && (
                <Link
                  href="/my-deals"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition text-center"
                >
                  View in My Listings
                </Link>
              )}
              {createdDealId && (
                <Link
                  href={`/deals/${createdDealId}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition text-center"
                >
                  View Deal Page
                </Link>
              )}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setParsedDeals([]);
                  setCsvFile(null);
                  setImagesList([]);
                  setCreatedDealId(null);
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
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-emerald-400" /> 100% Free Self-Service Listing
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

            {/* BANDEAU DE RÉASSURANCE POUR GROSSISTES (Zéro appel / 100% Digital) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1224] to-cyan-950/30 border border-emerald-500/30 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">100% Free • Direct Buyer Inquiries • No Broker Fees • Instant Lender Memo Generated</strong>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    No phone calls required. Buyers see your verified contact info directly on the memo.
                  </span>
                </span>
              </div>
            </div>

            {/* ONGLET 1 : FORMULAIRE UNIQUE */}
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
                      placeholder="e.g. Turnkey West Side Cash Flow Duplex"
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
                      placeholder="e.g. 3548 W 63rd St, Cleveland, OH 44102"
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
                        placeholder="99900"
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
                        placeholder="1850"
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
                      placeholder="140000"
                      value={formData.arv}
                      onChange={(e) => setFormData({ ...formData, arv: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Operating Expenses (OpEx) */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" /> Operating Expenses (Annual OpEx)
                      </label>
                      <span className="text-[10px] text-slate-500">Auto-benchmarked if empty</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 text-[11px] block mb-1">Annual Property Taxes ($)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1450"
                          value={formData.taxes}
                          onChange={(e) => setFormData({ ...formData, taxes: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 text-[11px] block mb-1">Annual Hazard Insurance ($)</label>
                        <input
                          type="number"
                          placeholder="e.g. 850"
                          value={formData.insurance}
                          onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 text-[11px] block mb-1">Annual Repairs / CapEx ($)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1200"
                          value={formData.maintenance}
                          onChange={(e) => setFormData({ ...formData, maintenance: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-slate-400 text-[11px] block mb-1">Property Management (%)</label>
                        <input
                          type="number"
                          placeholder="8"
                          value={formData.management_rate}
                          onChange={(e) => setFormData({ ...formData, management_rate: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-[11px] block mb-1">Economic Vacancy Reserve (%)</label>
                        <input
                          type="number"
                          placeholder="5"
                          value={formData.vacancy_rate}
                          onChange={(e) => setFormData({ ...formData, vacancy_rate: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    {Number(formData.price) > 0 && Number(formData.monthly_rent) > 0 && (
                      <div className="p-3.5 bg-slate-950 border border-emerald-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-emerald-400" />
                          <span className="text-[11px] font-bold text-slate-300">Live Underwriting Audit:</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div>
                            <span className="text-slate-500 text-[10px] block font-sans">Net NOI</span>
                            <span className="text-white font-bold">${Math.round(metrics.effectiveNOI).toLocaleString()}/yr</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block font-sans">Real Cap Rate</span>
                            <span className="text-emerald-400 font-black">{metrics.capRate}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block font-sans">Estimated DSCR</span>
                            <span className="text-cyan-400 font-black">{metrics.dscr}x</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="pt-2">
                    <label className="text-slate-300 text-xs font-bold block mb-1">Deal Description &amp; Highlights</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Turnkey duplex with separate utilities, fully occupied by paying tenants..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Photos : Upload Direct vers deal-images */}
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
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin mb-1" />
                            <span className="text-xs font-bold text-emerald-400">Uploading to storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-1 transition" />
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                              Upload Photos (Select Multiple)
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          disabled={uploadingImage} 
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

                {/* Coordonnées vendeur */}
                <div className="space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Home className="w-4 h-4" /> 2. Seller / Wholesaler Info (Direct Inquiries)
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Your Name / Entity *</label>
                      <input
                        type="text"
                        required
                        placeholder="Marcus Vance"
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Direct Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="deals@midwestcashflow.com"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(216) 555-0142"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={loading || uploadingImage}
                    onClick={(e) => handleSingleSubmit(e, true)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Save &amp; Add Another Deal</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading || uploadingImage}
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
              /* ONGLET 2 : BULK CSV */
              <form onSubmit={handleBulkSubmit} className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> 1. Portfolio CSV Spreadsheet
                      </h2>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Import full multi-family portfolios with OpEx metrics.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={downloadCsvTemplate}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Sample CSV</span>
                    </button>
                  </div>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950 rounded-2xl p-8 cursor-pointer transition text-center group">
                    <FileSpreadsheet className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 mb-2 transition" />
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white">
                      {csvFile ? csvFile.name : 'Click to Upload your Portfolio CSV'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {parsedDeals.length > 0 ? `${parsedDeals.length} properties detected` : 'Columns: title, address, price, monthly_rent, units, arv, taxes, insurance, maintenance'}
                    </span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                    />
                  </label>

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
                        placeholder="Marcus Vance"
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
                        placeholder="deals@midwestcashflow.com"
                        value={csvContact.contact_email}
                        onChange={(e) => setCsvContact({ ...csvContact, contact_email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(216) 555-0142"
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
