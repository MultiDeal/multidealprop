'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Zap, 
  ArrowLeft,
  Lock,
  Unlock,
  Calculator,
  FileSpreadsheet,
  Coins,
  TrendingUp,
  Sliders,
  Printer,
  Flame,
  CheckCircle2,
  Wrench,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download
} from 'lucide-react';

export default function UniversalDealAnalyzerPage() {
  // Statut de paiement du rapport PDF
  const [isMemoUnlocked, setIsMemoUnlocked] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Informations générales du bien
  const [propertyTitle, setPropertyTitle] = useState<string>('Turnkey Cleveland Duplex (Sample)');
  const [propertyAddress, setPropertyAddress] = useState<string>('1428 E 120th St, Cleveland, OH 44106');
  const [unitsCount, setUnitsCount] = useState<number>(2);
  const [yearBuilt, setYearBuilt] = useState<string>('1924 (Updated 2021)');

  // Stratégie
  const [strategy, setStrategy] = useState<'BUY_HOLD' | 'BRRRR' | 'FLIP'>('BUY_HOLD');

  // Financement & Achat
  const [purchasePrice, setPurchasePrice] = useState<number>(98000);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestOnlyYears, setInterestOnlyYears] = useState<number>(0);
  const [closingCostPercent, setClosingCostPercent] = useState<number>(2.5);
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

  // Vérification de retour Stripe
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

  // --- CALCULS FINANCIERS ---
  const downPaymentAmount = (purchasePrice * downPercent) / 100;
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCostsAmount = (loanAmount * closingCostPercent) / 100;
  const totalCashInvested = downPaymentAmount + closingCostsAmount + rehabBudget;

  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const isCurrentlyIO = interestOnlyYears > 0;
  const monthlyMortgage = (downPercent === 100 || loanAmount <= 0) 
    ? 0 
    : isCurrentlyIO
      ? loanAmount * monthlyInterestRate
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

  const futureAnnualNOI = annualNOI * Math.pow(1 + (annualRentGrowth / 100), holdingPeriodYears);
  const projectedExitSalePrice = exitCapRate > 0 ? Math.round(futureAnnualNOI / (exitCapRate / 100)) : purchasePrice;

  const amortizationSchedule: Array<{
    year: number;
    remainingBalance: number;
    principalPaid: number;
    interestPaid: number;
    propertyValue: number;
    equity: number;
  }> = [];

  let currentBalance = loanAmount;
  let runningPropertyValue = purchasePrice + rehabBudget;

  for (let y = 1; y <= Math.min(30, loanTermYears); y++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) break;
      const mInterest = currentBalance * monthlyInterestRate;
      const mPrincipal = (y <= interestOnlyYears) ? 0 : Math.min(currentBalance, monthlyMortgage - mInterest);
      yearInterest += mInterest;
      yearPrincipal += mPrincipal;
      currentBalance = Math.max(0, currentBalance - mPrincipal);
    }

    runningPropertyValue = runningPropertyValue * (1 + (annualAppreciation / 100));

    amortizationSchedule.push({
      year: y,
      remainingBalance: Math.round(currentBalance),
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      propertyValue: Math.round(runningPropertyValue),
      equity: Math.round(runningPropertyValue - currentBalance)
    });
  }

  const exitYearData = amortizationSchedule[Math.min(holdingPeriodYears - 1, amortizationSchedule.length - 1)] || amortizationSchedule[0];
  const netProceedsAtSale = projectedExitSalePrice - (projectedExitSalePrice * 0.06) - (exitYearData?.remainingBalance || 0);
  const totalCumulativeCashFlow = Math.round(annualNetCashFlow * holdingPeriodYears);
  const totalReturnDollars = netProceedsAtSale + totalCumulativeCashFlow;
  const equityMultiple = totalCashInvested > 0 ? (totalReturnDollars / totalCashInvested).toFixed(2) : '0.00';
  
  const estimatedIRR = totalCashInvested > 0 
    ? ((Math.pow(Math.max(0.1, totalReturnDollars / totalCashInvested), 1 / holdingPeriodYears) - 1) * 100).toFixed(1)
    : '0.0';

  // BRRRR
  const brrrrARV = estimatedARV || purchasePrice * 1.35;
  const brrrrRefinanceLoan = brrrrARV * 0.75;
  const brrrrCashLeftInDeal = Math.max(0, (purchasePrice + rehabBudget + closingCostsAmount) - brrrrRefinanceLoan);

  // Déclenchement Paiement Stripe à 9,99 $
  const handleStripeCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const res = await fetch('/api/checkout-memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealAddress: propertyAddress,
          returnUrl: window.location.href,
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
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col justify-between">
      
      {/* Header Navigation */}
      <header className="border-b border-slate-800 bg-[#06080F]/95 backdrop-blur sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-black font-black text-xs">
              MP
            </div>
            <span className="font-black text-sm sm:text-lg tracking-wider text-white">
              MULTIDEAL<span className="text-emerald-400">PROP</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">
              Universal Multi-Family Underwriting Engine
            </span>
            {isMemoUnlocked ? (
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" /> Lender Memo Unlocked
              </span>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition"
              >
                {isCheckingOut ? 'Loading...' : 'Get Lender Memo ($9.99)'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Entête Éditable de la Propriété */}
        <div className="bg-slate-900/40 p-5 sm:p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 w-full">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 inline-block mb-2">
              Custom Underwriting Workspace
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="Deal Title (e.g. 4-Plex Value-Add)"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-emerald-400"
              />
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Property Address (e.g. Cleveland, OH)"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-400"
              />
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-bold">
              <span>Units:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={unitsCount}
                onChange={(e) => setUnitsCount(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-white font-mono text-center"
              />
              <span>• Built:</span>
              <input
                type="text"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="w-32 bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-white text-xs"
              />
            </div>
          </div>

          <div className="text-left md:text-right bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Acquisition Basis</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ${(purchasePrice + rehabBudget).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
              ${Math.round((purchasePrice + rehabBudget) / unitsCount).toLocaleString()} / door
            </span>
          </div>
        </div>

        {/* Stratégie & Bouton Export PDF */}
        <div className="bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Select Underwriting Model:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStrategyChange('BUY_HOLD')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'BUY_HOLD'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">Buy &amp; Hold</span>
              </button>

              <button
                onClick={() => handleStrategyChange('BRRRR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'BRRRR'
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="truncate">BRRRR Method</span>
              </button>

              <button
                onClick={() => handleStrategyChange('FLIP')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'FLIP'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span className="truncate">Fix &amp; Flip</span>
              </button>
            </div>
          </div>

          <div className="md:border-l md:border-slate-800 md:pl-4 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              Official Diligence Memo:
            </span>
            {isMemoUnlocked ? (
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Official Memo (PDF)</span>
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlock Lender PDF ($9.99)</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d1527] border border-emerald-500/30 p-4 sm:p-5 rounded-2xl text-center shadow-xl">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-300 block tracking-wider">CAP RATE</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">{capRate}%</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-300 block tracking-wider">CASH-ON-CASH</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 block">{cashOnCash}%</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-300 block tracking-wider">NET CASH FLOW</span>
            <span className={`text-xl sm:text-2xl font-black font-mono mt-1 block ${monthlyNetCashFlow >= 0 ? 'text-cyan-300' : 'text-red-400'}`}>
              {monthlyNetCashFlow >= 0 ? '+' : ''}${Math.round(monthlyNetCashFlow).toLocaleString()}/mo
            </span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-black text-slate-300 block tracking-wider">DSCR RATIO</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1 block">{dscr}x</span>
          </div>
        </div>

        {/* BRRRR Simulation Box */}
        {strategy === 'BRRRR' && (
          <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 p-5 rounded-3xl shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">BRRRR Equity &amp; Refinance Matrix</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">After Repair Value (ARV)</span>
                <input
                  type="number"
                  value={estimatedARV}
                  onChange={(e) => setEstimatedARV(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs mt-1"
                />
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Estimated Rehab</span>
                <strong className="text-amber-400 font-mono text-sm block mt-1">${rehabBudget.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">75% Refinance Cashout</span>
                <strong className="text-cyan-300 font-mono text-sm block mt-1">${Math.round(brrrrRefinanceLoan).toLocaleString()}</strong>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 block text-[9px] uppercase font-bold">Net Cash Left in Deal</span>
                <strong className="text-emerald-400 font-mono text-sm block mt-1">${Math.round(brrrrCashLeftInDeal).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Section Inputs de Financement & Dépenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Colonne Gauche : Financement & Revenus */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Coins className="w-4 h-4" /> 1. Debt Financing &amp; Income
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Contract Price ($)</label>
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
                <label className="text-slate-400 font-bold block mb-1">Amortization (Years)</label>
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
                <label className="text-slate-400 font-bold block mb-1">Total Monthly Rent ($)</label>
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

          {/* Colonne Droite : Dépenses & Escrows */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4" /> 2. Operating Expenses &amp; Escrows
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
                <label className="text-slate-400 font-bold block mb-1">CapEx Reserves (%)</label>
                <input 
                  type="number"
                  value={capexRate}
                  onChange={(e) => setCapexRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Water / Utilities ($/yr)</label>
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

        {/* Section Dépréciation Fiscale IRS 27.5 ans */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
            <span>🏛️ IRS 27.5-Year Depreciation &amp; Tax Shelter Analysis</span>
            <span className="text-[10px] text-slate-400 font-mono">Tax Bracket: {marginalTaxRate}%</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Depreciable Basis (80%)</span>
              <strong className="text-white font-mono text-sm block mt-0.5">${Math.round(buildingBasis).toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Annual Depreciation</span>
              <strong className="text-cyan-300 font-mono text-sm block mt-0.5">${Math.round(annualDepreciation).toLocaleString()} / yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Annual Tax Savings</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">${Math.round(annualTaxSaved).toLocaleString()} / yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Tax-Shield Status</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">100% Protected Cash Flow</strong>
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
              <span>View 30-Year Loan Amortization Schedule</span>
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

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-6 mt-12 text-slate-500 text-xs text-center print:hidden">
        <p>&copy; 2026 MultiDealProp. Institutional Real Estate Underwriting &amp; Financial Modeling.</p>
      </footer>

    </div>
  );
}
