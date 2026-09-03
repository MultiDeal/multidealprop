'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Sliders, 
  Coins, 
  Flame, 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Zap, 
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomePage() {
  const [isMemoUnlocked, setIsMemoUnlocked] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [recentDeals, setRecentDeals] = useState<any[]>([]);

  // Propriété analysée en direct
  const [propertyTitle, setPropertyTitle] = useState<string>('Turnkey Cleveland Duplex (Live Sample)');
  const [propertyAddress, setPropertyAddress] = useState<string>('1428 E 120th St, Cleveland, OH 44106');
  const [unitsCount, setUnitsCount] = useState<number>(2);
  const [yearBuilt, setYearBuilt] = useState<string>('1924 (Renovated)');

  // Stratégie
  const [strategy, setStrategy] = useState<'BUY_HOLD' | 'BRRRR' | 'FLIP'>('BUY_HOLD');

  // Financement & Achat
  const [purchasePrice, setPurchasePrice] = useState<number>(98000);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [rehabBudget, setRehabBudget] = useState<number>(0);
  const [estimatedARV, setEstimatedARV] = useState<number>(145000);

  // Revenus
  const [monthlyRent, setMonthlyRent] = useState<number>(1950);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(50);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // Dépenses annuelles
  const [annualTaxes, setAnnualTaxes] = useState<number>(1420);
  const [annualInsurance, setAnnualInsurance] = useState<number>(850);
  const [managementRate, setManagementRate] = useState<number>(8);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(5);
  const [capexRate, setCapexRate] = useState<number>(5);
  const [annualUtilities, setAnnualUtilities] = useState<number>(780);

  // Projections
  const [holdingPeriodYears, setHoldingPeriodYears] = useState<number>(5);
  const [exitCapRate, setExitCapRate] = useState<number>(7.5);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(3.0);
  const [annualRentGrowth, setAnnualRentGrowth] = useState<number>(2.5);
  const [marginalTaxRate] = useState<number>(28);

  const [showAmortizationTable, setShowAmortizationTable] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('memo_paid') === 'true') {
      setIsMemoUnlocked(true);
      localStorage.setItem('multideal_memo_unlocked', 'true');
    } else if (localStorage.getItem('multideal_memo_unlocked') === 'true') {
      setIsMemoUnlocked(true);
    }

    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        if (!error && data && data.length > 0) {
          setRecentDeals(data);
        }
      } catch (e) {
        console.error('Error fetching deals', e);
      }
    }
    fetchDeals();
  }, []);

  const handleStrategyChange = (newStrategy: 'BUY_HOLD' | 'BRRRR' | 'FLIP') => {
    setStrategy(newStrategy);
    if (newStrategy === 'BUY_HOLD') setRehabBudget(0);
    if (newStrategy === 'BRRRR') setRehabBudget(30000);
    if (newStrategy === 'FLIP') setRehabBudget(40000);
  };

  const loadDealIntoAnalyzer = (deal: any) => {
    setPropertyTitle(deal.title || 'Multi-Family Deal');
    setPropertyAddress(deal.formatted_address || deal.address || 'Address on file');
    setUnitsCount(Number(deal.units) || 2);
    setPurchasePrice(Number(deal.price) || 90000);
    setMonthlyRent(Number(deal.monthly_rent) || 1600);
    setEstimatedARV(Number(deal.arv) || Math.round(Number(deal.price) * 1.35));
    if (deal.taxes) setAnnualTaxes(Number(deal.taxes));
    if (deal.insurance) setAnnualInsurance(Number(deal.insurance));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // --- CALCULS FINANCIERS ---
  const downPaymentAmount = (purchasePrice * downPercent) / 100;
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCostsAmount = loanAmount * 0.025;
  const totalCashInvested = downPaymentAmount + closingCostsAmount + rehabBudget;

  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const monthlyMortgage = (downPercent === 100 || loanAmount <= 0) 
    ? 0 
    : (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  const annualDebtService = monthlyMortgage * 12;

  const grossScheduledAnnualRent = (monthlyRent + otherMonthlyIncome) * 12;
  const annualVacancyLoss = (grossScheduledAnnualRent * vacancyRate) / 100;
  const effectiveGrossIncome = grossScheduledAnnualRent - annualVacancyLoss;

  const annualManagementFee = (effectiveGrossIncome * managementRate) / 100;
  const annualMaintenance = (effectiveGrossIncome * maintenanceRate) / 100;
  const annualCapex = (effectiveGrossIncome * capexRate) / 100;
  const totalOperatingExpenses = annualTaxes + annualInsurance + annualManagementFee + annualMaintenance + annualCapex + annualUtilities;

  const annualNOI = effectiveGrossIncome - totalOperatingExpenses;
  const capRate = purchasePrice > 0 ? ((annualNOI / purchasePrice) * 100).toFixed(2) : '0.00';

  const annualNetCashFlow = annualNOI - annualDebtService;
  const monthlyNetCashFlow = annualNetCashFlow / 12;

  const cashOnCash = totalCashInvested > 0 
    ? ((annualNetCashFlow / totalCashInvested) * 100).toFixed(2) 
    : '0.00';

  const dscr = annualDebtService > 0 ? (annualNOI / annualDebtService).toFixed(2) : 'N/A';

  const totalFixedCostsAnnual = totalOperatingExpenses + annualDebtService;
  const breakEvenOccupancy = grossScheduledAnnualRent > 0 
    ? Math.min(100, Math.round((totalFixedCostsAnnual / grossScheduledAnnualRent) * 100))
    : 0;

  const buildingBasis = (purchasePrice + rehabBudget) * 0.80;
  const annualDepreciation = buildingBasis / 27.5;
  const annualTaxSaved = annualDepreciation * (marginalTaxRate / 100);

  // BRRRR
  const brrrrARV = estimatedARV || purchasePrice * 1.35;
  const brrrrRefinanceLoan = brrrrARV * 0.75;
  const brrrrCashLeftInDeal = Math.max(0, (purchasePrice + rehabBudget + closingCostsAmount) - brrrrRefinanceLoan);

  // Amortissement 30 ans
  const amortizationSchedule = [];
  let currentBalance = loanAmount;
  let runningVal = purchasePrice + rehabBudget;
  for (let y = 1; y <= Math.min(30, loanTermYears); y++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) break;
      const mInterest = currentBalance * monthlyInterestRate;
      const mPrincipal = Math.min(currentBalance, monthlyMortgage - mInterest);
      yearInterest += mInterest;
      yearPrincipal += mPrincipal;
      currentBalance = Math.max(0, currentBalance - mPrincipal);
    }
    runningVal = runningVal * (1 + (annualAppreciation / 100));
    amortizationSchedule.push({
      year: y,
      remainingBalance: Math.round(currentBalance),
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      propertyValue: Math.round(runningVal),
      equity: Math.round(runningVal - currentBalance)
    });
  }

  const handleStripeCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const res = await fetch('/api/checkout-memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealAddress: propertyAddress,
          returnUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#05070E]/90 backdrop-blur sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              MULTIDEAL<span className="text-emerald-400">PROP</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/submit-deal"
              className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Deal (Free)</span>
            </Link>

            {isMemoUnlocked ? (
              <button
                onClick={() => window.print()}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 hover:bg-emerald-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Print Official Memo
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isCheckingOut ? 'Loading...' : 'Lender Memo ($9.99)'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider">
          <Zap className="w-3 h-3" /> Institutional Multi-Family Underwriting Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Underwrite Any Multi-Family Deal in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Seconds</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Test any duplex, triplex, or commercial apartment building. Instant Cap Rate, DSCR covenants, BRRRR equity cashout and IRS 27.5-year tax shelter.
        </p>
      </div>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        
        {/* Propriété en cours d'analyse */}
        <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="flex-1 w-full space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Live Property Parameters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="Deal Headline"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none focus:border-emerald-400"
              />
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Property Address (e.g. Cleveland, OH)"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-400"
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
              <span>Doors:</span>
              <input
                type="number"
                min="1"
                value={unitsCount}
                onChange={(e) => setUnitsCount(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-mono text-center"
              />
              <span>Year Built:</span>
              <input
                type="text"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 w-full md:w-auto text-left md:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Investment Basis</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ${(purchasePrice + rehabBudget).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
              ${Math.round((purchasePrice + rehabBudget) / unitsCount).toLocaleString()} / door
            </span>
          </div>
        </div>

        {/* Stratégies & Action Bouton */}
        <div className="bg-[#0c1222] border-2 border-emerald-500/30 rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Underwriting Strategy Model:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStrategyChange('BUY_HOLD')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'BUY_HOLD' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Buy &amp; Hold
              </button>
              <button
                onClick={() => handleStrategyChange('BRRRR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'BRRRR' ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> BRRRR
              </button>
              <button
                onClick={() => handleStrategyChange('FLIP')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'FLIP' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Coins className="w-3.5 h-3.5" /> Fix &amp; Flip
              </button>
            </div>
          </div>

          <div className="md:border-l md:border-slate-800 md:pl-4 flex flex-col justify-center">
            {isMemoUnlocked ? (
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Official Memo (PDF)
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" /> Get Diligence Memo ($9.99)
              </button>
            )}
          </div>
        </div>

        {/* 4 Chiffres Clés */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a101f] border border-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-xl">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">CAP RATE</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{capRate}%</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">CASH-ON-CASH</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{cashOnCash}%</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">NET CASH FLOW</span>
            <span className={`text-2xl font-black font-mono mt-1 block ${monthlyNetCashFlow >= 0 ? 'text-cyan-300' : 'text-red-400'}`}>
              {monthlyNetCashFlow >= 0 ? '+' : ''}${Math.round(monthlyNetCashFlow).toLocaleString()}/mo
            </span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">DSCR RATIO</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{dscr}x</span>
          </div>
        </div>

        {/* BRRRR Simulation */}
        {strategy === 'BRRRR' && (
          <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 p-5 rounded-3xl shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">BRRRR Equity &amp; Refinance Matrix</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Estimated ARV</span>
                <input
                  type="number"
                  value={estimatedARV}
                  onChange={(e) => setEstimatedARV(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs mt-1"
                />
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Rehab Capital</span>
                <strong className="text-amber-400 font-mono text-sm block mt-1">${rehabBudget.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">75% Refi Loan</span>
                <strong className="text-cyan-300 font-mono text-sm block mt-1">${Math.round(brrrrRefinanceLoan).toLocaleString()}</strong>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 block text-[9px] uppercase font-bold">Net Cash Left in Deal</span>
                <strong className="text-emerald-400 font-mono text-sm block mt-1">${Math.round(brrrrCashLeftInDeal).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LE PREVIEW SHOWCASE INCITATIF (PAYWALL AVEC FLOU)             */}
        {/* ============================================================ */}
        <div className="bg-[#0b1222] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20 inline-block mb-2">
                Official Deliverable Preview
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                What Private Lenders &amp; Banks Receive
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Commercial real estate underwriting dossier conforming to US DSCR mortgage covenants (T-12 pro-forma audit, 30-year paydown &amp; IRS depreciation).
              </p>
            </div>

            <button
              onClick={handleStripeCheckout}
              disabled={isCheckingOut}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Deal Memo ($9.99)</span>
            </button>
          </div>

          {/* Fausse page de document PDF officiel avec flou */}
          <div className="mt-6 relative rounded-2xl border border-slate-700 bg-white text-slate-900 p-4 sm:p-8 font-sans shadow-2xl overflow-hidden">
            
            {/* Header Document blanc */}
            <div className="bg-[#0b1528] text-white p-4 rounded-xl flex justify-between items-center text-xs">
              <div>
                <div className="font-black text-sm tracking-wide">MULTIDEALPROP UNDERWRITING SUITE</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Official Institutional Lender Diligence Dossier</div>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono">
                <div>MEMO REF: <span className="text-white font-bold">MDP-2026-OH-08412</span></div>
                <div>STATUS: <span className="text-emerald-400 font-bold">PAID &amp; VERIFIED ($9.99)</span></div>
              </div>
            </div>

            {/* Rangée métriques du PDF */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 my-4 text-center">
              <div className="bg-slate-50 border border-slate-200 p-2 sm:p-3 rounded-lg">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">CAP RATE</span>
                <span className="text-sm sm:text-xl font-black text-emerald-600 font-mono">13.88%</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 sm:p-3 rounded-lg">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">DSCR RATIO</span>
                <span className="text-sm sm:text-xl font-black text-blue-700 font-mono">2.12x</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 sm:p-3 rounded-lg">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">CASH-ON-CASH</span>
                <span className="text-sm sm:text-xl font-black text-emerald-600 font-mono">33.31%</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 sm:p-3 rounded-lg">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">BREAK-EVEN</span>
                <span className="text-sm sm:text-xl font-black text-amber-600 font-mono">42.8%</span>
              </div>
            </div>

            {/* Partie T-12 Floutée (Simulée) */}
            <div className="space-y-3 select-none filter blur-[4px] opacity-60 pointer-events-none mt-4">
              <div className="h-5 bg-slate-300 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-emerald-100 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-5 bg-slate-300 rounded w-1/3 mt-3"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>

            {/* Masque Paywall par-dessus le flou */}
            <div className="absolute inset-x-0 bottom-0 top-32 sm:top-36 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2.5 shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                Complete T-12 Audit, 30-Year Paydown &amp; Sign-off Block Locked
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mt-1 mb-4">
                Export the customized, print-ready 2-page PDF memo for your lenders and equity partners.
              </p>
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-xl shadow-emerald-500/30 cursor-pointer"
              >
                {isCheckingOut ? 'Loading...' : 'Unlock & Download Full Memo ($9.99)'}
              </button>
            </div>

          </div>
        </div>

        {/* Formulaire Financement & Dépenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Coins className="w-4 h-4" /> 1. Debt &amp; Monthly Revenue
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Purchase Price ($)</label>
                <input 
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Down Payment ({downPercent}%)</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 mt-3 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Interest Rate (%)</label>
                <input 
                  type="number"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Amortization</label>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="15">15 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Gross Monthly Rent ($)</label>
                <input 
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Other Income ($/mo)</label>
                <input 
                  type="number"
                  value={otherMonthlyIncome}
                  onChange={(e) => setOtherMonthlyIncome(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4" /> 2. Operating Expenses
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Taxes ($/yr)</label>
                <input 
                  type="number"
                  value={annualTaxes}
                  onChange={(e) => setAnnualTaxes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Insurance ($/yr)</label>
                <input 
                  type="number"
                  value={annualInsurance}
                  onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Management (%)</label>
                <input 
                  type="number"
                  value={managementRate}
                  onChange={(e) => setManagementRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Maintenance (%)</label>
                <input 
                  type="number"
                  value={maintenanceRate}
                  onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">CapEx Reserve (%)</label>
                <input 
                  type="number"
                  value={capexRate}
                  onChange={(e) => setCapexRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Utilities ($/yr)</label>
                <input 
                  type="number"
                  value={annualUtilities}
                  onChange={(e) => setAnnualUtilities(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Abri Fiscal IRS 27.5 ans */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
            <span>🏛️ IRS 27.5-Year Tax Depreciation Shelter</span>
            <span className="text-[10px] text-slate-400 font-mono">Tax Bracket: {marginalTaxRate}%</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Depreciable Basis</span>
              <strong className="text-white font-mono text-sm block mt-0.5">${Math.round(buildingBasis).toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Annual Depreciation</span>
              <strong className="text-cyan-300 font-mono text-sm block mt-0.5">${Math.round(annualDepreciation).toLocaleString()} / yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Annual Tax Shelter</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">${Math.round(annualTaxSaved).toLocaleString()} / yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Cash Protection</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">100% Tax Sheltered</strong>
            </div>
          </div>
        </div>

        {/* Tableau d'Amortissement Dépliable */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowAmortizationTable(!showAmortizationTable)}
            className="w-full p-4 bg-slate-950 flex items-center justify-between text-xs font-black uppercase text-slate-300 hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>30-Year Loan Amortization Breakdown</span>
            </span>
            {showAmortizationTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAmortizationTable && (
            <div className="p-4 bg-slate-900/90 overflow-x-auto max-h-72 scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                    <th className="py-2">Year</th>
                    <th className="py-2">Principal Paid</th>
                    <th className="py-2">Interest Paid</th>
                    <th className="py-2">Remaining Loan</th>
                    <th className="py-2">Property Value</th>
                    <th className="py-2">Total Equity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {amortizationSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/50">
                      <td className="py-2 font-bold text-white">Year {row.year}</td>
                      <td className="py-2 text-emerald-400">+${row.principalPaid.toLocaleString()}</td>
                      <td className="py-2 text-red-400">-${row.interestPaid.toLocaleString()}</td>
                      <td className="py-2 text-slate-300">${row.remainingBalance.toLocaleString()}</td>
                      <td className="py-2 text-cyan-300">${row.propertyValue.toLocaleString()}</td>
                      <td className="py-2 font-bold text-emerald-300">${row.equity.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section Inventaire Soumis par les Wholesalers */}
        <div className="pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Featured Wholesaler &amp; Off-Market Deals
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Direct assignment contracts. Click to load property into the underwriter.
              </p>
            </div>
            <Link
              href="/submit-deal"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>+ Post your deal for free</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentDeals.map((deal) => (
                <div 
                  key={deal.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition flex flex-col justify-between group shadow-xl"
                >
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img 
                      src={deal.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'} 
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-black text-emerald-400">
                      {deal.units || 2} DOORS
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-xs font-mono">
                      ${Number(deal.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white line-clamp-1">{deal.title}</h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{deal.formatted_address || deal.location}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block text-[9px]">GROSS RENT</span>
                        <span className="text-white font-bold">${Number(deal.monthly_rent || 0).toLocaleString()}/mo</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">EST. ARV</span>
                        <span className="text-cyan-300 font-bold">${Number(deal.arv || deal.price * 1.3).toLocaleString()}</span>
                      </div>
                    </div>

                    {deal.wholesaler_name && (
                      <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                        <span>Rep: <strong className="text-slate-300">{deal.wholesaler_name}</strong></span>
                        <span className="font-mono text-emerald-400">{deal.wholesaler_phone}</span>
                      </div>
                    )}

                    <button
                      onClick={() => loadDealIntoAnalyzer(deal)}
                      className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-black py-2 rounded-xl transition cursor-pointer"
                    >
                      Underwrite this Deal ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-2">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Wholesaler Inventory Published Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first to list your assignment contracts or off-market multi-family plexes.
              </p>
              <Link
                href="/submit-deal"
                className="inline-block mt-2 bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                + Submit a Deal Now
              </Link>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#030508] py-8 text-center text-xs text-slate-500 print:hidden">
        <p>&copy; 2026 MultiDealProp. Institutional Underwriting &amp; Multi-Family Financial Modeling.</p>
      </footer>

    </div>
  );
}
