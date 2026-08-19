'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  MapPin, 
  Lock, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2,
  Mail
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  property_type: string;
  formatted_address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  estimated_market_value: number;
  units_count: number;
  monthly_rent_estimate: number;
  cap_rate: number;
  deal_score: number;
  section8_eligible: boolean;
  is_vip_only: boolean;
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function getDeal() {
      if (!params?.id) return;
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        setDeal(data as Deal);
      }
      setLoading(false);
    }
    getDeal();
  }, [params?.id]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      await supabase.from('leads').insert([
        { email, interested_in: deal?.title || 'Unknown Deal' }
      ]);
      setUnlocked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400">
        Chargement de l'opportunité...
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-slate-400 gap-4">
        <p>Opportunité introuvable.</p>
        <button onClick={() => router.push('/')} className="text-emerald-400 underline text-sm">
          Retour à la liste
        </button>
      </div>
    );
  }

  const discount = deal.estimated_market_value && deal.price
    ? Math.round(((deal.estimated_market_value - deal.price) / deal.estimated_market_value) * 100)
    : 0;

  const estimatedAnnualRent = (deal.monthly_rent_estimate || 0) * 12;
  const estimatedNetIncome = Math.round(estimatedAnnualRent * 0.65); // Estimation charges ~35%

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation retour */}
        <button 
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux opportunités
        </button>

        {/* En-tête de l'opportunité */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-md uppercase tracking-wide">
              <Building2 className="w-3.5 h-3.5" /> {deal.property_type}
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Deal Score : {deal.deal_score}/100
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{deal.title}</h1>
          <p className="flex items-center gap-1 text-slate-400 text-sm mt-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            {unlocked ? deal.formatted_address : `${deal.city}, ${deal.state} ${deal.zip_code} (Adresse exacte masquée)`}
          </p>

          {/* Grille financière */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Prix Demandé</div>
              <div className="text-xl font-bold text-white">${Number(deal.price).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Valeur Estimée</div>
              <div className="text-xl font-bold text-emerald-400">
                ${Number(deal.estimated_market_value).toLocaleString()}
                {discount > 0 && <span className="text-xs ml-1 font-normal">(-{discount}%)</span>}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Cap Rate</div>
              <div className="text-xl font-bold text-emerald-400">{deal.cap_rate}%</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Loyers / Mois</div>
              <div className="text-xl font-bold text-white">${Number(deal.monthly_rent_estimate).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Détails & Rentabilité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Projections Annuelles
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Revenus Bruts Estimés</span>
                <span className="font-semibold text-white">${estimatedAnnualRent.toLocaleString()} / an</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Estimation NOI (Net)</span>
                <span className="font-semibold text-emerald-400">${estimatedNetIncome.toLocaleString()} / an</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">Nombre de portes / unités</span>
                <span className="font-semibold text-white">{deal.units_count} unité(s)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Programme Section 8</span>
                <span className="font-semibold text-emerald-400">
                  {deal.section8_eligible ? 'Éligible (Paiement Garanti)' : 'Prix Marché'}
                </span>
              </div>
            </div>
          </div>

          {/* Déblocage Contacts & Adresse (Lead Magnet) */}
          <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Dossier Off-Market
              </div>
              <h2 className="text-base font-bold text-white mb-2">Débloquer le dossier complet</h2>
              <p className="text-xs text-slate-400 mb-4">
                Accédez à l'adresse exacte, à la fiche du vendeur/courtier et aux comparables de quartier.
              </p>
            </div>

            {unlocked ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Dossier Débloqué !</p>
                <p className="text-[11px] text-slate-300 mt-1">Adresse : {deal.formatted_address}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Contact assigné : agent-support@multidealprop.com</p>
              </div>
            ) : (
              <form onSubmit={handleUnlock} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Votre adresse email pro..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  {submitting ? 'Déblocage...' : 'Recevoir le dossier & Adresse'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
