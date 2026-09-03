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
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const [isMemoUnlocked, setIsMemoUnlocked] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Données de la propriété
  const [propertyTitle, setPropertyTitle] = useState<string>('Turnkey Cleveland Duplex (Live Sample)');
  const [propertyAddress, setPropertyAddress] = useState<string>('1428 E 120th St, Cleveland, OH 44106');
  const [unitsCount, setUnitsCount] = useState<number>(2);
  const [yearBuilt, setYearBuilt] = useState<string>('1924 (Updated)');

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

  // Modélisation Sortie & Amortissement
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
  }, []);

  const handleStrategyChange = (newStrategy: 'BUY_HOLD' | 'BRRRR' | 'FLIP') => {
    setStrategy(newStrategy);
    if (newStrategy === 'BUY_HOLD') setRehabBudget(0);
    if (newStrategy === 'BRRRR') setRehabBudget(30000);
    if (newStrategy === 'FLIP') setRehabBudget(40000);
  };

  // Calculs financiers
  const downPaymentAmount = (purchasePrice * downPercent) / 100;
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCostsAmount = (loanAmount * 0.025);
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

  const buildingBasis = (purchasePrice + rehabBudget) * 0.80;
  const annualDepreciation = buildingBasis / 27.5;
  const annualTaxSaved = annualDepreciation * (marginalTaxRate / 100);

  // BRRRR
  const brrrrARV = estimatedARV || purchasePrice * 1.35;
  const brrrrRefinanceLoan = brrrrARV * 0.75;
  const brrrrCashLeftInDeal = Math.max(0, (purchasePrice + rehabBudget + closingCostsAmount) - brrrrRefinanceLoan);

  // Tableau d'amortissement
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
      
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-[#05070E]/90 backdrop-blur sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              MULTIDEAL<span className="text-emerald-400">PROP</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isMemoUnlocked ? (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" /> Diligence Memo Unlocked
              </span>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                {isCheckingOut ? 'Opening Checkout...' : 'Export Lender Memo ($9.99)'}
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
          Analyze Any Plex or Multi-Family Deal in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Seconds</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Test any property on the market. Pre-calculate DSCR, Cap Rate, BRRRR exit scenarios and IRS 27.5-year tax sheltering.
        </p>
      </div>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        
        {/* Barre d'édition du bien */}
        <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="flex-1 w-full space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Edit Property Parameters (Live)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="Deal Title"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none focus:border-emerald-400"
              />
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Property Address"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-400"
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
              <span>Units:</span>
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

        {/* Sélection de Stratégie & Bouton PDF */}
        <div className="bg-[#0c1222] border-2 border-emerald-500/30 rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Investment Underwriting Model
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStrategyChange('BUY_HOLD')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  strategy === 'BUY_HOLD' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Buy &amp; Hold
              </button>
              <button
                onClick={() => handleStrategyChange('BRRRR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  strategy === 'BRRRR' ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> BRRRR
              </button>
              <button
                onClick={() => handleStrategyChange('FLIP')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
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
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Lender Memo (PDF)
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
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

        {/* Calculatrice Financement & Dépenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 space-y-4">
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

          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 space-y-4">
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

        {/* Fiscale IRS 27.5 ans */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
            <span>🏛️ IRS 27.5-Year Tax Depreciation Shield</span>
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
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Estimated Tax Shield</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">${Math.round(annualTaxSaved).toLocaleString()} / yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Tax-Shield Status</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">100% Tax Protected</strong>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#030508] py-8 text-center text-xs text-slate-500 print:hidden">
        <p>&copy; 2026 MultiDealProp. Institutional Underwriting &amp; Multi-Family Financial Modeling.</p>
      </footer>

    </div>
  );
}
