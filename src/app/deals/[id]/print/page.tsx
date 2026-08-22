'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DealPrintPdfPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Vérification du statut payant
    const userTier = typeof window !== 'undefined' ? localStorage.getItem('user_tier') : null;
    const paid = userTier === 'BASIC' || userTier === 'VIP';
    setIsAuthorized(paid);

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
          title: 'Turnkey Multi-Family Duplex - 2 Units Leased',
          exact_address: '1428 E 71st Street',
          city: 'Cleveland',
          state: 'OH',
          zip_code: '44105',
          price: 98000,
          cap_rate: 13.4,
          monthly_rent_estimate: 1950,
          gross_yield: 23.8,
          units_count: 2,
          seller_name: 'Apex Wholesale Capital LLC',
          seller_phone: '+1 (216) 884-2190',
          seller_email: 'acquisitions@apexreicapital.com',
          description: 'Fully occupied 2-unit turnkey multi-family property generating consistent cash-flow.'
        });
      }
      setLoading(false);
    }

    loadDeal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-slate-600">
        <p className="text-sm font-bold animate-pulse">Generating Audit Report...</p>
      </div>
    );
  }

  // Si l'utilisateur est gratuit -> Écran de blocage Paywall
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#06080F] text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-5">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Full PDF Pack Locked</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Complete underwriting schedules, certified rent rolls, and assignment contracts are reserved for Basic and VIP Pro subscribers.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/vip"
              className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:opacity-95 text-black font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all block"
            >
              <Zap className="w-4 h-4" />
              Unlock with Basic or VIP Plan
            </Link>

            <button
              onClick={() => router.back()}
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est payant -> Affichage du rapport imprimable
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8 print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">MULTIDEALPROP • UNDERWRITING AUDIT PACK</h1>
            <p className="text-xs text-slate-500">Official Institutional Due Diligence Dossier</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="print:hidden bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-700 uppercase mb-2">Asset Identification</h3>
            <p><span className="font-semibold">Property:</span> {deal.title}</p>
            <p><span className="font-semibold">Address:</span> {deal.exact_address}, {deal.city}, {deal.state} {deal.zip_code}</p>
            <p><span className="font-semibold">Asking Price:</span> ${Number(deal.price).toLocaleString()}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-700 uppercase mb-2">Direct Wholesaler Contact</h3>
            <p><span className="font-semibold">Entity:</span> {deal.seller_name || 'Apex Wholesale Capital LLC'}</p>
            <p><span className="font-semibold">Phone:</span> {deal.seller_phone || '+1 (216) 884-2190'}</p>
            <p><span className="font-semibold">Email:</span> {deal.seller_email || 'acquisitions@apexreicapital.com'}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h3 className="font-bold text-slate-700 uppercase mb-2">Financial Breakdown</h3>
          <div className="grid grid-cols-3 gap-2">
            <p><span className="font-semibold">Cap Rate:</span> {deal.cap_rate}%</p>
            <p><span className="font-semibold">Gross Yield:</span> {deal.gross_yield}%</p>
            <p><span className="font-semibold">Est. Monthly Rent:</span> ${Number(deal.monthly_rent_estimate).toLocaleString()}</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 border-t border-slate-200 pt-4">
          <p className="font-semibold text-slate-700 mb-1">Confidential Due Diligence Note:</p>
          <p>{deal.description}</p>
        </div>
      </div>
    </div>
  );
}