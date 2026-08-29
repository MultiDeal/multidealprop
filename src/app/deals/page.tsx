'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Exemple de Deal Mock avec flags VIP
const INITIAL_DEALS = [
  {
    id: 'deal-1',
    title: '18-Unit Value-Add Multifamily Portfolio',
    location: 'Cleveland, OH',
    address: '1428-1436 E 120th St, Cleveland, OH 44106',
    apn: '120-14-082',
    price: '$895,000',
    units: 18,
    capRate: '8.4%',
    proFormaCap: '12.1%',
    isExclusive: true, // VIP 48h priority
    wholesaler: {
      name: 'Marcus Vance (Midwest Wholesale Desk)',
      phone: '(216) 555-0194',
      email: 'mvance@midwestacquisitions.com',
    },
    metrics: {
      currentGross: '$14,200/mo',
      proFormaGross: '$21,500/mo',
      rehabEstimate: '$140,000',
    },
  },
  {
    id: 'deal-2',
    title: '24-Unit Garden Style Apartment Complex',
    location: 'Memphis, TN',
    address: '3290 Jackson Ave, Memphis, TN 38112',
    apn: '045-021-0012',
    price: '$1,350,000',
    units: 24,
    capRate: '7.9%',
    proFormaCap: '11.5%',
    isExclusive: false,
    wholesaler: {
      name: 'Sarah Jenkins (Apex Direct Assets)',
      phone: '(901) 555-0182',
      email: 'sjenkins@apexassetsgroup.com',
    },
    metrics: {
      currentGross: '$22,000/mo',
      proFormaGross: '$31,000/mo',
      rehabEstimate: '$210,000',
    },
  },
  {
    id: 'deal-3',
    title: '12-Unit Fully Occupied Brick Quadplexes',
    location: 'Indianapolis, IN',
    address: '2840 N Meridian St, Indianapolis, IN 46208',
    apn: '49-06-25-104-002',
    price: '$720,000',
    units: 12,
    capRate: '8.8%',
    proFormaCap: '10.9%',
    isExclusive: true, // VIP 48h priority
    wholesaler: {
      name: 'David Keller (Circle City Holdings)',
      phone: '(317) 555-0149',
      email: 'dkeller@circlecityequity.com',
    },
    metrics: {
      currentGross: '$11,800/mo',
      proFormaGross: '$15,400/mo',
      rehabEstimate: '$45,000',
    },
  },
];

function DealsContent() {
  const searchParams = useSearchParams();
  const urlTier = searchParams.get('tier') || searchParams.get('plan');
  
  const [userTier, setUserTier] = useState<'starter' | 'vip'>('starter');
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);

  // Synchronisation et mémorisation du statut dans le navigateur
  useEffect(() => {
    if (urlTier === 'vip' || urlTier === 'vip_49' || urlTier === 'elite') {
      setUserTier('vip');
      localStorage.setItem('multidealprop_tier', 'vip');
    } else if (urlTier === 'starter' || urlTier === 'starter_29' || urlTier === 'pro') {
      setUserTier('starter');
      localStorage.setItem('multidealprop_tier', 'starter');
    } else {
      const savedTier = localStorage.getItem('multidealprop_tier');
      if (savedTier === 'vip') {
        setUserTier('vip');
      }
    }
  }, [urlTier]);

  const isVip = userTier === 'vip';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Intelligence Header Bar */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white">Live Deal Flow Desk</h1>
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                isVip 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/10' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {isVip ? '★ VIP Elite Desk Active' : '✓ Pro Starter Active'}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {isVip 
                ? 'All exclusive 48-hour windows, custom on-demand scans, and direct assignor lines unlocked.'
                : 'Direct wholesaler lines and pro-forma underwriting vaults active.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isVip && (
              <Link
                href="/vip"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                Upgrade to VIP Elite &rarr;
              </Link>
            )}
            <Link
              href="/vip"
              className="text-xs text-slate-400 hover:text-white transition px-3 py-2 bg-slate-800 rounded-lg border border-slate-700"
            >
              Subscription Settings
            </Link>
          </div>
        </div>

        {/* VIP On-Demand Scan Banner (Only visible for VIPs) */}
        {isVip && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-amber-300 font-bold text-sm">VIP Privilege: 5 On-Demand City Scans Available</h3>
                <p className="text-slate-400 text-xs">Need off-market multifamily in a specific county? Request a custom underwriting pull.</p>
              </div>
            </div>
            <a
              href="mailto:deals@multidealprop.com?subject=VIP%20Custom%20Scan%20Request"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg transition shrink-0"
            >
              Request Custom Scan
            </a>
          </div>
        )}

        {/* Deals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {INITIAL_DEALS.map((deal) => {
            const isLockedForStarter = deal.isExclusive && !isVip;

            return (
              <div 
                key={deal.id}
                className={`bg-[#0d1527] border rounded-2xl p-6 flex flex-col justify-between transition duration-200 ${
                  deal.isExclusive 
                    ? 'border-amber-500/40 shadow-lg shadow-amber-950/20' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2.5 py-0.5 rounded">
                      {deal.location}
                    </span>
                    {deal.isExclusive && (
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                        VIP 48h Window
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{deal.title}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-emerald-400">{deal.price}</span>
                    <span className="text-xs text-slate-400">({deal.units} Units)</span>
                  </div>

                  {/* Metrics Table */}
                  <div className="grid grid-cols-2 gap-2 bg-[#131d36] p-3 rounded-xl border border-slate-800 text-xs mb-4">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Current Cap</span>
                      <span className="text-slate-200 font-bold">{deal.capRate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Pro-Forma Cap</span>
                      <span className="text-emerald-400 font-bold">{deal.proFormaCap}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Gross In</span>
                      <span className="text-slate-300">{deal.metrics.currentGross}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Est. Rehab</span>
                      <span className="text-slate-300">{deal.metrics.rehabEstimate}</span>
                    </div>
                  </div>

                  {/* Unmasked Data Section */}
                  {isLockedForStarter ? (
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center my-3">
                      <span className="text-xs text-amber-400 font-bold block mb-1">🔒 VIP Exclusive Window Active</span>
                      <p className="text-[11px] text-slate-400 mb-3">Unlocks in 36 hours for Starter members.</p>
                      <Link
                        href="/vip"
                        className="inline-block bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        Unlock with VIP Elite
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl text-xs space-y-1.5 mb-4">
                      <p className="text-slate-300">
                        <strong className="text-slate-500">Address:</strong> {deal.address}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-500">APN / Parcel:</strong> {deal.apn}
                      </p>
                      <p className="text-slate-300">
                        <strong className="text-slate-500">Assignor:</strong> {deal.wholesaler.name}
                      </p>
                      <p className="text-emerald-400 font-mono text-[11px]">
                        📞 {deal.wholesaler.phone} | ✉️ {deal.wholesaler.email}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  {!isLockedForStarter && (
                    <a
                      href={`mailto:${deal.wholesaler.email}?subject=LOI%20Submission%20-%20${encodeURIComponent(deal.address)}`}
                      className="w-full text-center block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition duration-200 shadow-md"
                    >
                      Connect with Assignor &rarr;
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desk Footnote */}
        <div className="mt-16 text-center text-xs text-slate-600 border-t border-slate-800/60 pt-8">
          MultiDealProp Desk • Direct Principal Real Estate Sourcing
        </div>

      </div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">Loading Deals Portal...</div>}>
      <DealsContent />
    </Suspense>
  );
}
