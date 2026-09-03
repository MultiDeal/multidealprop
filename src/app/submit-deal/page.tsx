'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  UploadCloud, 
  X, 
  ImageIcon,
  FolderOpen,
  User,
  Loader2,
  DollarSign
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SubmitDealPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fichiers sélectionnés localement
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
    cloud_folder_url: '',
    wholesaler_name: '',
    wholesaler_phone: '',
    wholesaler_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      addFiles(filesArray);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      addFiles(filesArray);
    }
  };

  const addFiles = (files: File[]) => {
    const combinedFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(combinedFiles);
    const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const uploadImagesToStorage = async (dealId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${dealId}_${Date.now()}_${i}.${fileExt}`;
      const filePath = `deals/${fileName}`;

      setUploadProgressText(`Uploading image ${i + 1} of ${selectedFiles.length}...`);

      const { error: uploadError } = await supabase.storage
        .from('deal-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.warn(`Storage note:`, uploadError.message);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('deal-images')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const dealId = 'deal_' + Math.random().toString(36).substring(2, 9);
      let mainImageUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

      if (selectedFiles.length > 0) {
        const urls = await uploadImagesToStorage(dealId);
        if (urls.length > 0) {
          mainImageUrl = urls[0];
        }
      }

      setUploadProgressText('Publishing deal data to marketplace...');

      const price = Number(formData.price) || 0;
      const units = Number(formData.units) || 2;
      const rent = Number(formData.monthly_rent) || 0;
      const arv = Number(formData.arv) || Math.round(price * 1.3);
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
          image_url: mainImageUrl,
          wholesaler_name: formData.wholesaler_name,
          wholesaler_phone: formData.wholesaler_phone,
          wholesaler_email: formData.wholesaler_email,
          created_at: new Date().toISOString(),
        }
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting deal. Please verify connection.');
    } finally {
      setLoading(false);
      setUploadProgressText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 font-sans antialiased px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Lien Retour */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back to MultiDealProp
        </Link>

        {submitted ? (
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-black text-white">Deal Published Live!</h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-lg mx-auto">
              Your property and photos are now live with automated Cap Rate and DSCR calculations.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-base hover:bg-emerald-300 transition inline-block shadow-xl shadow-emerald-500/20"
              >
                View on Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Header Formulaire */}
            <div>
              <span className="text-emerald-400 text-xs sm:text-sm font-black uppercase tracking-wider bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 inline-block">
                Free Wholesaler &amp; Off-Market Submission
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Submit Your Multi-Family Deal
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
                Add your contract or property details. We automatically build institutional metrics (DSCR, Cap Rate) for serious cash buyers.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-4 rounded-2xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* SECTION 1: UPLOAD PHOTOS */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" /> 1. Photos de l&apos;immeuble (Direct Upload)
              </h3>

              {/* Zone Drag & Drop agrandie */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-400/80 bg-slate-950/70 rounded-2xl p-6 sm:p-10 text-center transition cursor-pointer relative"
              >
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-lg">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    Appuyez ici ou glissez vos photos
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    JPG, PNG ou WEBP (jusqu&apos;à 5 photos)
                  </p>
                </div>
              </div>

              {/* Prévisualisations */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-red-500 text-white p-1.5 rounded-full transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-emerald-400 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Lien Google Drive Optionnel */}
              <div className="pt-1">
                <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-cyan-400" /> 
                  Lien dossier photos complet (Google Drive ou Dropbox - Optionnel)
                </label>
                <input
                  type="url"
                  name="cloud_folder_url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.cloud_folder_url}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white outline-none focus:border-emerald-400 transition"
                />
              </div>
            </div>

            {/* SECTION 2: DÉTAILS DU BIEN */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" /> 2. Propriété &amp; Données Financières
              </h3>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                  Titre de l&apos;annonce / Headline
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="ex: Turnkey Duplex - Strong Cash Flow"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base font-medium text-white outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Adresse civique
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="ex: 1428 E 120th St"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="ex: Cleveland"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Nombre de portes (Units)
                  </label>
                  <input
                    type="number"
                    name="units"
                    min="2"
                    required
                    value={formData.units}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base font-mono text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Prix demandé ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="85000"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-emerald-400 font-mono font-bold outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Loyers bruts ($/mois)
                  </label>
                  <input
                    type="number"
                    name="monthly_rent"
                    required
                    placeholder="1800"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white font-mono outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    ARV estimé ($)
                  </label>
                  <input
                    type="number"
                    name="arv"
                    placeholder="130000"
                    value={formData.arv}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-cyan-300 font-mono outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTACT */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" /> 3. Vos Coordonnées (Contact Direct)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Nom / Entreprise
                  </label>
                  <input
                    type="text"
                    name="wholesaler_name"
                    required
                    placeholder="ex: Apex Acquisitions"
                    value={formData.wholesaler_name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    name="wholesaler_phone"
                    required
                    placeholder="(216) 555-0199"
                    value={formData.wholesaler_phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-300 block mb-1.5">
                    Adresse Courriel
                  </label>
                  <input
                    type="email"
                    name="wholesaler_email"
                    required
                    placeholder="deals@acquisitions.com"
                    value={formData.wholesaler_email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm sm:text-base text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* BOUTON SOUMETTRE */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-4 sm:py-5 rounded-2xl text-sm sm:text-base uppercase tracking-wider transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{uploadProgressText || 'Envoi en cours...'}</span>
                  </>
                ) : (
                  <span>Publier le Deal avec Photos (100% Gratuit)</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
