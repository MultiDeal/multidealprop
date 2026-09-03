'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  UploadCloud, 
  X, 
  Image as ImageIcon,
  FolderOpen,
  User,
  Loader2
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
    cloud_folder_url: '', // Lien Google Drive / Dropbox optionnel
    wholesaler_name: '',
    wholesaler_phone: '',
    wholesaler_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la sélection de fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      addFiles(filesArray);
    }
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      addFiles(filesArray);
    }
  };

  const addFiles = (files: File[]) => {
    // Limite à 5 photos pour garder un téléversement rapide
    const combinedFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(combinedFiles);

    // Génération des prévisualisations
    const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  // Téléversement vers Supabase Storage
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
        console.warn(`Storage upload note for file ${i}:`, uploadError.message);
        continue;
      }

      // Récupération de l'URL publique
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

      // Téléversement des photos si présentes
      if (selectedFiles.length > 0) {
        const urls = await uploadImagesToStorage(dealId);
        if (urls.length > 0) {
          mainImageUrl = urls[0];
        }
      }

      setUploadProgressText('Publishing deal data to database...');

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
      setErrorMsg(err.message || 'Error submitting deal. Please verify your Supabase settings.');
    } finally {
      setLoading(false);
      setUploadProgressText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 font-sans antialiased p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {submitted ? (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">Deal Published Live!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Your property has been listed with real photos and automated institutional financial metrics (Cap Rate, DSCR).
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs hover:bg-emerald-300 transition inline-block shadow-lg shadow-emerald-500/20"
              >
                View on Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-block">
                Free Wholesaler Submission
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">Submit Your Multi-Family Deal</h1>
              <p className="text-slate-400 text-xs mt-1">
                Upload your photos and financial metrics. We format your deal into an institutional presentation for active cash buyers.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* SECTION 1: UPLOAD PHOTOS DIRECT */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" /> 1. Property Photos (Direct Upload)
              </h3>

              {/* Zone Drag & Drop */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 rounded-2xl p-6 text-center transition cursor-pointer relative"
              >
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    Click to browse or drag &amp; drop photos here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports JPG, PNG or WEBP (up to 5 photos)
                  </p>
                </div>
              </div>

              {/* Prévisualisations des vignettes */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-black/80 hover:bg-red-500 text-white p-1 rounded-full transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Lien Google Drive / Dropbox optionnel */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-cyan-400" /> 
                  Full Photo Album Link (Optional Google Drive or Dropbox)
                </label>
                <input
                  type="url"
                  name="cloud_folder_url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.cloud_folder_url}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* SECTION 2: DONNÉES DU BIEN */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" /> 2. Property &amp; Financial Details
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Deal Headline / Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Turnkey Cash-Flow Duplex near Cleveland Clinic"
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
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Contract Price ($)</label>
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
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Gross Rent ($/mo)</label>
                  <input
                    type="number"
                    name="monthly_rent"
                    required
                    placeholder="1850"
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
                    placeholder="135000"
                    value={formData.arv}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTACT DISPO / WHOLESALER */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> 3. Contact &amp; Acquisitions Desk
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Your Name / Company</label>
                  <input
                    type="text"
                    name="wholesaler_name"
                    required
                    placeholder="e.g. Apex Acquisitions"
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

            {/* BOUTON DE SOUMISSION */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadProgressText || 'Publishing...'}</span>
                </>
              ) : (
                <span>Publish Deal with Photos (100% Free)</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
