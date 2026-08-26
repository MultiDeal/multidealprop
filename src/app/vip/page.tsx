'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VipContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('starter');

  useEffect(() => {
    if (isSuccess && typeof window !== 'undefined') {
      const selectedPlan = localStorage.getItem('pending_tier') || 'starter';
      localStorage.setItem('multideal_tier', selectedPlan);
      localStorage.setItem('multideal_vip', 'true');
      setCurrentTier(selectedPlan);
    }
  }, [isSuccess]);

  const handleCheckout = async (planKey: 'starter_29' | 'vip_49') => {
    try {
      setLoadingPlan(planKey);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_tier', planKey === 'starter_29' ? 'starter' : 'vip');
      }

      const res = await fetch('/api/checkout/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection.');
      }
    } catch (err: any) {
      alert('Une erreur est survenue : ' + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (isSuccess) {
    const isElite = currentTier === 'vip';
    return (
      <div className="max-w-xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
          {isElite ? '🎉 Accès VIP Elite ($49/mo) Activé' : '🎉 Accès Pro Starter ($29/mo) Activé'}
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-3">Félicitations !</h2>
        <p className="text-slate-300 mb-8">
          Votre abonnement <strong>{isElite ? 'VIP Elite' : 'Pro Starter'}</strong> est actif. Tous les dossiers d'audit, adresses complètes et contacts vendeurs sont déverrouillés.
        </p>
        <a
          href="/deals"
          className="inline-block w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg"
        >
          🚀 Voir tous les Deals Débloqués
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      {isCanceled && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-sm">
          Paiement annulé. Vous pouvez réessayer ci-dessous.
        </div>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
        Choisissez Votre Accès MultiDealProp
      </h1>
      <p className="text-lg text-slate-400 mb-12">
        Accédez aux contacts directs des vendeurs, analyses de rendement détaillées et audits PDF institutionnels.
      </p>

      <div className="grid md:grid-cols-2 gap-8 text-left">
        {/* Pro Starter - 29$ */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Starter</h3>
            <p className="text-slate-400 text-sm mb-6">Idéal pour démarrer la prospection de multilogements rentables.</p>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold">29$</span>
              <span className="text-slate-400 ml-2">/ mois</span>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm mb-8">
              <li className="flex items-center">✓ Pipeline complet de deals multilogements</li>
              <li className="flex items-center">✓ Calculs Pro-Forma & Cap Rates réels</li>
              <li className="flex items-center">✓ Coordonnées directes des vendeurs / grossistes</li>
              <li className="flex items-center">✓ Téléchargement des audits Due Diligence PDF</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout('starter_29')}
            disabled={loadingPlan !== null}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            {loadingPlan === 'starter_29' ? 'Redirection...' : 'Choisir Pro (29$/mois)'}
          </button>
        </div>

        {/* VIP Elite - 49$ */}
        <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
          <span className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Le Plus Populaire
          </span>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">VIP Elite</h3>
            <p className="text-slate-400 text-sm mb-6">Pour les investisseurs actifs recherchant les plus fortes marges.</p>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold">49$</span>
              <span className="text-slate-400 ml-2">/ mois</span>
            </div>
            <ul className="space-y-3 text-slate-300 text-sm mb-8">
              <li className="flex items-center">✓ <strong>Tout ce qui est inclus dans Pro Starter</strong></li>
              <li className="flex items-center">✓ Alertes prioritaires 48h en avant-première</li>
              <li className="flex items-center">✓ Accès aux multilogements commerciaux (5+ portes)</li>
              <li className="flex items-center">✓ Opportunités Off-Market exclusives</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout('vip_49')}
            disabled={loadingPlan !== null}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition shadow-lg"
          >
            {loadingPlan === 'vip_49' ? 'Redirection...' : 'Passer VIP Elite (49$/mois)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VipPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400">Chargement...</div>}>
        <VipContent />
      </Suspense>
    </div>
  );
}
