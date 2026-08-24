'use client';

import React, { useState } from 'react';

export default function VipPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planKey: 'starter_29' | 'vip_49') => {
    try {
      setLoadingPlan(planKey);
      const res = await fetch('/api/checkout/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection vers le paiement.');
      }
    } catch (err: any) {
      alert('Une erreur est survenue : ' + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Débloquez l'Accès VIP MultiDealProp
        </h1>
        <p className="text-lg text-slate-400 mb-12">
          Accédez aux contacts directs des vendeurs, analyses de rendement détaillées et deals exclusifs avant tout le monde.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Plan Pro Starter - 29$ */}
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
                <li className="flex items-center">✓ Annulation en un clic à tout moment</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('starter_29')}
              disabled={loadingPlan !== null}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md"
            >
              {loadingPlan === 'starter_29' ? 'Redirection...' : 'Choisir Pro (29$/mois)'}
            </button>
          </div>

          {/* Plan VIP Elite - 49$ */}
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
                <li className="flex items-center">✓ <strong>Tout ce qui est inclus dans Pro</strong></li>
                <li className="flex items-center">✓ Alertes prioritaires 48h en avant-première</li>
                <li className="flex items-center">✓ Accès aux multilogements commerciaux (5+ portes)</li>
                <li className="flex items-center">✓ Opportunités Off-Market & cessions exclusives</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('vip_49')}
              disabled={loadingPlan !== null}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-3 px-6 rounded-xl transition shadow-lg"
            >
              {loadingPlan === 'vip_49' ? 'Redirection...' : 'Passer VIP Elite (49$/mois)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}