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
  Loader2,
  Share2
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

  // Chargement initial des deals & vérification de retour Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('memo_paid') === 'true';

    if (paid) {
      const currentNormalized = propertyAddress.trim().toLowerCase();
      try {
        const stored = JSON.parse(localStorage.getItem('unlocked_addresses') || '[]');
        if (!stored.includes(currentNormalized)) {
          stored.push(currentNormalized);
          localStorage.setItem('unlocked_addresses', JSON.stringify(stored));
        }
      } catch (e) {
        localStorage.setItem('unlocked_addresses', JSON.stringify([currentNormalized]));
      }
      setIsMemoUnlocked(true);
      window.history.replaceState({}, '', window.location.pathname);
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

  // Vérification dynamique du verrou dès que l'adresse change
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('unlocked_addresses') || '[]');
      const currentNormalized = propertyAddress.trim().toLowerCase();
      if (stored.includes(currentNormalized)) {
        setIsMemoUnlocked(true);
      } else {
        setIsMemoUnlocked(false);
      }
    } catch (e) {
      setIsMemoUnlocked(false);
    }
  }, [propertyAddress]);

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

  // Calculs financiers
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
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black print:bg-white print:text-black">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#04060C]/90 backdrop-blur sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition duration-200">
              MP
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white group-hover:text-emerald-300 transition duration-200">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center space-y-4 print:hidden">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8 print:p-0 print:m-0 print:max-w-none">
        
        {/* Deal Parameters & Inputs */}
        <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-2xl print:hidden">
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
                className="w-36 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a101f] border border-slate-800 p-4 sm:p-5 rounded-2xl text-center shadow-xl print:hidden">
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

        {/* Bandeau Financement Lead */}
        <div className="bg-gradient-to-r from-emerald-950/50 via-[#0a1428] to-cyan-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] print:hidden">
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

        {/* LE LENDER DEAL MEMO : SEULE SECTION IMPRIMÉE */}
        <div className="bg-[#0b1222] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_35px_rgba(16,185,129,0.12)] space-y-6 print:border-none print:p-0 print:m-0 print:shadow-none print:bg-white print:block">
          
          {/* En-tête web */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:hidden">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Bank Deliverable Sample[cite: 1]
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Lender Diligence Memorandum (Audit Dossier)[cite: 1]
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Commercial real estate underwriting dossier conforming to US DSCR mortgage covenants[cite: 1].
              </p>
            </div>

            {isMemoUnlocked ? (
              <button
                onClick={() => window.print()}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Print Official Memo</span>
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Generate for This Deal ($9.99)</span>
              </button>
            )}
          </div>

          {/* FEUILLE BLANCHE DU DOCUMENT OFFICIEL */}
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 shadow-2xl p-5 sm:p-8 font-sans relative overflow-hidden print:border-none print:shadow-none print:p-0 print:rounded-none">
            
            {/* Header Officiel */}
            <div className="bg-[#0b1528] text-white p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:rounded-none">
              <div>
                <div className="font-black text-sm sm:text-base tracking-wide text-white">
                  MULTIDEALPROP UNDERWRITING SUITE[cite: 1]
                </div>
                <div className="text-[10px] sm:text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Institutional Lender Diligence Dossier &amp; Senior Debt Audit[cite: 1]
                </div>
              </div>
              <div className="text-left sm:text-right text-[10px] sm:text-xs text-slate-300 font-mono space-y-0.5">
                <div>MEMO REF: <strong className="text-white">MDP-2026-OH-08412</strong>[cite: 1]</div>
                <div>VALUATION: <strong className="text-white">September 5, 2026</strong></div>
                <div>STATUS: <strong className={isMemoUnlocked ? 'text-emerald-400' : 'text-slate-400'}>
                  {isMemoUnlocked ? 'AUDITED & UNLOCKED' : 'PREVIEW ONLY'}
                </strong></div>
              </div>
            </div>

            {/* Fiche d'identification */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 my-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Property Identification</span>
                <strong className="text-slate-900 block mt-0.5 truncate">{propertyTitle}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Jurisdiction</span>
                <strong className="text-slate-900 block mt-0.5 truncate">{propertyAddress}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Doors / Structure</span>
                <strong className="text-slate-900 block mt-0.5">{unitsCount} Units ({yearBuilt})</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Audit Occupancy</span>
                <strong className="text-emerald-700 block mt-0.5">100% Leased (Stabilized)</strong>
              </div>
            </div>

            {/* 4 Ratios Covenants Bancaires */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-center">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">CAP RATE</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono block my-0.5">{capRate}%</span>
                <span className="text-[9px] text-slate-400">Benchmark: &gt; 8.50%[cite: 1]</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">DSCR RATIO</span>
                <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono block my-0.5">{dscr}x</span>
                <span className="text-[9px] text-blue-600 font-bold">Min Floor: 1.25x (Prime)[cite: 1]</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">CASH-ON-CASH</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono block my-0.5">{cashOnCash}%</span>
                <span className="text-[9px] text-slate-400">Net Yield Year 1</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">BREAK-EVEN OCC.</span>
                <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono block my-0.5">{breakEvenOccupancy}%</span>
                <span className="text-[9px] text-slate-400">Safe vs Downturn</span>
              </div>
            </div>

            {/* TABLEAU T-12 AUDITÉ */}
            <div className="my-5">
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
                <span>1. Stabilized 12-Month Pro-Forma Cash Flow (Year 1)[cite: 1]</span>
                <span className="text-[10px] font-mono text-slate-500">Underwritten in USD ($)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] uppercase font-bold">
                      <th className="py-2 px-2.5">Line Item Breakdown</th>
                      <th className="py-2 px-2.5 text-right">Monthly</th>
                      <th className="py-2 px-2.5 text-right">Annual</th>
                      <th className="py-2 px-2.5 text-right hidden sm:table-cell">% of Gross</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-800">
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans font-bold text-slate-900">Gross Scheduled Rental Income</td>
                      <td className="py-1.5 px-2.5 text-right">${monthlyRent.toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right">${(monthlyRent * 12).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">97.5%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-600">Reimbursements &amp; Utility Recovery</td>
                      <td className="py-1.5 px-2.5 text-right">${otherMonthlyIncome}</td>
                      <td className="py-1.5 px-2.5 text-right">${(otherMonthlyIncome * 12).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">2.5%[cite: 1]</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="py-1.5 px-2.5 font-sans">Gross Potential Income (GPI)[cite: 1]</td>
                      <td className="py-1.5 px-2.5 text-right">${(monthlyRent + otherMonthlyIncome).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right">${grossScheduledAnnualRent.toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">100.0%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-red-600">Less: Economic Vacancy Escrow ({vacancyRate}%)</td>
                      <td className="py-1.5 px-2.5 text-right text-red-600">-${Math.round(annualVacancyLoss / 12)}</td>
                      <td className="py-1.5 px-2.5 text-right text-red-600">-${Math.round(annualVacancyLoss).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-red-400 hidden sm:table-cell">-{vacancyRate}.0%</td>
                    </tr>
                    <tr className="bg-emerald-50/80 font-bold text-emerald-950 border-y border-emerald-200">
                      <td className="py-2 px-2.5 font-sans">EFFECTIVE GROSS INCOME (EGI)[cite: 1]</td>
                      <td className="py-2 px-2.5 text-right">${Math.round(effectiveGrossIncome / 12).toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right">${Math.round(effectiveGrossIncome).toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right text-emerald-800 hidden sm:table-cell">95.0%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-600">County Taxes (Verified Assessment)</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualTaxes / 12)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${annualTaxes.toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">-5.9%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-600">Property Hazard &amp; Flood Insurance</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualInsurance / 12)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${annualInsurance.toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">-3.5%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-600">Professional Property Management ({managementRate}%)</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualManagementFee / 12)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualManagementFee).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">-7.6%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-600">Turnover &amp; Repairs Escrow ({maintenanceRate}%)</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualMaintenance / 12)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualMaintenance).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">-4.8%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-600">Capital Replacement Reserves (CapEx {capexRate}%)</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualCapex / 12)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-700">-${Math.round(annualCapex).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">-4.8%[cite: 1]</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                      <td className="py-1.5 px-2.5 font-sans">Total Operating Expenses (OpEx)[cite: 1]</td>
                      <td className="py-1.5 px-2.5 text-right">-${Math.round(totalOperatingExpenses / 12).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right">-${Math.round(totalOperatingExpenses).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-600 hidden sm:table-cell">-30.0%[cite: 1]</td>
                    </tr>
                    <tr className="bg-emerald-100 font-black text-emerald-950 border-y-2 border-emerald-400 text-sm">
                      <td className="py-2 px-2.5 font-sans">NET OPERATING INCOME (NOI)[cite: 1]</td>
                      <td className="py-2 px-2.5 text-right font-mono">${Math.round(annualNOI / 12).toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right font-mono">${Math.round(annualNOI).toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right text-emerald-800 hidden sm:table-cell">65.0%[cite: 1]</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-sans text-slate-700">Senior Mortgage Debt Service (P&amp;I)[cite: 1]</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-800">-${Math.round(monthlyMortgage).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-800">-${Math.round(annualDebtService).toLocaleString()}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-400 hidden sm:table-cell">-26.8%[cite: 1]</td>
                    </tr>
                    <tr className="bg-blue-50 font-black text-blue-950 border-y border-blue-200">
                      <td className="py-2 px-2.5 font-sans">NET DISTRIBUTABLE CASH FLOW</td>
                      <td className="py-2 px-2.5 text-right font-mono">+${Math.round(monthlyNetCashFlow).toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right font-mono">+${Math.round(annualNetCashFlow).toLocaleString()}</td>
                      <td className="py-2 px-2.5 text-right text-blue-800 hidden sm:table-cell">38.2%[cite: 1]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2 : AMORTISSEMENT & SIGNATURES */}
            <div className="relative pt-4 border-t-2 border-slate-200">
              
              <div className={`${!isMemoUnlocked ? 'select-none filter blur-[3px] opacity-40' : ''} space-y-4`}>
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  2. Senior Debt Paydown &amp; Equity Buildup Schedule (Years 1–5)[cite: 1]
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
                        <td className="p-1.5 font-bold text-slate-900">Year {row.year}[cite: 1]</td>
                        <td className="p-1.5 text-right text-slate-700">${row.remainingBalance.toLocaleString()}</td>
                        <td className="p-1.5 text-right text-emerald-700">+${row.principalPaid.toLocaleString()}</td>
                        <td className="p-1.5 text-right text-slate-500">${row.interestPaid.toLocaleString()}</td>
                        <td className="p-1.5 text-right text-slate-800">${row.propertyValue.toLocaleString()}</td>
                        <td className="p-1.5 text-right font-bold text-emerald-800">${row.equity.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Section Signatures */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[10px] text-slate-600">
                  <div>
                    <strong className="block text-slate-900 mb-1">BORROWER / SPONSOR CERTIFICATION:</strong>
                    <p className="leading-tight text-slate-500">
                      The undersigned confirms all current rents, property leases, and debt assumptions provided herein represent true operational metrics.
                    </p>
                    <div className="mt-8 border-b border-slate-400 w-4/5"></div>
                    <span className="block mt-1 text-slate-400">Authorized Sponsor Signature &amp; Date</span>
                  </div>

                  <div>
                    <strong className="block text-slate-900 mb-1">LENDING OFFICER DILIGENCE:</strong>
                    <p className="leading-tight text-slate-500">
                      Calculated via MultiDealProp Engine. Subject to formal appraisal, title search, and lender underwriting sign-off.
                    </p>
                    <div className="mt-8 border-b border-slate-400 w-4/5"></div>
                    <span className="block mt-1 text-slate-400">Underwriter / Loan Officer Signature &amp; Date</span>
                  </div>
                </div>
              </div>

              {/* Paywall Overlay */}
              {!isMemoUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent flex flex-col items-center justify-center p-6 text-center rounded-xl print:hidden">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2 shadow-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Unlock the Complete 2-Page Lender Deal Memo (PDF)
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-lg mt-1 mb-4">
                    Includes the 5-year debt paydown &amp; equity buildup schedule, IRS 27.5-year tax shelter breakdown, and dual Sponsor/Lending Officer certification blocks.
                  </p>
                  <button
                    onClick={handleStripeCheckout}
                    disabled={isCheckingOut}
                    className="bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-xl transition shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isCheckingOut ? 'Opening Stripe...' : 'Download Official PDF Memo ($9.99)'}</span>
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mt-3 text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Instant PDF Download
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 100% Lender-Compliant Format
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Secure 256-Bit Stripe Checkout
                    </span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Inputs Financement & Dépenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
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
                <label className="text-slate-400 font-bold block mb-1">Maintenance (%)</label>
                <input 
                  type="number"
                  value={maintenanceRate}
                  onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Inventaire des Wholesalers AVEC BOUTON DE PARTAGE SUR CHAQUE DEAL */}
        <div className="pt-4 space-y-4 print:hidden">
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

                    {/* BOUTONS : ANALYSER + PARTAGE RÉSEAUX SOCIAUX */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => loadDealIntoAnalyzer(deal)}
                        className="flex-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-black py-2.5 rounded-xl transition cursor-pointer text-center"
                      >
                        Underwrite Deal ↗
                      </button>
                      
                      <button
                        onClick={() => {
                          const dealAddr = deal.formatted_address || deal.title;
                          const shareText = `🔥 Multi-Family Deal: ${deal.title} - $${Number(deal.price).toLocaleString()} (${deal.units || 2} Doors). View live DSCR Underwriting & Memo: ${window.location.origin}/?address=${encodeURIComponent(dealAddr)}`;
                          navigator.clipboard.writeText(shareText);
                          alert('Deal pitch copied to clipboard! Ready to paste into Facebook groups or LinkedIn.');
                        }}
                        title="Copy deal post for Facebook / Socials"
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Modal Lead Capture */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
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
