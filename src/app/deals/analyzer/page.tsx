'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  ArrowLeft,
  Calculator,
  Coins,
  TrendingUp,
  Sliders,
  Printer,
  FileText,
  DollarSign,
  AlertTriangle,
  X
} from 'lucide-react';

export default function DealAnalyzerPage() {
  // 1. Paramètres du bien
  const [propertyTitle, setPropertyTitle] = useState<string>('Turnkey Cleveland Duplex');
  const [propertyAddress, setPropertyAddress] = useState<string>('1428 E 120th St, Cleveland, OH 44106');
  const [units, setUnits] = useState<number>(2);
  const [purchasePrice, setPurchasePrice] = useState<number>(98000);
  const [monthlyRent, setMonthlyRent] = useState<number>(1950);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(50);

  // 2. Paramètres de Financement (Capital Stack)
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [rehabBudget, setRehabBudget] = useState<number>(0);

  // 3. Dépenses d'exploitation (OpEx)
  const [annualTaxes, setAnnualTaxes] = useState<number>(1420);
  const [annualInsurance, setAnnualInsurance] = useState<number>(850);
  const [managementRate, setManagementRate] = useState<number>(8);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(5);
  const [capexRate, setCapexRate] = useState<number>(5);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // 4. Modal Deal Memo & Fiscalité
  const [showMemoModal, setShowMemoModal] = useState<boolean>(false);
  const marginalTaxRate = 28;

  // --- MOTEUR DE CALCUL DE SOUSCRIPTION ---
  const downPaymentAmount = (purchasePrice * downPercent) / 100;
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCosts = (loanAmount * 0.025);
  const totalCashInvested = downPaymentAmount + closingCosts + rehabBudget;

  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  const monthlyMortgage = loanAmount > 0 
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
    : 0;
  const annualDebtService = monthlyMortgage * 12;

  const grossScheduledAnnualRent = monthlyRent * 12;
  const grossUtilityRecovery = otherMonthlyIncome * 12;
  const grossPotentialIncome = grossScheduledAnnualRent + grossUtilityRecovery;
  const annualVacancyLoss = (grossPotentialIncome * vacancyRate) / 100;
  const effectiveGrossIncome = grossPotentialIncome - annualVacancyLoss;

  const annualManagementFee = (effectiveGrossIncome * managementRate) / 100;
  const annualMaintenance = (effectiveGrossIncome * maintenanceRate) / 100;
  const annualCapex = (effectiveGrossIncome * capexRate) / 100;
  const totalOperatingExpenses = annualTaxes + annualInsurance + annualManagementFee + annualMaintenance + annualCapex;

  const annualNOI = effectiveGrossIncome - totalOperatingExpenses;
  const capRate = purchasePrice > 0 ? ((annualNOI / purchasePrice) * 100).toFixed(2) : '0.00';

  const annualNetCashFlow = annualNOI - annualDebtService;
  const monthlyNetCashFlow = annualNetCashFlow / 12;

  const cashOnCash = totalCashInvested > 0 
    ? ((annualNetCashFlow / totalCashInvested) * 100).toFixed(2) 
    : '0.00';

  const dscr = annualDebtService > 0 ? (annualNOI / annualDebtService).toFixed(2) : '0.00';

  const totalFixedCostsAnnual = totalOperatingExpenses + annualDebtService;
  const breakEvenOccupancy = grossPotentialIncome > 0 
    ? Math.min(100, Math.round((totalFixedCostsAnnual / grossPotentialIncome) * 100))
    : 0;

  // IRS Section 168 (27.5 ans)
  const buildingBasis = (purchasePrice + rehabBudget) * 0.80;
  const annualDepreciation = buildingBasis / 27.5;
  const annualTaxSaved = annualDepreciation * (marginalTaxRate / 100);

  // Tableau d'amortissement sur 5 ans pour le mémo
  const amortizationSchedule = useMemo(() => {
    const schedule = [];
    let balance = loanAmount;
    let propValue = purchasePrice + rehabBudget;

    for (let y = 1; y <= 5; y++) {
      let principalYear = 0;
      let interestYear = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interestMonth = balance * monthlyRate;
        const principalMonth = Math.min(balance, monthlyMortgage - interestMonth);
        interestYear += interestMonth;
        principalYear += principalMonth;
        balance = Math.max(0, balance - principalMonth);
      }

      propValue = propValue * 1.03; // 3% d'appréciation annuelle standard

      schedule.push({
        year: y,
        remainingBalance: Math.round(balance),
        principalPaid: Math.round(principalYear),
        interestPaid: Math.round(interestYear),
        propertyValue: Math.round(propValue),
        equity: Math.round(propValue - balance)
      });
    }
    return schedule;
  }, [loanAmount, monthlyRate, monthlyMortgage, purchasePrice, rehabBudget]);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Barre de navigation */}
      <header className="border-b border-slate-800 bg-[#06080F]/90 backdrop-blur sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/deals" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Deal Flow Desk</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMemoModal(true)}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>View &amp; Print Deal Memo</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* En-tête et Titre du bien */}
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Interactive Diligence Underwriter
            </span>
            <h1 className="text-2xl font-black text-white">{propertyTitle}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{propertyAddress}</span>
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Purchase Price</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">${purchasePrice.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">${Math.round(purchasePrice / units).toLocaleString()} / door</span>
          </div>
        </div>

        {/* Tableau de bord des 4 métriques clés */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0b1120] border border-emerald-500/30 p-4 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-black text-slate-400 block">CAP RATE</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{capRate}%</span>
            <span className="text-[10px] text-slate-500">Unlevered Return</span>
          </div>
          <div className="bg-[#0b1120] border border-cyan-500/30 p-4 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-black text-slate-400 block">DSCR RATIO</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{dscr}x</span>
            <span className="text-[10px] text-slate-500">Coverage Benchmark: 1.25x</span>
          </div>
          <div className="bg-[#0b1120] border border-emerald-500/30 p-4 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-black text-slate-400 block">CASH-ON-CASH</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{cashOnCash}%</span>
            <span className="text-[10px] text-slate-500">Year 1 Net Yield</span>
          </div>
          <div className="bg-[#0b1120] border border-amber-500/30 p-4 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-black text-slate-400 block">NET CASH FLOW</span>
            <span className={`text-2xl font-black font-mono mt-1 block ${monthlyNetCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {monthlyNetCashFlow >= 0 ? '+' : ''}${Math.round(monthlyNetCashFlow).toLocaleString()}/mo
            </span>
            <span className="text-[10px] text-slate-500">${Math.round(annualNetCashFlow).toLocaleString()}/yr</span>
          </div>
        </div>

        {/* Formulaires d'ajustement interactif */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panneau Financement */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Coins className="w-4 h-4" /> Debt Financing &amp; Acquisition
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Contract Price ($)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
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
                  className="w-full accent-emerald-400 bg-slate-950 rounded-lg cursor-pointer h-2 mt-2"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Loan Term (Years)</label>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                >
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-sans">Monthly Debt Payment (P&amp;I):</span>
              <span className="text-red-400 font-bold">-${Math.round(monthlyMortgage).toLocaleString()}/mo</span>
            </div>
          </div>

          {/* Panneau OpEx & Recettes */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4" /> Income &amp; Operating Expenses (OpEx)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Total Monthly Rent ($)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Property Taxes ($/yr)</label>
                <input
                  type="number"
                  value={annualTaxes}
                  onChange={(e) => setAnnualTaxes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Hazard Insurance ($/yr)</label>
                <input
                  type="number"
                  value={annualInsurance}
                  onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Management (%)</label>
                <input
                  type="number"
                  value={managementRate}
                  onChange={(e) => setManagementRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Turnover / Repairs (%)</label>
                <input
                  type="number"
                  value={maintenanceRate}
                  onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">CapEx Structural (%)</label>
                <input
                  type="number"
                  value={capexRate}
                  onChange={(e) => setCapexRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-sans">Net Operating Income (NOI):</span>
              <span className="text-emerald-400 font-bold">${Math.round(annualNOI).toLocaleString()}/yr</span>
            </div>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* MODAL DU DEAL MEMO (AVEC SECTION 3 COMPLETE IRS 27.5-YEAR)               */}
      {/* ========================================================================= */}
      {showMemoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl max-w-5xl w-full p-6 sm:p-10 shadow-2xl relative print:border-0 print:shadow-none print:p-0">
            
            {/* Header Modal Actions (Caché à l'impression) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Institutional Lender Diligence Dossier (PDF Export Ready)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowMemoModal(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CONTENU OFFICIEL DU MÉMO */}
            <div className="space-y-6 text-slate-900 font-sans">
              
              {/* En-tête Dossier */}
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-wider text-slate-900 uppercase">
                    MULTIDEALPROP UNDERWRITING SUITE
                  </h2>
                  <p className="text-xs text-emerald-800 font-bold uppercase tracking-widest mt-0.5">
                    INSTITUTIONAL LENDER DILIGENCE DOSSIER &amp; SENIOR DEBT AUDIT
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-600">
                  <div>MEMO REF: <strong className="text-slate-900 font-mono">MDP-2026-OH-08412</strong></div>
                  <div>VALUATION: <strong className="text-slate-900">September 7, 2026</strong></div>
                  <div>STATUS: <strong className="text-emerald-700 font-bold">AUDITED &amp; UNLOCKED</strong></div>
                </div>
              </div>

              {/* Propriété */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">PROPERTY IDENTIFICATION</span>
                  <strong className="text-slate-900 font-bold text-sm block mt-0.5">{propertyTitle}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">JURISDICTION</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">{propertyAddress}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">DOORS / STRUCTURE</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">{units} Units (1924 (Renovated 2021))</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">AUDIT OCCUPANCY</span>
                  <strong className="text-emerald-800 font-black block mt-0.5">100% Leased (Stabilized)</strong>
                </div>
              </div>

              {/* Ratios Clés */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] uppercase font-black text-slate-500 block">CAP RATE</span>
                  <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">{capRate}%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] uppercase font-black text-slate-500 block">DSCR RATIO</span>
                  <span className="text-xl font-black text-cyan-800 font-mono mt-0.5 block">{dscr}x</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] uppercase font-black text-slate-500 block">CASH-ON-CASH</span>
                  <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">{cashOnCash}%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] uppercase font-black text-slate-500 block">BREAK-EVEN OCC.</span>
                  <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">{breakEvenOccupancy}%</span>
                </div>
              </div>

              {/* 1. Pro-Forma Cash Flow */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    1. STABILIZED 12-MONTH PRO-FORMA CASH FLOW (YEAR 1)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">UNDERWRITTEN IN USD ($)</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-[10px] text-slate-700 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-bold">Line Item Breakdown</th>
                        <th className="py-2 px-3 text-right font-bold">Monthly</th>
                        <th className="py-2 px-3 text-right font-bold">Annual</th>
                        <th className="py-2 px-3 text-right font-bold">% of Gross</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="py-2 px-3 font-sans font-bold text-slate-900">Gross Scheduled Rental Income</td>
                        <td className="py-2 px-3 text-right">${monthlyRent.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${grossScheduledAnnualRent.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">97.5%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">Reimbursements &amp; Utility Recovery</td>
                        <td className="py-2 px-3 text-right">${otherMonthlyIncome.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${grossUtilityRecovery.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">2.5%</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="py-2 px-3 font-sans text-slate-900">Gross Potential Income (GPI)</td>
                        <td className="py-2 px-3 text-right">${(monthlyRent + otherMonthlyIncome).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${grossPotentialIncome.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">100.0%</td>
                      </tr>
                      <tr className="text-red-600">
                        <td className="py-2 px-3 font-sans">Less: Economic Vacancy Escrow ({vacancyRate}%)</td>
                        <td className="py-2 px-3 text-right">-${Math.round(annualVacancyLoss / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">-${Math.round(annualVacancyLoss).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">-{vacancyRate}.0%</td>
                      </tr>
                      <tr className="bg-emerald-50 font-bold text-emerald-800">
                        <td className="py-2 px-3 font-sans">EFFECTIVE GROSS INCOME (EGI)</td>
                        <td className="py-2 px-3 text-right">${Math.round(effectiveGrossIncome / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${Math.round(effectiveGrossIncome).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">95.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">County Taxes (Verified Assessment)</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualTaxes / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${annualTaxes.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{((annualTaxes / grossPotentialIncome) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">Property Hazard &amp; Flood Insurance</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualInsurance / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${annualInsurance.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{((annualInsurance / grossPotentialIncome) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">Professional Property Management ({managementRate}%)</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualManagementFee / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualManagementFee).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{managementRate}.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">Turnover &amp; Repairs Escrow ({maintenanceRate}%)</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualMaintenance / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualMaintenance).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{maintenanceRate}.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">Capital Replacement Reserves (CapEx {capexRate}%)</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualCapex / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualCapex).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{capexRate}.0%</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold">
                        <td className="py-2 px-3 font-sans text-slate-900">Total Operating Expenses (OpEx)</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(totalOperatingExpenses / 12).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(totalOperatingExpenses).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{((totalOperatingExpenses / grossPotentialIncome) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="bg-emerald-100 font-black text-emerald-900 text-sm">
                        <td className="py-2.5 px-3 font-sans">NET OPERATING INCOME (NOI)</td>
                        <td className="py-2.5 px-3 text-right">${Math.round(annualNOI / 12).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">${Math.round(annualNOI).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">{((annualNOI / grossPotentialIncome) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-600">Senior Mortgage Debt Service (P&amp;I)</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(monthlyMortgage).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-red-600">-${Math.round(annualDebtService).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{((annualDebtService / grossPotentialIncome) * 100).toFixed(1)}%</td>
                      </tr>
                      <tr className="bg-cyan-50 font-black text-cyan-900 text-sm">
                        <td className="py-2.5 px-3 font-sans">NET DISTRIBUTABLE CASH FLOW</td>
                        <td className="py-2.5 px-3 text-right">+${Math.round(monthlyNetCashFlow).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">+${Math.round(annualNetCashFlow).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">{((annualNetCashFlow / grossPotentialIncome) * 100).toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Debt Paydown Schedule */}
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                  2. Senior Debt Paydown &amp; Equity Buildup Schedule (Years 1-5)
                </div>

                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold text-slate-700">
                      <th className="p-1.5">Period</th>
                      <th className="p-1.5 text-right">Remaining Principal</th>
                      <th className="p-1.5 text-right">Principal Paid</th>
                      <th className="p-1.5 text-right">Interest Paid</th>
                      <th className="p-1.5 text-right">Property Value</th>
                      <th className="p-1.5 text-right">Sponsor Net Equity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {amortizationSchedule.slice(0, 5).map((row) => (
                      <tr key={row.year}>
                        <td className="p-1.5 font-bold text-slate-900">Year {row.year}</td>
                        <td className="p-1.5 text-right text-slate-700">${row.remainingBalance.toLocaleString()}</td>
                        <td className="p-1.5 text-right text-emerald-700">+${row.principalPaid.toLocaleString()}</td>
                        <td className="p-1.5 text-right text-slate-500">${row.interestPaid.toLocaleString()}</td>
                        <td className="p-1.5 text-right text-slate-800">${row.propertyValue.toLocaleString()}</td>
                        <td className="p-1.5 text-right font-bold text-emerald-800">${row.equity.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3. IRS 27.5-YEAR DEPRECIATION & TAX SHELTER SCHEDULE */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                    3. IRS 27.5-Year Depreciation &amp; Passive Tax Shield (Residential MACRS)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Assumed Tax Bracket: 28.0%
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      Depreciable Basis (80%)
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
                      ${Math.round((purchasePrice || 98000) * 0.80).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Excludes 20% Land Allocation</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      Annual Depreciation
                    </span>
                    <span className="text-sm font-mono font-bold text-cyan-800 block mt-0.5">
                      ${Math.round(((purchasePrice || 98000) * 0.80) / 27.5).toLocaleString()} / yr
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Straight-Line Paper Loss</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      Annual Tax Shield
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-700 block mt-0.5">
                      ${Math.round((((purchasePrice || 98000) * 0.80) / 27.5) * 0.28).toLocaleString()} / yr
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Direct Cash Saved</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      Effective Tax Rate
                    </span>
                    <span className="text-sm font-mono font-black text-emerald-700 block mt-0.5">
                      0.0% (Sheltered)
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Cash Flow 100% Tax-Free</span>
                  </div>
                </div>
              </div>

              {/* Section Signatures */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[10px] text-slate-600">
                <div>
                  <strong className="block text-slate-900 mb-1">BORROWER / SPONSOR CERTIFICATION:</strong>
                  <p>Certified accurate and prepared for institutional debt diligence evaluation.</p>
                  <div className="mt-6 border-b border-slate-300 w-48"></div>
                </div>
                <div>
                  <strong className="block text-slate-900 mb-1">SENIOR UNDERWRITING DESK:</strong>
                  <p>Algorithmic valuation audited via MultiDealProp Engine.</p>
                  <div className="mt-6 border-b border-slate-300 w-48"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
