'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  tag: string;
  city: string;
  state: string;
  zip: string;
  priceNumeric: number;
  price: string;
  capRateNumeric: number;
  capRate: string;
  monthlyRent: string;
  grossYield: string;
  units: number;
  image: string;
  wholesaler: string;
  isCommercial?: boolean;
}

const SAMPLE_DEALS: Deal[] = [
  {
    id: 'cleveland-brick-3bed',
    title: 'Renovated 3-Bed Brick Home - Section 8 Ready',
    tag: 'High-Cap Underwritten Asset',
    city: 'Cleveland',
    state: 'OH',
    zip: '44120',
    priceNumeric: 89500,
    price: '$89,500',
    capRateNumeric: 12.04,
    capRate: '12.04%',
    monthlyRent: '$1,250',
    grossYield: '16.76%',
    units: 1,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Apex Wholesale Capital LLC',
  },
  {
    id: 'akron-duplex-cashflow',
    title: 'Turnkey Multi-Family Duplex (2 x 2-Bed Units)',
    tag: 'Turnkey Cashflow',
    city: 'Akron',
    state: 'OH',
    zip: '44306',
    priceNumeric: 118000,
    price: '$118,000',
    capRateNumeric: 11.40,
    capRate: '11.40%',
    monthlyRent: '$1,650',
    grossYield: '21.20%',
    units: 2,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Midwest Off-Market Direct',
  },
  {
    id: 'memphis-triplex-portfolio',
    title: 'Stabilized 3-Unit Value-Add Multi-Family',
    tag: 'Value-Add Opportunity',
    city: 'Memphis',
    state: 'TN',
    zip: '38114',
    priceNumeric: 145000,
    price: '$145,000',
    capRateNumeric: 12.20,
    capRate: '12.20%',
    monthlyRent: '$2,100',
    grossYield: '24.10%',
    units: 3,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Delta Acquisition Group',
  },
  {
    id: 'detroit-fourplex-high-yield',
    title: 'High-Yield Fourplex (4 x 1-Bed Units)',
    tag: 'Cash Cow Portfolio',
    city: 'Detroit',
    state: 'MI',
    zip: '48227',
    priceNumeric: 165000,
    price: '$165,000',
    capRateNumeric: 13.50,
    capRate: '13.50%',
    monthlyRent: '$2,800',
    grossYield: '20.40%',
    units: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'MotorCity Deal Hub',
  },
  {
    id: 'baltimore-rowhome-duplex',
    title: 'Historic Brick Duplex - Fully Leased',
    tag: 'Section 8 Certified',
    city: 'Baltimore',
    state: 'MD',
    zip: '21215',
    priceNumeric: 139000,
    price: '$139,000',
    capRateNumeric: 11.10,
    capRate: '11.10%',
    monthlyRent: '$1,900',
    grossYield: '16.40%',
    units: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Chesapeake Property Wholesalers',
  },
  {
    id: 'indianapolis-triplex-cashflow',
    title: 'Fully Occupied Triplex Near University Corridor',
    tag: 'Turnkey Asset',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46201',
    priceNumeric: 175000,
    price: '$175,000',
    capRateNumeric: 10.50,
    capRate: '10.50%',
    monthlyRent: '$2,250',
    grossYield: '15.40%',
    units: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Crossroads Acquisition Desk',
  },
  {
    id: 'philly-duplex-value-add',
    title: 'Multi-Family Duplex - Separate Utilities',
    tag: 'Value-Add Spread',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19134',
    priceNumeric: 129000,
    price: '$129,000',
    capRateNumeric: 11.80,
    capRate: '11.80%',
    monthlyRent: '$1,750',
    grossYield: '16.30%',
    units: 2,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Keystone Off-Market Exchange',
  },
  {
    id: 'kansas-city-fourplex-core',
    title: 'Solid Brick 4-Plex - 100% In-Place Leases',
    tag: 'High-Cap Underwritten',
    city: 'Kansas City',
    state: 'MO',
    zip: '64130',
    priceNumeric: 189000,
    price: '$189,000',
    capRateNumeric: 12.80,
    capRate: '12.80%',
    monthlyRent: '$3,100',
    grossYield: '19.70%',
    units: 4,
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Midwest Metro Wholesale',
  },
  {
    id: 'cleveland-commercial-6plex',
    title: '6-Unit Commercial Multi-Family Apartment Building',
    tag: 'VIP Commercial Exclusive',
    city: 'Cleveland',
    state: 'OH',
    zip: '44108',
    priceNumeric: 279000,
    price: '$279,000',
    capRateNumeric: 14.20,
    capRate: '14.20%',
    monthlyRent: '$4,800',
    grossYield: '20.64%',
    units: 6,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Great Lakes Commercial Hub',
    isCommercial: true,
  },
];

function DealsFeed() {
  const [userTier, setUserTier] = useState<string | null>(null);

  // Filtres d'état
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedUnits, setSelectedUnits] = useState('ALL');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [sortBy, setSortBy] = useState('highest_cap');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isVip = localStorage.getItem('multideal_vip') === 'true';
      const tier = localStorage.getItem('multideal_tier') || (isVip ? 'starter' : null);
      setUserTier(tier);
    }
  }, []);

  const isUnlocked = userTier !== null;
  const isElite = userTier === 'vip';

  // Liste unique des villes
  const cities = useMemo(() => {
    const set = new Set(SAMPLE_DEALS.map((d) => d.city));
    return ['ALL', ...Array.from(set)];
  }, []);

  // Filtrage et Tri combinés
  const filteredDeals = useMemo(() => {
    return SAMPLE_DEALS.filter((deal) => {
      // Recherche textuelle
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.zip.includes(searchTerm) ||
        deal.state.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre Ville
      const matchesCity = selectedCity === 'ALL' || deal.city === selectedCity;

      // Filtre Type / Unités
      let matchesUnits = true;
      if (selectedUnits === '1') matchesUnits = deal.units === 1;
      else if (selectedUnits === '2') matchesUnits = deal.units === 2;
      else if (selectedUnits === '3') matchesUnits = deal.units === 3;
      else if (selectedUnits === '4') matchesUnits = deal.units === 4;
      else if (selectedUnits === '5plus') matchesUnits = deal.units >= 5;

      // Filtre Cap Rate
      const matchesCap = deal.capRateNumeric >= minCapRate;

      return matchesSearch && matchesCity && matchesUnits && matchesCap;
    }).sort((a, b) => {
      if (sortBy === 'highest_cap') return b.capRateNumeric - a.capRateNumeric;
      if (sortBy === 'lowest_price') return a.priceNumeric - b.priceNumeric;
      if (sortBy === 'highest_price') return b.priceNumeric - a.priceNumeric;
      return 0; // Default
    });
  }, [searchTerm, selectedCity, selectedUnits, minCapRate, sortBy]);

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              Live Verified Opportunities ({filteredDeals.length} Available)
            </span>
            <h1 className="text-3xl font-black mt-2 tracking-tight">Multi-Family Deals Feed</h1>
            <p className="text-sm text-slate-400">
              Underwritten properties with live cashflow metrics and direct wholesaler assignment desks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/request-city"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition"
            >
              📍 Scan Target City ($4.99)
            </Link>

            {!isUnlocked ? (
              <Link
                href="/vip"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg transition"
              >
                ⚡ Upgrade Plan ($29 - $49)
              </Link>
            ) : userTier === 'starter' ? (
              <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider py-2 px-3.5 rounded-xl flex items-center gap-1.5">
                ✓ PRO STARTER UNLOCKED ($29/mo)
              </span>
            ) : (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider py-2 px-3.5 rounded-xl flex items-center gap-1.5">
                ✓ VIP ELITE UNLOCKED ($49/mo)
              </span>
            )}
          </div>
        </div>

        {/* BARRE DE FILTRES ET DE RECHERCHE DYNAMIQUE */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Barre de recherche */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                🔍 Search Property / Zip / City
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: Cleveland, Duplex, 44120..."
                className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Filtre Marché / Ville */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                📍 Target Market
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Markets (USA)' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Type d'immeuble */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                🏢 Building Type
              </label>
              <select
                value={selectedUnits}
                onChange={(e) => setSelectedUnits(e.target.value)}
                className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="ALL">All Types</option>
                <option value="1">1 Unit (Single Family)</option>
                <option value="2">2 Units (Duplex)</option>
                <option value="3">3 Units (Triplex)</option>
                <option value="4">4 Units (Fourplex)</option>
                <option value="5plus">5+ Commercial (VIP Only)</option>
              </select>
            </div>

            {/* Tri des résultats */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                ⚡ Sort Deals
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#131d36] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="highest_cap">Highest Cap Rate</option>
                <option value="lowest_price">Price: Low to High</option>
                <option value="highest_price">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Filtre Cap Rate Minimum & Raccourcis Rapides */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase text-[11px]">Min Cap Rate:</span>
              {[0, 11, 12, 13].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinCapRate(rate)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    minCapRate === rate
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-[#131d36] text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {rate === 0 ? 'Any' : `>${rate}%`}
                </button>
              ))}
            </div>

            {(searchTerm || selectedCity !== 'ALL' || selectedUnits !== 'ALL' || minCapRate > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('ALL');
                  setSelectedUnits('ALL');
                  setMinCapRate(0);
                }}
                className="text-rose-400 hover:underline font-semibold text-xs"
              >
                Reset All Filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Grille des Opportunités Filtrées */}
        {filteredDeals.length === 0 ? (
          <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <p className="text-4xl">🔍</p>
            <h3 className="text-lg font-bold text-white">No Properties Found Matching Your Criteria</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Try adjusting your Cap Rate threshold or clearing the search query to see all available deals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const isCommercialLocked = deal.isCommercial && !isElite;
              const hasAccess = isUnlocked && !isCommercialLocked;

              return (
                <div
                  key={deal.id}
                  className={`bg-[#0d1527] border ${
                    deal.isCommercial ? 'border-amber-500/50' : 'border-slate-800'
                  } hover:border-slate-700 rounded-3xl overflow-hidden shadow-2xl transition flex flex-col justify-between`}
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className={`w-full h-full object-cover ${isCommercialLocked ? 'filter blur-[3px]' : ''}`}
                      />
                      <span
                        className={`absolute top-3 left-3 bg-slate-950/80 backdrop-blur border text-xs font-bold px-3 py-1 rounded-full ${
                          deal.isCommercial
                            ? 'border-amber-500/40 text-amber-400'
                            : 'border-slate-700/50 text-emerald-400'
                        }`}
                      >
                        {deal.tag}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                        {deal.units} {deal.units > 1 ? 'Units' : 'Unit'}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-white leading-snug line-clamp-1">
                          {deal.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          📍{' '}
                          {hasAccess
                            ? `${deal.city}, ${deal.state} ${deal.zip}`
                            : isCommercialLocked
                            ? `${deal.city}, ${deal.state} (5+ Units VIP Elite Only 🔒)`
                            : `${deal.city}, ${deal.state} (Exact St Locked 🔒)`}
                        </p>
                      </div>

                      {/* Métriques */}
                      <div className="grid grid-cols-3 gap-2 bg-[#131d36] p-3 rounded-2xl text-center">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
                          <p className="text-sm font-black text-white">{deal.price}</p>
                        </div>
                        <div className="border-x border-slate-800">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Cap Rate</p>
                          <p className="text-sm font-black text-emerald-400">{deal.capRate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Rent</p>
                          <p className="text-sm font-black text-sky-400">{deal.monthlyRent}</p>
                        </div>
                      </div>

                      {/* Contact vendeur */}
                      <div className="text-xs text-slate-400 pt-1">
                        <span className="text-slate-500 block text-[11px]">Direct Wholesaler Entity:</span>
                        {hasAccess ? (
                          <span className="text-emerald-400 font-semibold">{deal.wholesaler}</span>
                        ) : (
                          <span className="blur-sm select-none text-slate-500">{deal.wholesaler}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <div className="p-6 pt-0">
                    {isCommercialLocked ? (
                      <Link
                        href="/vip"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl transition shadow-lg text-xs uppercase tracking-wider text-center"
                      >
                        🔒 Upgrade to VIP Elite (Commercial 5+)
                      </Link>
                    ) : (
                      <Link
                        href={`/deals/${deal.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition shadow-lg text-sm text-center"
                      >
                        ⚡ View Deal & Underwriting
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
{/* FOOTER LÉGAL & PROTECTION */}
        <footer className="border-t border-slate-800 pt-8 pb-12 mt-12 text-center text-xs text-slate-500 space-y-3">
          <p className="max-w-3xl mx-auto leading-relaxed">
            <strong>MultiDealProp Intelligence Desk:</strong> Real estate data and underwritten models are provided strictly for informational purposes. MultiDealProp is not a licensed broker or legal advisor. All investors must conduct independent inspections and title exams.
          </p>
          <div className="flex justify-center items-center gap-4 text-slate-400">
            <Link href="/terms" className="hover:text-white transition underline">Terms of Service & Disclaimers</Link>
            <span>•</span>
            <Link href="/vip" className="hover:text-white transition underline">Subscription Plans</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] text-slate-400 flex items-center justify-center">
          Loading Live Deals Feed...
        </div>
      }
    >
      <DealsFeed />
    </Suspense>
  );
}
