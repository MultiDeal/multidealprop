'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
    isExclusive: true, // VIP 48h priority
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
  const [activeModalDeal, setActiveModalDeal] = useState<any | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [contactModalDeal, setContactModalDeal] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (urlTier === 'vip' || urlTier === 'vip_49' || urlTier === 'elite') {
      setUserTier('vip');
      localStorage.setItem('multidealprop_tier', 'vip');
    } else if (urlTier === 'starter' || urlTier === 'starter_29' || urlTier === 'pro') {
      setUserTier('starter');
      localStorage.setItem('multidealprop_tier', 'starter');
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

  const getGmailUrl = (email: string, subject: string, body: string) => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Intelligence Header Bar */}
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
                ? 'All exclusive 48-hour windows, custom on-demand scans, and full underwriting vaults unlocked.'
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
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-xs text-slate-300 hover:text-white transition px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer font-bold"
            >
              ⚙️ Membership Settings
            </button>
          </div>
        </div>

        {/* Modal Membership Settings */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-black text-white mb-2">Subscription & Account</h3>
              <p className="text-xs text-slate-400 mb-6">
                Manage your billing, active tier, and payment preferences.
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
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Renewal Cycle:</span>
                  <span className="text-slate-300">Monthly via Stripe</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleCopy('deals@multidealprop.com', 'support_email')}
                  className="w-full text-center block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition border border-slate-700 cursor-pointer"
                >
                  {copiedText === 'support_email' ? '✓ Support Email Copied!' : 'Copy Support Email: deals@multidealprop.com'}
                </button>
                
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/vip';
                  }}
                  className="w-full text-center block text-xs text-red-400 hover:text-red-300 py-2 transition cursor-pointer"
                >
                  Sign Out from this Device
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Direct Wholesaler Contact / LOI (No Outlook popup!) */}
        {contactModalDeal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
              <button 
                onClick={() => setContactModalDeal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                  Direct Assignor Contact
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-1">{contactModalDeal.title}</h3>
              <p className="text-xs text-slate-400 mb-6">{contactModalDeal.address}</p>

              {/* Contact Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Assignor Name:</span>
                  <span className="text-white font-semibold text-sm">{contactModalDeal.wholesaler.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Direct Phone:</span>
                    <span className="text-emerald-400 font-mono text-sm">{contactModalDeal.wholesaler.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contactModalDeal.wholesaler.phone, 'phone')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700"
                  >
                    {copiedText === 'phone' ? '✓ Copied' : 'Copy Phone'}
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Direct Email:</span>
                    <span className="text-emerald-400 font-mono text-xs">{contactModalDeal.wholesaler.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contactModalDeal.wholesaler.email, 'email')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700"
                  >
                    {copiedText === 'email' ? '✓ Copied' : 'Copy Email'}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Open in Webmail / Gmail or Copy */}
              <div className="space-y-3">
                <a
                  href={getGmailUrl(
                    contactModalDeal.wholesaler.email,
                    `LOI Submission / Inquiry - ${contactModalDeal.address}`,
                    `Hello ${contactModalDeal.wholesaler.name},\n\nI am writing to inquire about the assignment contract for ${contactModalDeal.address} (${contactModalDeal.price}). Please send over the complete diligence packet and current title status.\n\nBest regards.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center block bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-red-900/30 cursor-pointer"
                >
                  ✉️ Open Compose in Gmail Web &rarr;
                </a>

                <button
                  onClick={() => {
                    const fullInfo = `Deal: ${contactModalDeal.title}\nAddress: ${contactModalDeal.address}\nPrice: ${contactModalDeal.price}\nAssignor: ${contactModalDeal.wholesaler.name}\nPhone: ${contactModalDeal.wholesaler.phone}\nEmail: ${contactModalDeal.wholesaler.email}`;
                    handleCopy(fullInfo, 'full_deal');
                  }}
                  className="w-full text-center block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition border border-slate-700 cursor-pointer"
                >
                  {copiedText === 'full_deal' ? '✓ Complete Deal & Assignor Details Copied!' : '📋 Copy All Contact Info to Clipboard'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIP On-Demand Banner */}
        {isVip && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-amber-300 font-bold text-sm">VIP Privilege: 5 On-Demand Custom Scans Available</h3>
                <p className="text-slate-400 text-xs">Need off-market multifamily in a specific county? Request a custom acquisition scan.</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy('deals@multidealprop.com?subject=VIP%20Custom%20Scan%20Request', 'scan_email')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg transition shrink-0 cursor-pointer"
            >
              {copiedText === 'scan_email' ? '✓ Request Link Copied!' : 'Request Custom Scan'}
            </button>
          </div>
        )}

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {INITIAL_DEALS.map((deal) => {
            const isLockedForStarter = deal.isExclusive && !isVip;

            return (
              <div 
                key={deal.id}
                className={`bg-[#0d1527] border rounded-2xl overflow-hidden flex flex-col justify-between transition duration-200 hover:border-slate-700 shadow-xl ${
                  deal.isExclusive 
                    ? 'border-amber-500/40 shadow-amber-950/20' 
                    : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Property Image */}
                  <div 
                    className="relative h-48 w-full bg-slate-900 overflow-hidden cursor-pointer" 
                    onClick={() => !isLockedForStarter && setActiveModalDeal(deal)}
                  >
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700">
                        {deal.location}
                      </span>
                    </div>
                    {deal.isExclusive && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full shadow-lg">
                          VIP 48h Window
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 
                      onClick={() => !isLockedForStarter && setActiveModalDeal(deal)}
                      className="text-lg font-bold text-white mb-2 leading-snug cursor-pointer hover:text-emerald-400 transition"
                    >
                      {deal.title}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-emerald-400">{deal.price}</span>
                      <span className="text-xs text-slate-400">({deal.units} Units • {deal.metrics.yearBuilt})</span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 bg-[#131d36] p-3 rounded-xl border border-slate-800 text-xs mb-4">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Cap</span>
                        <span className="text-slate-200 font-bold">{deal.capRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Pro-Forma Cap</span>
                        <span className="text-emerald-400 font-bold">{deal.proFormaCap}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Gross In</span>
                        <span className="text-slate-300">{deal.metrics.currentGross}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Est. Rehab</span>
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
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-0 space-y-2">
                  {!isLockedForStarter && (
                    <>
                      <button
                        onClick={() => setActiveModalDeal(deal)}
                        className="w-full text-center block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition duration-200 border border-slate-700 cursor-pointer"
                      >
                        🔍 View Full Due Diligence & Photos
                      </button>
                      <button
                        onClick={() => setContactModalDeal(deal)}
                        className="w-full text-center block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition duration-200 shadow-md shadow-emerald-500/10 cursor-pointer"
                      >
                        Connect with Assignor &rarr;
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Full Due Diligence */}
        {activeModalDeal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
              
              <button 
                onClick={() => setActiveModalDeal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ✕
              </button>

              <div className="rounded-2xl overflow-hidden mb-6 h-64 sm:h-72 w-full">
                <img 
                  src={activeModalDeal.imageUrl} 
                  alt={activeModalDeal.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {activeModalDeal.location}
                </span>
                {activeModalDeal.isExclusive && (
                  <span className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-1 rounded-full uppercase tracking-wider">
                    VIP 48h Window
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{activeModalDeal.title}</h2>
              <p className="text-emerald-400 text-2xl font-black mb-4">{activeModalDeal.price} <span className="text-sm text-slate-400 font-normal">({activeModalDeal.units} Total Units)</span></p>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-[#131d36] p-4 rounded-xl border border-slate-800">
                {activeModalDeal.description}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Institutional Underwriting Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs mb-6">
                <div>
                  <span className="text-slate-500 block uppercase">Current In-Place Cap</span>
                  <strong className="text-slate-200 text-sm">{activeModalDeal.capRate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Pro-Forma Stabilized Cap</span>
                  <strong className="text-emerald-400 text-sm">{activeModalDeal.proFormaCap}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Cash-on-Cash Return</span>
                  <strong className="text-emerald-400 text-sm">{activeModalDeal.metrics.cashOnCash}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Current Gross Income</span>
                  <strong className="text-slate-200 text-sm">{activeModalDeal.metrics.currentGross}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Pro-Forma Gross</span>
                  <strong className="text-slate-200 text-sm">{activeModalDeal.metrics.proFormaGross}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Estimated Rehab Budget</span>
                  <strong className="text-amber-400 text-sm">{activeModalDeal.metrics.rehabEstimate}</strong>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Primary Contract Assignor Contact</h4>
                <div className="text-sm text-slate-200 space-y-1">
                  <p><strong>Desk Contact:</strong> {activeModalDeal.wholesaler.name}</p>
                  <p><strong>Direct Phone:</strong> <span className="text-emerald-400 font-mono">{activeModalDeal.wholesaler.phone}</span></p>
                  <p><strong>Assignment Email:</strong> <span className="text-emerald-400 font-mono">{activeModalDeal.wholesaler.email}</span></p>
                  <p><strong>Full Address:</strong> {activeModalDeal.address}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActiveModalDeal(null);
                    setContactModalDeal(activeModalDeal);
                  }}
                  className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Submit LOI / Connect Directly &rarr;
                </button>
              </div>

            </div>
          </div>
        )}

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
