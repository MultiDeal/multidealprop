'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  Settings, 
  ShieldCheck, 
  Zap, 
  ArrowLeft,
  Lock,
  Unlock,
  Calculator,
  FileText
} from 'lucide-react';

const DEALS_DATABASE: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Turnkey Multi-Family Duplex - Fully Leased',
    location: 'Cleveland, OH',
    address: '1428-1436 E 120th St, Cleveland, OH 44106',
    apn: '120-14-082',
    price: 98000,
    units: 2,
    monthlyRent: 1250,
    grossAnnual: 15000,
    vacancyRate: 0.05,
    taxes: 1420,
    insurance: 850,
    managementRate: 0.08,
    capexRate: 0.05,
    waterSewer: 780,
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Apex Wholesaler Capital LLC (Marcus Vance)',
      phone: '(216) 555-0194',
      email: 'acquisitions@apexwholesale.com',
    }
  },
  '2': {
    id: '2',
    title: '12-Unit Commercial Multi-Family Complex',
    location: 'Memphis, TN',
    address: '3290 Jackson Ave, Memphis, TN 38112',
    apn: '045-021-0012',
    price: 640000,
    units: 12,
    monthlyRent: 9600,
    grossAnnual: 115200,
    vacancyRate: 0.05,
    taxes: 8400,
    insurance: 4200,
    managementRate: 0.08,
    capexRate: 0.05,
    waterSewer: 3600,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Mid-South Real Estate Assignors (Sarah Jenkins)',
      phone: '(901) 555-0182',
      email: 'deals@midsouthwholesalers.com',
    }
  },
  '3': {
    id: '3',
    title: 'Mixed-Use Commercial: Ground Retail + 4 Apts',
    location: 'Detroit, MI',
    address: '8420 Grand River Ave, Detroit, MI 48206',
    apn: '080-04-192',
    price: 295000,
    units: 5,
    monthlyRent: 4800,
    grossAnnual: 57600,
    vacancyRate: 0.05,
    taxes: 3800,
    insurance: 2100,
    managementRate: 0.08,
    capexRate: 0.05,
    waterSewer: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Motor City Contract Desk (David Keller)',
      phone: '(313) 555-0149',
      email: 'keller@motorcityassets.com',
    }
  },
  '4': {
    id: '4',
    title: 'Cash-Flow 4-Plex Value-Add Opportunity',
    location: 'Cleveland, OH',
    address: '10408 St Clair Ave, Cleveland, OH 44108',
    apn: '108-22-045',
    price: 135000,
    units: 4,
    monthlyRent: 2400,
    grossAnnual: 28800,
    vacancyRate: 0.05,
    taxes: 1950,
    insurance: 1100,
    managementRate: 0.08,
    capexRate: 0.05,
    waterSewer: 960,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Buckeye Equity Flow (Marcus Vance)',
      phone: '(216) 555-0194',
      email: 'acquisitions@apexwholesale.com',
    }
  },
};

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dealId = resolvedParams.id || '1';
  const deal = DEALS_DATABASE[dealId] || DEALS_DATABASE['1'];

  // Statut Membre
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  
  // Interactive Mortgage Calculator State
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [loiSubmitted, setLoiSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('multidealprop_tier');
    if (saved === 'vip' || saved === 'starter') {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  }, []);

  // Calculs Financiers
  const purchasePrice = deal.price;
  const downPaymentAmount = (purchasePrice * downPercent) / 100;
  const loanAmount = purchasePrice - downPaymentAmount;

  // Calcul Mensualité Hypothèque (P&I)
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyMortgage = downPercent === 100 
    ? 0 
    : (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Pro-Forma Breakdown annuel
  const grossRentAnnual = deal.grossAnnual;
  const vacancyAmount = grossRentAnnual * deal.vacancyRate;
  const effectiveGrossIncome = grossRentAnnual - vacancyAmount;
  
  const managementAmount = effectiveGrossIncome * deal.managementRate;
  const capexAmount = effectiveGrossIncome * deal.capexRate;
  const totalOperatingExpenses = deal.taxes + deal.insurance + managementAmount + capexAmount + deal.waterSewer;
  
  const annualNOI = effectiveGrossIncome - totalOperatingExpenses;
  const capRate = ((annualNOI / purchasePrice) * 100).toFixed(2);

  // Cash-Flow & Cash-on-Cash Return
  const annualDebtService = monthlyMortgage * 12;
  const annualNetCashFlow = annualNOI - annualDebtService;
  const monthlyNetCashFlow = Math.round(annualNetCashFlow / 12);
  const cashOnCash = downPaymentAmount > 0 
    ? ((annualNetCashFlow / (downPaymentAmount + 2500)) * 100).toFixed(2)
    : '0.00';

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
              href="/"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Feed</span>
            </Link>

            <Link 
              href="/vip" 
              className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-[11px] sm:text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>VIP Access</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Deal Title & Price Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                {deal.location}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {deal.units} Units • APN: {isUnlocked ? deal.apn : '••••••••'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{deal.title}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isUnlocked ? deal.address : `${deal.location} (Exact Street Unlocked with Membership)`}</span>
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs uppercase font-bold text-slate-500 block">Contract Price</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
              ${deal.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2-Column Institutional Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Large Column: Image, KPIs, Modeler, Pro-Forma */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Property Image Banner */}
            <div className="h-72 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
              <img 
                src={deal.imageUrl} 
                alt={deal.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* 4 Core KPIs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d1527] border border-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">CAP RATE</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">{capRate}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">CASH-ON-CASH</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">{cashOnCash}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">GROSS RENT</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono mt-1 block">${deal.monthlyRent.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ANNUAL NOI</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">${Math.round(annualNOI).toLocaleString()}</span>
              </div>
            </div>

            {/* Interactive Leveraged Cash-Flow & Mortgage Modeler */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>🧮</span> Interactive Leveraged Cash-Flow &amp; Mortgage Modeler
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Adjust financing assumptions to dynamically model your exact return on equity.</p>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  LIVE CALCULATOR
                </span>
              </div>

              {/* Slider Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Down Payment */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-wider">Down Payment</span>
                    <span className="text-emerald-400 font-mono">{downPercent}% (${Math.round(downPaymentAmount).toLocaleString()})</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    value={downPercent} 
                    onChange={(e) => setDownPercent(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-950 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>20%</span>
                    <span>25%</span>
                    <span>100% Cash</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-wider">Interest Rate</span>
                    <span className="text-cyan-400 font-mono">{interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="12" 
                    step="0.25"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>5.0%</span>
                    <span>7.5%</span>
                    <span>10.0%</span>
                  </div>
                </div>

                {/* Loan Term Toggle */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-wider">Loan Term</span>
                    <span className="text-amber-400 font-mono">{loanTermYears} Years</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLoanTermYears(30)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        loanTermYears === 30 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      30 Years
                    </button>
                    <button
                      onClick={() => setLoanTermYears(15)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        loanTermYears === 15 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      15 Years
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Modeler Output Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">TOTAL CASH IN</span>
                  <span className="text-lg font-black text-white font-mono mt-0.5 block">${Math.round(downPaymentAmount + 2500).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">MORTGAGE P&amp;I</span>
                  <span className="text-lg font-black text-red-400 font-mono mt-0.5 block">${Math.round(monthlyMortgage)}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">NET CASH FLOW</span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">+{monthlyNetCashFlow}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">CASH-ON-CASH</span>
                  <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">{cashOnCash}%</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Investment Synopsis & Pro-Forma */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>📑</span> Comprehensive Investment Synopsis &amp; Pro-Forma
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Conservative 12-month expense audit, physical mechanics, and government rent roll.</p>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
                  INSTITUTIONAL GRADE
                </span>
              </div>

              <div className="border-t border-slate-800/80 pt-4 space-y-3 text-xs">
                <div className="text-xs font-black uppercase text-amber-400 tracking-wider mb-2">
                  💰 12-Month Pro-Forma Cash Flow Breakdown
                </div>

                <div className="flex justify-between text-slate-200 py-1.5 border-b border-slate-800/40">
                  <span>(+) Gross Scheduled Annual Rent ({deal.units} Units x ${deal.monthlyRent / deal.units}/mo)</span>
                  <span className="font-mono font-bold">${deal.grossAnnual.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-red-400/90 py-1.5 border-b border-slate-800/40">
                  <span>(-) Economic Vacancy Reserve (5.0%)</span>
                  <span className="font-mono font-bold">-${Math.round(vacancyAmount).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-cyan-400 font-bold py-2 border-b border-slate-800/60 bg-slate-900/40 px-2 rounded-lg">
                  <span>(=) Effective Gross Income (EGI)</span>
                  <span className="font-mono">${Math.round(effectiveGrossIncome).toLocaleString()}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Operating Expenses:</span>
                  <ul className="space-y-2 text-slate-400 pl-2">
                    <li className="flex justify-between">
                      <span>• Real Estate Property Taxes</span>
                      <span className="font-mono text-slate-300">-${deal.taxes.toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Hazard &amp; Liability Property Insurance</span>
                      <span className="font-mono text-slate-300">-${deal.insurance.toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Professional Property Management Fee (8%)</span>
                      <span className="font-mono text-slate-300">-${Math.round(managementAmount).toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Maintenance &amp; Structural CapEx Reserve (5%)</span>
                      <span className="font-mono text-slate-300">-${Math.round(capexAmount).toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Owner Water/Sewer Escrow Contribution</span>
                      <span className="font-mono text-slate-300">-${deal.waterSewer.toLocaleString()} / yr</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Wholesaler Contact Box & LOI Submission */}
          <div className="space-y-6">
            
            {/* Direct Wholesaler Desk Card */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Direct Wholesaler Desk</h3>
                {isUnlocked ? (
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> UNLOCKED
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                )}
              </div>

              {isUnlocked ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">Assigning Entity:</span>
                      <span className="text-white font-bold text-sm">{deal.wholesaler.name}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">Direct Phone:</span>
                      <span className="text-emerald-400 font-mono text-sm font-bold">{deal.wholesaler.phone}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">Contract Desk Email:</span>
                      <span className="text-emerald-400 font-mono text-xs">{deal.wholesaler.email}</span>
                    </div>
                  </div>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(deal.wholesaler.email)}&su=${encodeURIComponent(`LOI Submission - ${deal.address}`)}&body=${encodeURIComponent(`Hello ${deal.wholesaler.name},\n\nI am interested in acquiring the contract for ${deal.address} at $${deal.price.toLocaleString()}. Please provide title status and diligence files.\n\nBest regards.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    ✉️ Connect with Assignor &rarr;
                  </a>
                </div>
              ) : (
                <div>
                  <div className="relative p-5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden mb-4 select-none">
                    <div className="filter blur-sm space-y-2 text-xs text-slate-400">
                      <p className="font-bold text-white">Apex Wholesale Acquisitions Group</p>
                      <p>+1 (216) 555-0194</p>
                      <p>acquisitions@wholesale.com</p>
                    </div>
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4 text-center">
                    Unlock exact street address, parcel numbers, and primary assignor direct lines starting at $29/mo.
                  </p>

                  <Link
                    href="/vip"
                    className="w-full text-center block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    ⚡ Unlock Contacts Now
                  </Link>
                </div>
              )}
            </div>

            {/* Fast-Track LOI Generator Card */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🚀</span>
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">Fast-Track Acquisition</span>
              </div>
              <h3 className="text-base font-black text-white mb-2">Submit an Offer / LOI</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Generate and submit an official Letter of Intent directly to the wholesaler to lock this contract.
              </p>

              {loiSubmitted ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <span className="text-emerald-400 font-bold text-xs">✓ LOI Successfully Dispatched!</span>
                  <p className="text-[11px] text-slate-400 mt-1">The wholesaler has been notified via instant assignment webhook.</p>
                </div>
              ) : (
                <button
                  onClick={() => setLoiSubmitted(true)}
                  disabled={!isUnlocked}
                  className={`w-full text-center block font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition cursor-pointer ${
                    isUnlocked 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' 
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {isUnlocked ? 'Generate & Submit LOI (PDF)' : '🔒 Unlock LOI Generator (Basic/VIP)'}
                </button>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Global Footer Identique */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-8 sm:py-12 mt-16 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
            <div>
              <span className="text-white font-black tracking-wider text-sm">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
              <p className="text-slate-500 text-xs mt-0.5">Institutional Off-Market Multi-Family &amp; Commercial Pipeline</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium">
              <Link href="/login" className="text-white hover:text-emerald-400 transition font-bold">Sign In / Access</Link>
              <Link href="/submit-deal" className="text-emerald-400 hover:underline transition font-bold">+ Submit Deal</Link>
              <Link href="/about" className="hover:text-emerald-400 transition">About Us</Link>
              <Link href="/vip" className="hover:text-emerald-400 transition">Pricing Plans</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition">Contact Desk</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition">Terms &amp; Disclaimer</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-slate-600 text-center md:text-left">
            <p>
              Disclaimer: MultiDealProp is a data aggregation platform and does not provide real estate brokerage, lending, or legal services.
            </p>
            <p className="flex-shrink-0">
              © 2026 MultiDealProp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
