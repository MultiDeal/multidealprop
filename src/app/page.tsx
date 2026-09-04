'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Lock, 
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
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Sparkles,
  DollarSign,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomePage() {
  const [isMemoUnlocked, setIsMemoUnlocked] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [recentDeals, setRecentDeals] = useState<any[]>([]);

  // Modal Financement Lead
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [leadLoading, setLeadLoading] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    creditScore: '700-739',
    experience: '1-3 Deals'
  });

  // Propriété
  const [propertyTitle, setPropertyTitle] = useState<string>('Turnkey Cleveland Duplex');
  const [propertyAddress, setPropertyAddress] = useState<string>('1428 E 120th St, Cleveland, OH 44106');
  const [unitsCount, setUnitsCount] = useState<number>(2);
  const [yearBuilt, setYearBuilt] = useState<string>('1924 (Renovated 2021)');

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

  // Dépenses
  const [annualTaxes, setAnnualTaxes] = useState<number>(1420);
  const [annualInsurance, setAnnualInsurance] = useState<number>(850);
  const [managementRate, setManagementRate] = useState<number>(8);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(5);
  const [capexRate, setCapexRate] = useState<number>(5);
  const [annualUtilities, setAnnualUtilities] = useState<number>(780);

  // Projections
  const [annualAppreciation] = useState<number>(3.0);
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

  const applyPreset = (presetKey: 'CLEVELAND' | 'DETROIT' | 'SECTION8') => {
    if (presetKey === 'CLEVELAND') {
      setPropertyTitle('Turnkey University Circle Duplex');
      setPropertyAddress('1428 E 120th St, Cleveland, OH 44106');
      setUnitsCount(2);
      setPurchasePrice(98000);
      setMonthlyRent(1950);
      setOtherMonthlyIncome(50);
      setAnnualTaxes(1420);
      setAnnualInsurance(850);
      setRehabBudget(0);
      setEstimatedARV(145000);
    } else if (presetKey === 'DETROIT') {
      setPropertyTitle('Detroit High-Yield 4-Plex Value-Add');
      setPropertyAddress('3410 W Chicago Blvd, Detroit, MI 48206');
      setUnitsCount(4);
      setPurchasePrice(135000);
      setMonthlyRent(3600);
      setOtherMonthlyIncome(120);
      setAnnualTaxes(2100);
      setAnnualInsurance(1250);
      setRehabBudget(25000);
      setEstimatedARV(210000);
    } else if (presetKey === 'SECTION8') {
      setPropertyTitle('Midwest Guaranteed Rent Section 8 Triplex');
      setPropertyAddress('2184 N 49th St, Milwaukee, WI 53208');
      setUnitsCount(3);
      setPurchasePrice(165000);
      setMonthlyRent(3250);
      setOtherMonthlyIncome(75);
      setAnnualTaxes(2800);
      setAnnualInsurance(1100);
      setRehabBudget(5000);
      setEstimatedARV(195000);
    }
  };

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
    window.scrollTo({ top: 480, behavior: 'smooth' });
  };

  // Calculs Financiers
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
  const capRateNum = purchasePrice > 0 ? (annualNOI / purchasePrice) * 100 : 0;
  const capRate = capRateNum.toFixed(2);

  const annualNetCashFlow = annualNOI - annualDebtService;
  const monthlyNetCashFlow = annualNetCashFlow / 12;

  const cashOnCashNum = totalCashInvested > 0 ? (annualNetCashFlow / totalCashInvested) * 100 : 0;
  const cashOnCash = cashOnCashNum.toFixed(2);

  const dscrNum = annualDebtService > 0 ? annualNOI / annualDebtService : 0;
  const dscr = annualDebtService > 0 ? dscrNum.toFixed(2) : 'N/A';

  const totalFixedCostsAnnual = totalOperatingExpenses + annualDebtService;
  const breakEvenOccupancy = grossScheduledAnnualRent > 0 
    ? Math.min(100, Math.round((totalFixedCostsAnnual / grossScheduledAnnualRent) * 100))
    : 0;

  const buildingBasis = (purchasePrice + rehabBudget) * 0.80;
  const annualDepreciation = buildingBasis / 27.5;
  const annualTaxSaved = annualDepreciation * (marginalTaxRate / 100);

  // Amortissement
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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    try {
      const { error } = await supabase.from('financing_leads').insert([
        {
          property_address: propertyAddress,
          requested_loan: loanAmount,
          estimated_dscr: dscr,
          investor_name: leadForm.name,
          investor_email: leadForm.email,
          investor_phone: leadForm.phone,
          credit_score_range: leadForm.creditScore,
          experience_tier: leadForm.experience,
        }
      ]);
      if (error) throw error;
      setLeadSubmitted(true);
    } catch (err: any) {
      alert('Error submitting request. Please try again.');
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#04060C]/90 backdrop-blur sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              MP
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white">
                MULTIDEAL<span className="text-emerald-400">PROP</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-700 pl-2">
                Underwriting Suite
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/submit-deal"
              className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Deal (Free)</span>
            </Link>

            {isMemoUnlocked ? (
              <button
                onClick={() => window.print()}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 hover:bg-emerald-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Print Official Memo
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isCheckingOut ? 'Opening...' : 'Export Memo ($9.99)'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider shadow-inner">
          <Zap className="w-3.5 h-3.5 text-emerald-400" /> Institutional Real Estate Due Diligence
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Lender-Ready Multi-Family Memos in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Seconds</span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Quantitative debt underwriting for 2 to 20-unit properties. Instant DSCR, Cap Rate, T-12 pro-forma audit and IRS 27.5-year tax depreciation reports.
        </p>

        {/* 1-Click Presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-300 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Load Presets:
          </span>
          <button
            onClick={() => applyPreset('CLEVELAND')}
            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
          >
            Cleveland 2-Plex (Turnkey)
          </button>
          <button
            onClick={() => applyPreset('DETROIT')}
            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
          >
            Detroit 4-Plex (Value-Add)
          </button>
          <button
            onClick={() => applyPreset('SECTION8')}
            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
          >
            Section 8 Triplex (High-Yield)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        
        {/* Deal Header + Score Dynamique */}
        <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-2xl">
          <div className="flex-1 w-full space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Active Underwriting Session
              </span>

              {dscrNum >= 1.25 && capRateNum >= 9.0 ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" /> PRIME BANKABLE ASSET (Tier 1 Qualified)
                </span>
              ) : dscrNum >= 1.15 ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-black px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> MODERATE COVERAGE (Requires 25% Down)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-black px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> TIGHT DEBT RATIO (Sub-1.15x Covenant)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="Deal Headline"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white outline-none focus:border-emerald-400 transition"
              />
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Property Address"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>

          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 w-full md:w-auto text-left md:text-right shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Total Acquisition Basis</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ${(purchasePrice + rehabBudget).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
              ${Math.round((purchasePrice + rehabBudget) / unitsCount).toLocaleString()} / door
            </span>
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

        {/* ============================================================ */}
        {/* BANDEAU FINANCEMENT (LEAD CAPTURE POUR COMMISSIONS 1% PRÊT)  */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-emerald-950/50 via-[#0a1428] to-cyan-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="space-y-1.5 text-left w-full md:w-auto">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase px-2.5 py-0.5 rounded-md">
              <CheckCircle className="w-3.5 h-3.5" /> DSCR Lending Qualified Asset
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Need Debt Financing for this Property (${loanAmount.toLocaleString()})?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              With a modeled DSCR of <strong className="text-white">{dscr}x</strong>, this deal qualifies for 30-year fixed senior mortgage debt (no W-2 required, based on rental income).
            </p>
          </div>

          <button
            onClick={() => {
              setLeadSubmitted(false);
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto shrink-0 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-4 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <DollarSign className="w-4 h-4" />
            <span>Get Rate &amp; Term Sheet ↗</span>
          </button>
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
                <label className="text-slate-400 font-bold block mb-1">Gross Monthly Rent ($)</label>
                <input 
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
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
                <label className="text-slate-400 font-bold block mb-1">CapEx Reserve (%)</label>
                <input 
                  type="number"
                  value={capexRate}
                  onChange={(e) => setCapexRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Inventaire Soumis par les Wholesalers */}
        <div className="pt-4 space-y-4">
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

          {recentDeals.length > 0 && (
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
          )}
        </div>

      </main>

      {/* ============================================================ */}
      {/* MODAL DE DEMANDE DE FINANCEMENT (LEAD CAPTURE)              */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1222] border-2 border-emerald-500/40 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-black text-white">Financing Request Received!</h3>
                <p className="text-slate-300 text-sm max-w-sm mx-auto">
                  Our DSCR lending desk has received your property metrics for <strong>{propertyAddress}</strong>. A loan officer will provide preliminary rate &amp; terms within 24 hours.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    DSCR Senior Debt Matching
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                    Request Loan Quote (${loanAmount.toLocaleString()})
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Pre-underwritten for <strong>{propertyAddress}</strong> (DSCR: {dscr}x). No tax returns or personal DTI required.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Direct Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="(216) 555-0199"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Estimated Credit Score</label>
                      <select
                        value={leadForm.creditScore}
                        onChange={(e) => setLeadForm({ ...leadForm, creditScore: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                      >
                        <option value="740+">740+ (Best Rates)</option>
                        <option value="700-739">700 - 739 (Standard)</option>
                        <option value="660-699">660 - 699 (Tier 2)</option>
                        <option value="Under 660">Under 660</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Investment Experience</label>
                      <select
                        value={leadForm.experience}
                        onChange={(e) => setLeadForm({ ...leadForm, experience: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                      >
                        <option value="First Deal">First Investment Property</option>
                        <option value="1-3 Deals">1 to 3 Properties Owned</option>
                        <option value="4+ Deals">4+ Properties (Experienced)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={leadLoading}
                    className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {leadLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Dossier...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit for Term Sheet Review</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    🔒 Soft credit pull only. No impact on credit score.
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#030508] py-8 text-center text-xs text-slate-500 print:hidden">
        <p>&copy; 2026 MultiDealProp. Institutional Underwriting &amp; Multi-Family Financial Modeling.</p>
      </footer>

    </div>
  );
}
