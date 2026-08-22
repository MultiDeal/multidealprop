'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeal() {
      if (!id) return;
      
      const { data } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setDeal(data);
      } else {
        setDeal({
          id,
          title: 'Turnkey Multi-Family Duplex - Value Add Opportunity',
          city: 'Cleveland',
          state: 'OH',
          zip_code: '44105',
          price: 98000,
          cap_rate: 13.4,
          monthly_rent_estimate: 1950,
          gross_yield: 23.8,
          seller_name: 'Apex Wholesale Capital LLC',
          seller_phone: '+1 (216) 884-2190',
          seller_email: 'acquisitions@apexreicapital.com',
          image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
          description: 'Fully tenanted turnkey 2-unit multi-family property generating consistent cash-flow. Recent roof and mechanical updates. Long-term tenants in place with immediate rent growth potential.'
        });
      }
      setLoading(false);
    }
    loadDeal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080F] flex items-center justify-center text-white font-sans">
        <p className="text-sm font-bold animate-pulse text-emerald-400">Loading Deal & Financial Matrix...</p>
      </div>
    );
  }

  const priceFormatted = Number(deal.price || 0).toLocaleString();
  const rentFormatted = Number(deal.monthly_rent_estimate || 1800).toLocaleString();

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </button>

          <Link href="/vip" className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all">
            ⚡ Upgrade VIP Pro
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Deal Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> High-Cap Underwritten Asset
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{deal.title}</h1>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {deal.city || 'Market'}, {deal.state || ''} {deal.zip_code || ''} • USA Multi-Family
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Off-Market Asking Price</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">${priceFormatted}</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image */}
            {deal.image_url && (
              <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 h-72 sm:h-96 relative">
                <img 
                  src={deal.image_url} 
                  alt={deal.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Core Specs */}
            <div className="grid grid-cols-3 gap-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Cap Rate</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{deal.cap_rate || 13.4}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Gross Monthly Rent</div>
                <div className="text-xl font-black text-cyan-300 mt-0.5">${rentFormatted}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Gross Yield</div>
                <div className="text-xl font-black text-white mt-0.5">{deal.gross_yield || 23.8}%</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Investment Synopsis</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{deal.description}</p>
            </div>

          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            
            {/* PDF DOWNLOAD BOX */}
            <div className="bg-gradient-to-b from-slate-900 to-[#0A121E] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Due Diligence Vault
              </div>
              <h3 className="text-lg font-black text-white mb-2">Audit Report &amp; Rent Roll</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Complete financial underwriting, lease schedules, expense audit, and seller assignment details.
              </p>

              <Link
                href={`/deals/${id}/print`}
                target="_blank"
                className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:opacity-95 text-black font-black text-xs sm:text-sm py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                📄 Download PDF Audit Pack
              </Link>
            </div>

            {/* Seller Contact Desk */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Direct Wholesaler Desk</div>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{deal.seller_name || 'Apex Wholesale Capital LLC'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">{deal.seller_phone || '+1 (216) 884-2190'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">{deal.seller_email || 'acquisitions@apexreicapital.com'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
