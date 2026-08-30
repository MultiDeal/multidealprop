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
  FileSpreadsheet,
  Coins,
  TrendingUp,
  Percent,
  Sliders,
  DollarSign
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
    otherIncome: 50,
    grossAnnual: 15000,
    vacancyRate: 5,
    taxes: 1420,
    insurance: 850,
    managementRate: 8,
    maintenanceRate: 5,
    capexRate: 5,
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
    otherIncome: 350,
    grossAnnual: 115200,
    vacancyRate: 6,
    taxes: 8400,
    insurance: 4200,
    managementRate: 8,
    maintenanceRate: 5,
    capexRate: 5,
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
    otherIncome: 120,
    grossAnnual: 57600,
    vacancyRate: 5,
    taxes: 3800,
    insurance: 2100,
    managementRate: 8,
    maintenanceRate: 5,
    capexRate: 5,
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
    otherIncome: 80,
    grossAnnual: 28800,
    vacancyRate: 5,
    taxes: 1950,
    insurance: 1100,
    managementRate: 8,
    maintenanceRate: 5,
    capexRate: 5,
    waterSewer: 960,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Buckeye Equity Flow (Marcus Vance)',
      phone: '(216) 555-0194',
      email: 'acquisitions@apexwholesale.com',
    }
  },
  'deal-1': {
    id: 'deal-1',
    title: '18-Unit Value-Add Multifamily Portfolio',
    location: 'Cleveland, OH',
    address: '1428-1436 E 120th St, Cleveland, OH 44106',
    apn: '120-14-082',
    price: 895000,
    units: 18,
    monthlyRent: 14200,
    otherIncome: 450,
    grossAnnual: 170400,
    vacancyRate: 7,
    taxes: 11200,
    insurance: 6400,
    managementRate: 8,
    maintenanceRate: 6,
    capexRate: 5,
    waterSewer: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Marcus Vance (Midwest Wholesale Desk)',
      phone: '(216) 555-0194',
      email: 'mvance@midwestacquisitions.com',
    }
  },
  'deal-2': {
    id: 'deal-2',
    title: '24-Unit Garden Style Apartment Complex',
    location: 'Memphis, TN',
    address: '3290 Jackson Ave, Memphis, TN 38112',
    apn: '045-021-0012',
    price: 1350000,
    units: 24,
    monthlyRent: 22000,
    otherIncome: 800,
    grossAnnual: 264000,
    vacancyRate: 6,
    taxes: 18500,
    insurance: 9200,
    managementRate: 8,
    maintenanceRate: 5,
    capexRate: 5,
    waterSewer: 7400,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Sarah Jenkins (Apex Direct Assets)',
      phone: '(901) 555-0182',
      email: 'sjenkins@apexassetsgroup.com',
    }
  },
  'deal-3': {
    id: 'deal-3',
    title: '12-Unit Fully Occupied Brick Quadplexes',
    location: 'Indianapolis, IN',
    address: '2840 N Meridian St, Indianapolis, IN 46208',
    apn: '49-06-25-104-002',
    price: 720000,
    units: 12,
    monthlyRent: 11800,
    otherIncome: 300,
    grossAnnual: 141600,
    vacancyRate: 5,
    taxes: 9600,
    insurance: 4800,
    managementRate: 8,
    maintenanceRate: 5,
    capexRate: 5,
    waterSewer: 3900,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'David Keller (Circle City Holdings)',
      phone: '(317) 555-0149',
      email: 'dkeller@circlecityequity.com',
    }
  }
};

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dealId = resolvedParams.id || '1';
  const deal = DEALS_DATABASE[dealId] || DEALS_DATABASE['1'];

  // Statut Membre & Session
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [userTier, setUserTier] = useState<string | null>(null);

  // --- PARAMÈTRES MODIFIABLES DE LA MÉGA-CALCULATRICE ---
  const [purchasePrice, setPurchasePrice] = useState<number>(deal.price);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [closingCostPercent, setClosingCostPercent] = useState<number>(2.5);
  const [rehabBudget, setRehabBudget] = useState<number>(0);

  // Revenus
  const [monthlyRent, setMonthlyRent] = useState<number>(deal.monthlyRent);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(deal.otherIncome || 0);
  const [vacancyRate, setVacancyRate] = useState<number>(deal.vacancyRate || 5);

  // Dépenses d'Exploitation (Opex)
  const [annualTaxes, setAnnualTaxes] = useState<number>(deal.taxes);
  const [annualInsurance, setAnnualInsurance] = useState<number>(deal.insurance);
  const [managementRate, setManagementRate] = useState<number>(deal.managementRate || 8);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(deal.maintenanceRate || 5);
  const [capexRate, setCapexRate] = useState<number>(deal.capexRate || 5);
  const [annualUtilities, setAnnualUtilities] = useState<number>(deal.waterSewer || 0);

  const [loiSubmitted, setLoiSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('multidealprop_tier');
    if (saved === 'vip' || saved === 'starter') {
      setIsUnlocked(true);
      setUserTier(saved);
    } else {
      setIsUnlocked(false);
      setUserTier(null);
    }
  }, []);

  // --- MOTEUR DE CALCUL MATHÉMATIQUE INSTITUTIONNEL ---
  
  // 1. Structure de Financement
  const downPaymentAmount = (purchasePrice * downPercent) / 100;
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCostsAmount = (loanAmount * closingCostPercent) / 100;
  const totalCashInvested = downPaymentAmount + closingCostsAmount + rehabBudget;

  // Calcul Mensualité Hypothèque (P&I)
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyMortgage = (downPercent === 100 || loanAmount <= 0) 
    ? 0 
    : (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  const annualDebtService = monthlyMortgage * 12;

  // 2. Revenus d'Exploitation
  const grossScheduledAnnualRent = (monthlyRent + otherMonthlyIncome) * 12;
  const annualVacancyLoss = (grossScheduledAnnualRent * vacancyRate) / 100;
  const effectiveGrossIncome = grossScheduledAnnualRent - annualVacancyLoss;

  // 3. Dépenses d'Exploitation (Opex)
  const annualManagementFee = (effectiveGrossIncome * managementRate) / 100;
  const annualMaintenance = (effectiveGrossIncome * maintenanceRate) / 100;
  const annualCapex = (effectiveGrossIncome * capexRate) / 100;
  
  const totalOperatingExpenses = annualTaxes + annualInsurance + annualManagementFee + annualMaintenance + annualCapex + annualUtilities;
  const monthlyOperatingExpenses = totalOperatingExpenses / 12;

  // 4. Métriques de Rendement
  const annualNOI = effectiveGrossIncome - totalOperatingExpenses;
  const monthlyNOI = annualNOI / 12;
  const capRate = purchasePrice > 0 ? ((annualNOI / purchasePrice) * 100).toFixed(2) : '0.00';

  const annualNetCashFlow = annualNOI - annualDebtService;
  const monthlyNetCashFlow = annualNetCashFlow / 12;

  const cashOnCash = totalCashInvested > 0 
    ? ((annualNetCashFlow / totalCashInvested) * 100).toFixed(2) 
    : '0.00';

  const dscr = annualDebtService > 0 ? (annualNOI / annualDebtService).toFixed(2) : 'N/A';

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800 bg-[#06080F]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <Link href={userTier ? '/deals' : '/'} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-sm sm:text-lg tracking-wider text-white">
              MULTIDEAL<span className="text-emerald-400">PROP</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link 
              href={userTier ? '/deals' : '/'}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Feed</span>
            </Link>

            {!userTier && (
              <Link 
                href="/vip" 
                className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-[11px] sm:text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Unlock Contacts</span>
              </Link>
            )}
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
            <span className="text-xs uppercase font-bold text-slate-500 block">Underwritten Price</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
              ${purchasePrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2-Column Institutional Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Large Column: Image, KPIs, Mega-Calculateur, Pro-Forma */}
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
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">NET CASH FLOW</span>
                <span className={`text-xl sm:text-2xl font-black font-mono mt-1 block ${monthlyNetCashFlow >= 0 ? 'text-cyan-300' : 'text-red-400'}`}>
                  ${Math.round(monthlyNetCashFlow).toLocaleString()}/mo
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">ANNUAL NOI</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">${Math.round(annualNOI).toLocaleString()}</span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* MEGA CALCULATRICE HYPOTHÉCAIRE & SOUSCRIPTION COMPLETE    */}
            {/* ========================================================= */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <span>Mega Interactive Underwriting &amp; Mortgage Engine</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ajustez chaque levier financier, taxe et réserve d'exploitation pour modéliser le rendement exact.
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                  INSTITUTIONAL MATRIX
                </span>
              </div>

              {/* SECTION 1 : FINANCEMENT & CRÉDIT HYPOTHÉCAIRE */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>1. Debt Financing &amp; Capital Structure</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs">
                  
                  {/* Purchase Price */}
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Purchase Price ($)</label>
                    <input 
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400 outline-none"
                    />
                  </div>

                  {/* Down Payment % */}
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-400">Down Payment ({downPercent}%)</span>
                      <span className="text-emerald-400 font-mono">${Math.round(downPaymentAmount).toLocaleString()}</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={downPercent}
                      onChange={(e) => setDownPercent(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-900 rounded-lg cursor-pointer h-2 mt-2"
                    />
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-400">Interest Rate (%)</span>
                      <span className="text-cyan-400 font-mono">{interestRate}%</span>
                    </div>
                    <input 
                      type="number"
                      step="0.125"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-cyan-400 outline-none"
                    />
                  </div>

                  {/* Loan Term */}
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Loan Term</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[15, 25, 30].map(term => (
                        <button
                          key={term}
                          onClick={() => setLoanTermYears(term)}
                          className={`py-2 rounded-lg font-bold transition text-[11px] ${
                            loanTermYears === term 
                              ? 'bg-emerald-500 text-black shadow-md' 
                              : 'bg-slate-900 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {term} Yrs
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Closing Costs */}
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Closing &amp; Title Points (%)</label>
                    <input 
                      type="number"
                      step="0.5"
                      value={closingCostPercent}
                      onChange={(e) => setClosingCostPercent(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400 outline-none"
                    />
                  </div>

                  {/* Rehab Budget */}
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Initial CapEx / Rehab ($)</label>
                    <input 
                      type="number"
                      step="500"
                      value={rehabBudget}
                      onChange={(e) => setRehabBudget(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-400 outline-none"
                    />
                  </div>

                </div>
              </div>

              {/* SECTION 2 : REVENUS LOCATIFS & VACANCE */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>2. Rental Income &amp; Economic Vacancy</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Total Scheduled Monthly Rent ($)</label>
                    <input 
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:border-emerald-400 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Ancillary Monthly Income (Laundry/Storage)</label>
                    <input 
                      type="number"
                      value={otherMonthlyIncome}
                      onChange={(e) => setOtherMonthlyIncome(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-400">Vacancy Reserve ({vacancyRate}%)</span>
                      <span className="text-red-400 font-mono">-${Math.round(annualVacancyLoss / 12)}/mo</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="15"
                      step="1"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                      className="w-full accent-red-400 bg-slate-900 rounded-lg cursor-pointer h-2 mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3 : DÉPENSES D'EXPLOITATION (OPEX) ET TAXES */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>3. Operating Expenses (Opex) &amp; Municipal Escrows</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Property Taxes ($/yr)</label>
                    <input 
                      type="number"
                      value={annualTaxes}
                      onChange={(e) => setAnnualTaxes(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Hazard Insurance ($/yr)</label>
                    <input 
                      type="number"
                      value={annualInsurance}
                      onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Property Management (%)</label>
                    <input 
                      type="number"
                      value={managementRate}
                      onChange={(e) => setManagementRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Maintenance Reserve (%)</label>
                    <input 
                      type="number"
                      value={maintenanceRate}
                      onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">CapEx Reserve (%)</label>
                    <input 
                      type="number"
                      value={capexRate}
                      onChange={(e) => setCapexRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Water/Sewer Escrow ($/yr)</label>
                    <input 
                      type="number"
                      value={annualUtilities}
                      onChange={(e) => setAnnualUtilities(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* RÉSULTATS EXÉCUTIFS & TABLEAU DE SOUSCRIPTION */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 flex items-center justify-between">
                  <span>📊 Executive Underwriting Breakdown</span>
                  <span className="font-mono text-[10px] text-slate-400">Total Capital Required: ${Math.round(totalCashInvested).toLocaleString()}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Mortgage P&amp;I</span>
                    <strong className="text-red-400 text-sm sm:text-base font-mono block mt-0.5">-${Math.round(monthlyMortgage)}/mo</strong>
                    <span className="text-[9px] text-slate-500 font-mono">Loan: ${Math.round(loanAmount).toLocaleString()}</span>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Effective Gross Income</span>
                    <strong className="text-cyan-300 text-sm sm:text-base font-mono block mt-0.5">${Math.round(effectiveGrossIncome / 12).toLocaleString()}/mo</strong>
                    <span className="text-[9px] text-slate-500 font-mono">${Math.round(effectiveGrossIncome).toLocaleString()}/yr</span>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Operating Expenses</span>
                    <strong className="text-slate-300 text-sm sm:text-base font-mono block mt-0.5">-${Math.round(monthlyOperatingExpenses).toLocaleString()}/mo</strong>
                    <span className="text-[9px] text-slate-500 font-mono">${Math.round(totalOperatingExpenses).toLocaleString()}/yr</span>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                    <span className="text-emerald-400 block text-[10px] uppercase font-bold">Net Free Cash Flow</span>
                    <strong className="text-emerald-400 text-sm sm:text-base font-mono block mt-0.5">+${Math.round(monthlyNetCashFlow).toLocaleString()}/mo</strong>
                    <span className="text-[9px] text-emerald-300 font-mono">DSCR: {dscr}x</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Comprehensive Investment Synopsis & Pro-Forma */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                    <span>Comprehensive 12-Month Pro-Forma Statement</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Audit des dépenses, flux de trésorerie net et ratios de rentabilité.</p>
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
                  <span>(+) Gross Scheduled Annual Rent ({deal.units} Units)</span>
                  <span className="font-mono font-bold">${grossScheduledAnnualRent.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-red-400/90 py-1.5 border-b border-slate-800/40">
                  <span>(-) Economic Vacancy Reserve ({vacancyRate}%)</span>
                  <span className="font-mono font-bold">-${Math.round(annualVacancyLoss).toLocaleString()}</span>
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
                      <span className="font-mono text-slate-300">-${annualTaxes.toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Hazard &amp; Liability Property Insurance</span>
                      <span className="font-mono text-slate-300">-${annualInsurance.toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Professional Property Management Fee ({managementRate}%)</span>
                      <span className="font-mono text-slate-300">-${Math.round(annualManagementFee).toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Maintenance &amp; Structural CapEx Reserve ({maintenanceRate + capexRate}%)</span>
                      <span className="font-mono text-slate-300">-${Math.round(annualMaintenance + annualCapex).toLocaleString()} / yr</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• Owner Water/Sewer Escrow Contribution</span>
                      <span className="font-mono text-slate-300">-${annualUtilities.toLocaleString()} / yr</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between text-emerald-400 font-black py-2.5 border-t border-slate-700/80 bg-emerald-500/10 px-3 rounded-xl mt-4 text-sm">
                  <span>(=) Net Operating Income (NOI)</span>
                  <span className="font-mono">${Math.round(annualNOI).toLocaleString()} / yr</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Wholesaler Contact Box & LOI Submission */}
          <div className="space-y-6">
            
            {/* Direct Wholesaler Desk Card */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-20">
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
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(deal.wholesaler.email)}&su=${encodeURIComponent(`LOI Submission - ${deal.address}`)}&body=${encodeURIComponent(`Hello ${deal.wholesaler.name},\n\nI am interested in acquiring the contract for ${deal.address} at $${purchasePrice.toLocaleString()} ($${Math.round(downPaymentAmount).toLocaleString()} down). Please provide title status and diligence files.\n\nBest regards.`)}`}
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
                Generate and submit an official Letter of Intent directly to the wholesaler based on your customized underwriting parameters.
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
              <Link href={userTier ? '/deals' : '/login'} className="text-white hover:text-emerald-400 transition font-bold">
                {userTier ? `My Desk (${userTier.toUpperCase()})` : 'Sign In / Access'}
              </Link>
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
              © {new Date().getFullYear()} MultiDealProp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
