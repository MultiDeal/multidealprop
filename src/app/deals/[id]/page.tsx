'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2,
  Mail,
  Calculator,
  Wallet,
  Share2,
  Check
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
  image_url?: string;
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Paramètres du simulateur de financement
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.8);
  const loanTermYears = 30;

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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: deal?.title || 'MultiDealProp Opportunity',
          text: `Découvrez cette opportunité d'investissement : ${deal?.title}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback vers la copie dans le presse-papier si annulation
      }
    }

    // Copie standard dans le presse-papier
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
        Chargement des analyses financières...
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-slate-400 gap-4">
        <p>Opportunité introuvable.</p>
        <button onClick={() => router.push('/')} className="text-emerald-400 underline text-sm cursor-pointer">
          Retour à la liste
        </button>
      </div>
    );
  }

  const price = Number(deal.price) || 0;
  const marketVal = Number(deal.estimated_market_value) || price;
  const discount = marketVal > price ? Math.round(((marketVal - price) / marketVal) * 100) : 0;
  const monthlyRent = Number(deal.monthly_rent_estimate) || 0;

  // Calculs Financiers Détaillés
  const downPaymentAmount = (price * downPaymentPercent) / 100;
  const loanAmount = price - downPaymentAmount;
  const monthlyInterestRate = (interestRate / 100) / 12;
  const totalMonths = loanTermYears * 12;

  const monthlyMortgage = loanAmount > 0 && monthlyInterestRate > 0
    ? Math.round((loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) / (Math.pow(1 + monthlyInterestRate, totalMonths) - 1))
    : 0;

  const monthlyTaxes = Math.round((price * 0.018) / 12);
  const monthlyInsurance = Math.round(120 * (deal.units_count || 1));
  const monthlyManagement = Math.round(monthlyRent * 0.08);
  const monthlyMaintenance = Math.round(monthlyRent * 0.05);

  const totalMonthlyExpenses = monthlyMortgage + monthlyTaxes + monthlyInsurance + monthlyManagement + monthlyMaintenance;
  const netMonthlyCashFlow = monthlyRent - totalMonthlyExpenses;
  const annualCashFlow = netMonthlyCashFlow * 12;
  const cashOnCashReturn = downPaymentAmount > 0 
    ? ((annualCashFlow / downPaymentAmount) * 100).toFixed(1) 
    : '0';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Barre de navigation & Partage */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux opportunités
          </button>

          <button
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              copied 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-slate-850 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Lien copié !
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" /> Partager ce deal
              </>
            )}
          </button>
        </div>

        {/* Bannière Photo HD */}
        <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6 border border-slate-800 relative">
          <img 
            src={deal.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
        </div>

        {/* Carte Titre Principale */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-md uppercase tracking-wide">
              <Building2 className="w-3.5 h-3.5" /> {deal.property_type} ({deal.units_count} Portes)
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Deal Score : {deal.deal_score}/100
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{deal.title}</h1>
          <p className="flex items-center gap-1 text-slate-400 text-sm mt-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            {unlocked ? deal.formatted_address : `${deal.city}, ${deal.state} ${deal.zip_code} (Adresse exacte réservée aux membres)`}
          </p>

          {/* Grille financière haut de page */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Prix Demandé</div>
              <div className="text-xl font-bold text-white">${price.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Valeur Estimée</div>
              <div className="text-xl font-bold text-emerald-400">
                ${marketVal.toLocaleString()}
                {discount > 0 && <span className="text-xs ml-1 font-normal">(-{discount}%)</span>}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Cap Rate Brut</div>
              <div className="text-xl font-bold text-emerald-400">{deal.cap_rate}%</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Loyers Totaux Estimés</div>
              <div className="text-xl font-bold text-white">${monthlyRent.toLocaleString()} / mois</div>
            </div>
          </div>
        </div>

        {/* Simulateur & Décomposition Financière */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Simulateur */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4 text-emerald-400" /> Simulateur de Financement & Hypothèque
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Mise de fonds (Down Payment) : <strong className="text-white">{downPaymentPercent}% (${downPaymentAmount.toLocaleString()})</strong></label>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    step="5"
                    value={downPaymentPercent} 
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Taux d'intérêt estimé : <strong className="text-white">{interestRate}% (30 ans)</strong></label>
                  <input 
                    type="range" 
                    min="4.5" 
                    max="10.0" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bilan des Dépenses */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Bilan Mensuel Estimé (Cash Flow)
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-300 font-medium">(+) Loyers bruts mensuels</span>
                  <span className="font-bold text-emerald-400">+${monthlyRent.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 text-xs text-slate-400">
                  <span>(-) Hypothèque (P&I - 30 ans)</span>
                  <span className="text-rose-400">-${monthlyMortgage.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 text-xs text-slate-400">
                  <span>(-) Taxes foncières (Property Taxes ~1.8%/an)</span>
                  <span className="text-rose-400">-${monthlyTaxes.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 text-xs text-slate-400">
                  <span>(-) Assurances Propriétaire</span>
                  <span className="text-rose-400">-${monthlyInsurance.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 text-xs text-slate-400">
                  <span>(-) Gestion locative (8%)</span>
                  <span className="text-rose-400">-${monthlyManagement.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                  <span>(-) Réserve travaux & vacance (5%)</span>
                  <span className="text-rose-400">-${monthlyMaintenance.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <div className="font-bold text-white text-base flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-400" /> Cash Flow Net Mensuel
                    </div>
                    <div className="text-[11px] text-slate-400">Rendement Cash-on-Cash : <span className="text-emerald-400 font-semibold">{cashOnCashReturn}%</span></div>
                  </div>
                  <div className={`text-xl font-extrabold ${netMonthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {netMonthlyCashFlow >= 0 ? `+$${netMonthlyCashFlow.toLocaleString()}` : `-$${Math.abs(netMonthlyCashFlow).toLocaleString()}`} / mois
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Déblocage Dossier & Leads */}
          <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between h-fit">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Dossier d'Acquisition
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Débloquer le dossier complet</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Recevez la fiche détaillée du bien avec l'adresse exacte, les baux en cours (Section 8), et le contact direct du vendeur ou gestionnaire.
              </p>
            </div>

            {unlocked ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Dossier Débloqué !</p>
                <p className="text-[11px] text-slate-300 mt-1">Adresse : {deal.formatted_address}</p>
                <p className="text-[11px] text-slate-400 mt-1">Équipe support : deals@multidealprop.com</p>
              </div>
            ) : (
              <form onSubmit={handleUnlock} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Votre email d'investisseur..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {submitting ? 'Envoi...' : 'Recevoir le dossier & Contact'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
