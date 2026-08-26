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
    capRate: '10.8%',
    monthlyRent: '$1,250',
    grossYield: '23.8%',
    units: 1,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
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
    capRate: '11.4%',
    monthlyRent: '$1,650',
    grossYield: '21.2%',
    units: 2,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
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
    capRate: '12.2%',
    monthlyRent: '$2,100',
    grossYield: '24.1%',
    units: 3,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    wholesaler: 'Delta Acquisition Group',
  },
];

function DealsFeed() {
  const [isVip, setIsVip] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vipStatus = localStorage.getItem('multideal_vip') === 'true';
      setIsVip(vipStatus);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              Live Verified Opportunities
            </span>
            <h1 className="text-3xl font-black mt-2 tracking-tight">Multi-Family Deals Feed</h1>
            <p className="text-sm text-slate-400">Underwritten properties with live cashflow metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/request-city"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition"
            >
              📍 Scan Target City ($4.99)
            </Link>

            {!isVip ? (
              <Link
                href="/vip"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg transition"
              >
                ⚡ Upgrade VIP ($29)
              </Link>
            ) : (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-xl flex items-center gap-1">
                ✓ VIP Unlocked
              </span>
            )}
          </div>
        </div>

        {/* Deals Cards Grid */}
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

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white leading-snug line-clamp-1">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      📍 {isVip ? `${deal.city}, ${deal.state} ${deal.zip}` : `${deal.city}, ${deal.state} (Exact St Locked 🔒)`}
                    </p>
                  </div>

                  {/* Financial Metrics Strip */}
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

                  {/* Contact Summary */}
                  <div className="text-xs text-slate-400 pt-1">
                    <span className="text-slate-500 block text-[11px]">Direct Seller Entity:</span>
                    {isVip ? (
                      <span className="text-emerald-400 font-semibold">{deal.wholesaler}</span>
                    ) : (
                      <span className="blur-sm select-none text-slate-500">Apex Wholesale Capital LLC</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
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
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] text-slate-400 flex items-center justify-center">Loading Deals...</div>}>
      <DealsFeed />
    </Suspense>
  );
}
