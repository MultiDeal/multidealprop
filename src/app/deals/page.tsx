'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  Settings, 
  Search, 
  Sparkles, 
  Zap, 
  ArrowRight,
  LogOut,
  Mail,
  Phone
} from 'lucide-react';

interface WholesalerContact {
  name: string;
  phone: string;
  email: string;
}

interface DealMetrics {
  currentGross: string;
  proFormaGross: string;
  rehabEstimate: string;
  occupancy: string;
  cashOnCash: string;
  yearBuilt: string;
}

interface DealItem {
  id: string;
  title: string;
  location: string;
  address: string;
  apn: string;
  price: string;
  units: number;
  capRate: string;
  proFormaCap: string;
  isExclusive: boolean;
  imageUrl: string;
  description: string;
  wholesaler: WholesalerContact;
  metrics: DealMetrics;
}

const INITIAL_DEALS: DealItem[] = [
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
    isExclusive: true,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    description: 'Value-add opportunity with 14/18 units currently occupied. Average in-place rents are $785/mo against market comps of $1,150/mo. Upside through cosmetic interior turns and utility bill-back (RUBS).',
    wholesaler: {
      name: 'Marcus Vance (Midwest Wholesale Desk)',
      phone: '(216) 555-0194',
      email: 'mvance@midwestacquisitions.com',
    },
    metrics: {
      currentGross: '$14,200/mo',
      proFormaGross: '$21,500/mo',
      rehabEstimate: '$140,000',
      occupancy: '78%',
      cashOnCash: '14.8%',
      yearBuilt: '1968 (Brick)',
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
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
    description: 'Stabilized cash-flowing asset with immediate upside. Separate electric meters, new pitched roofs installed in 2022, and long-term tenant base in a rapidly revitalizing submarket.',
    wholesaler: {
      name: 'Sarah Jenkins (Apex Direct Assets)',
      phone: '(901) 555-0182',
      email: 'sjenkins@apexassetsgroup.com',
    },
    metrics: {
      currentGross: '$22,000/mo',
      proFormaGross: '$31,000/mo',
      rehabEstimate: '$210,000',
      occupancy: '92%',
      cashOnCash: '13.2%',
      yearBuilt: '1974',
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
    isExclusive: true,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    description: 'Three contiguous 4-unit brick buildings. 100% occupied with prompt payment history. Turnkey condition with light value-add potential on upcoming lease renewals.',
    wholesaler: {
      name: 'David Keller (Circle City Holdings)',
      phone: '(317) 555-0149',
      email: 'dkeller@circlecityequity.com',
    },
    metrics: {
      currentGross: '$11,800/mo',
      proFormaGross: '$15,400/mo',
      rehabEstimate: '$45,000',
      occupancy: '100%',
      cashOnCash: '15.6%',
      yearBuilt: '1982',
    },
  },
];

function DealsContent() {
  const searchParams = useSearchParams();
  const urlTier = searchParams.get('tier') || searchParams.get('plan') || searchParams.get('status');
  
  const [userTier, setUserTier] = useState<'starter' | 'vip'>('vip');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (urlTier === 'starter' || urlTier === 'starter_29' || urlTier === 'pro') {
      setUserTier('starter');
      localStorage.setItem('multidealprop_tier', 'starter');
    } else if (urlTier === 'vip' || urlTier === 'vip_49' || urlTier === 'elite') {
      setUserTier('vip');
      localStorage.setItem('multidealprop_tier', 'vip');
    } else {
      const saved = localStorage.getItem('multidealprop_tier');
      if (saved === 'starter') {
        setUserTier('starter');
      } else {
        setUserTier('vip');
      }
    }
  }, [urlTier]);

  const isVip = userTier === 'vip';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800 bg-[#06080F]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-sm sm:text-lg tracking-wider text-white">
              MULTIDEAL<span className="text-emerald-400">PROP</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link 
              href="/submit-deal" 
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Submit Deal</span>
              <span className="sm:hidden">Submit</span>
            </Link>

            {!isVip && (
              <Link 
                href="/vip" 
                className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-1 flex-shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Upgrade to VIP</span>
              </Link>
            )}

            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Membership</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Deal Flow Desk Status Box */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-white">Live Deal Flow Desk</h1>
              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                isVip 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/10' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {isVip ? '★ VIP Elite Active' : '✓ Pro Starter Active'}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {isVip 
                ? 'All exclusive 48-hour windows, custom on-demand scans, and full underwriting vaults unlocked.'
                : 'Direct wholesaler lines and pro-forma underwriting vaults active.'}
            </p>
          </div>
        </div>

        {/* Modal Membership Settings */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-black text-white mb-1">Subscription &amp; Account</h3>
              <p className="text-xs text-slate-400 mb-6">
                Your institutional deal-flow membership status.
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Plan:</span>
                  <strong className={isVip ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isVip ? 'VIP Elite ($49/mo)' : 'Pro Starter ($29/mo)'}
                  </strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">● Active</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Access:</span>
                  <span className="text-slate-300 font-mono text-[11px]">Saved on this browser</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full text-center block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition border border-slate-700"
                >
                  📱 Log in on Another Device
                </Link>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=deals@multidealprop.com&su=Subscription%20Billing%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center block bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs py-2.5 rounded-xl transition border border-slate-800"
                >
                  Cancel Subscription / Contact Billing
                </a>
                
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/vip';
                  }}
                  className="w-full text-center block text-[11px] text-red-400/70 hover:text-red-400 pt-2 transition cursor-pointer"
                >
                  Disconnect this device
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIP Privilege Banner */}
        {isVip && (
          <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-amber-300 font-bold text-xs sm:text-sm">VIP Privilege: 5 On-Demand Custom Scans Available</h3>
                <p className="text-slate-400 text-xs">Need off-market multifamily in a specific county? Request a custom acquisition scan.</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy('deals@multidealprop.com?subject=VIP%20Custom%20Scan%20Request', 'scan_email')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition shrink-0 cursor-pointer"
            >
              {copiedText === 'scan_email' ? '✓ Request Link Copied!' : 'Request Custom Scan'}
            </button>
          </div>
        )}

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {INITIAL_DEALS.map((deal) => {
            const isLockedForStarter = deal.isExclusive && !isVip;

            return (
              <div 
                key={deal.id}
                className={`bg-slate-900/40 border rounded-3xl overflow-hidden flex flex-col justify-between transition duration-200 hover:border-slate-700 shadow-xl ${
                  deal.isExclusive 
                    ? 'border-amber-500/40 shadow-amber-950/20' 
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <Link 
                    href={isLockedForStarter ? '/vip' : `/deals/${deal.id}`}
                    className="relative h-48 w-full bg-slate-950 overflow-hidden block" 
                  >
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700">
                        {deal.location}
                      </span>
                    </div>
                    {deal.isExclusive && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full shadow-lg">
                          VIP 48h Window
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <Link 
                      href={isLockedForStarter ? '/vip' : `/deals/${deal.id}`}
                      className="text-sm sm:text-base font-bold text-white mb-2 leading-snug block hover:text-emerald-400 transition"
                    >
                      {deal.title}
                    </Link>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{deal.price}</span>
                      <span className="text-xs text-slate-400">({deal.units} Units • {deal.metrics.yearBuilt})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs mb-4">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Current Cap</span>
                        <span className="text-slate-200 font-bold">{deal.capRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Pro-Forma Cap</span>
                        <span className="text-emerald-400 font-bold">{deal.proFormaCap}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Gross In</span>
                        <span className="text-slate-300">{deal.metrics.currentGross}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Est. Rehab</span>
                        <span className="text-slate-300">{deal.metrics.rehabEstimate}</span>
                      </div>
                    </div>

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
                      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-xs space-y-1.5 mb-4">
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
                </div>

                <div className="px-5 pb-5 pt-0 space-y-2">
                  {!isLockedForStarter && (
                    <Link
                      href={`/deals/${deal.id}`}
                      className="w-full text-center block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition duration-200 border border-slate-700"
                    >
                      🔍 View Full Due Diligence &amp; Modeler &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* 8. Institutional Footer */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-8 sm:py-12 mt-16 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
            <div>
              <span className="text-white font-black tracking-wider text-sm">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
              <p className="text-slate-500 text-xs mt-0.5">Institutional Off-Market Multi-Family &amp; Commercial Pipeline</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium">
              <button 
                onClick={() => setShowSettingsModal(true)} 
                className="text-white hover:text-emerald-400 transition-colors font-bold cursor-pointer"
              >
                Membership Settings
              </button>
              <Link href="/submit-deal" className="text-emerald-400 hover:underline transition-colors font-bold">+ Submit Deal</Link>
              <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/vip" className="hover:text-emerald-400 transition-colors">Pricing Plans</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Desk</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms &amp; Disclaimer</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-slate-600 text-center md:text-left">
            <p>
              Disclaimer: MultiDealProp is a data aggregation platform and does not provide real estate brokerage, lending, or legal services.
            </p>
            <p className="flex-shrink-0">
              © {new Date().getFullYear()} MultiDealProp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06080F] text-white flex items-center justify-center font-bold text-xs">Loading Deals Portal...</div>}>
      <DealsContent />
    </Suspense>
  );
}
