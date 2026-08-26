'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  tag: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  capRate: string;
  monthlyRent: string;
  grossYield: string;
  units: number;
  image: string;
  wholesaler: string;
}

const SAMPLE_DEALS: Deal[] = [
  {
    id: 'cleveland-brick-3bed',
    title: 'Renovated 3-Bed Brick Home - Section 8 Ready',
    tag: 'High-Cap Underwritten Asset',
    city: 'Cleveland',
    state: 'OH',
    zip: '44120',
    price: '$89,500',
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
    price: '$118,000',
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
    price: '$145,000',
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
    price: '$165,000',
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
    price: '$139,000',
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
    price: '$175,000',
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
    price: '$129,000',
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
    price: '$189,000',
    capRate: '12.80%',
    monthlyRent: '$3,100',
    grossYield: '19.70%',
    units: 4,
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Midwest Metro Wholesale',
  },
  {
    id: 'st-louis-duplex-turnkey',
    title: 'Turnkey 2-Unit Residential Income Property',
    tag: 'Cashflow Asset',
    city: 'St. Louis',
    state: 'MO',
    zip: '63118',
    price: '$105,000',
    capRate: '12.00%',
    monthlyRent: '$1,500',
    grossYield: '17.10%',
    units: 2,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Gateway Deal Network',
  },
];

function DealsFeed() {
  const [userTier, setUserTier] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isVip = localStorage.getItem('multideal_vip') === 'true';
      const tier = localStorage.getItem('multideal_tier') || (isVip ? 'starter' : null);
      setUserTier(tier);
    }
  }, []);

  const isUnlocked = userTier !== null;

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              Live Verified Opportunities ({SAMPLE_DEALS.length} Available)
            </span>
            <h1 className="text-3xl font-black mt-2 tracking-tight">Multi-Family Deals Feed</h1>
            <p className="text-sm text-slate-400">Underwritten properties with live cashflow metrics and direct assignment contracts.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/request-city"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition"
            >
              📍 Scan Target City ($4.99)
            </Link>

            {/* Badge adaptatif selon le forfait exact */}
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

        {/* Grille des 9 Deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="bg-[#0d1527] border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-2xl transition flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-700/50 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
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
                      📍 {isUnlocked ? `${deal.city}, ${deal.state} ${deal.zip}` : `${deal.city}, ${deal.state} (Exact St Locked 🔒)`}
                    </p>
                  </div>

                  {/* Bandeau de chiffres clés */}
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
                    <span className="text-slate-500 block text-[11px]">Direct Seller Entity:</span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-semibold">{deal.wholesaler}</span>
                    ) : (
                      <span className="blur-sm select-none text-slate-500">{deal.wholesaler}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton d'accès */}
              <div className="p-6 pt-0">
                <Link
                  href={`/deals/${deal.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition shadow-lg text-sm text-center"
                >
                  ⚡ View Deal & Underwriting
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] text-slate-400 flex items-center justify-center">Loading Deals Feed...</div>}>
      <DealsFeed />
    </Suspense>
  );
}
