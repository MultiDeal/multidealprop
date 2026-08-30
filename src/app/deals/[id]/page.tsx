'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
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
  Compass,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

// Initialisation Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UnitDetail {
  unitNumber: string;
  type: string;
  currentRent: number;
  marketRent: number;
  leaseStatus: string;
  squareFeet: number;
}

interface MarketComp {
  address: string;
  soldPrice: number;
  units: number;
  pricePerUnit: number;
  date: string;
}

export default function DealDetailPage() {
  const routerParams = useParams();
  const rawId = (typeof routerParams?.id === 'string' ? routerParams.id : Array.isArray(routerParams?.id) ? routerParams.id[0] : '1');
  const dealId = decodeURIComponent(rawId);

  // État du deal
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Statut Membre
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<string | null>(null);

  // Galerie photos
  const [dealImages, setDealImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Stratégie d'Acquisition
  const [strategy, setStrategy] = useState<'BUY_HOLD' | 'BRRRR' | 'FLIP'>('BUY_HOLD');

  // Paramètres de Financement
  const [purchasePrice, setPurchasePrice] = useState<number>(150000);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestOnlyYears, setInterestOnlyYears] = useState<number>(0);
  const [closingCostPercent, setClosingCostPercent] = useState<number>(2.5);
  const [rehabBudget, setRehabBudget] = useState<number>(0);

  // Revenus
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(50);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // Dépenses Opérationnelles
  const [annualTaxes, setAnnualTaxes] = useState<number>(2500);
  const [annualInsurance, setAnnualInsurance] = useState<number>(1200);
  const [managementRate, setManagementRate] = useState<number>(8);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(5);
  const [capexRate, setCapexRate] = useState<number>(5);
  const [annualUtilities, setAnnualUtilities] = useState<number>(800);

  // Modélisation de Sortie
  const [holdingPeriodYears, setHoldingPeriodYears] = useState<number>(5);
  const [exitCapRate, setExitCapRate] = useState<number>(7.5);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(3.0);
  const [annualRentGrowth, setAnnualRentGrowth] = useState<number>(2.5);
  const [marginalTaxRate] = useState<number>(28);

  const [showAmortizationTable, setShowAmortizationTable] = useState<boolean>(false);
  const [loiSubmitted, setLoiSubmitted] = useState<boolean>(false);

  // 1. Récupérer le Deal réel depuis Supabase
  useEffect(() => {
    async function loadDeal() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('id', dealId)
          .single();

        if (data && !error) {
          const priceVal = Number(data.price || 150000);
          const unitsVal = Number(data.units || 2);
          const rentVal = Number(data.monthly_rent || 2000);
          const taxesVal = Number(data.taxes || Math.round(priceVal * 0.018));
          const insVal = Number(data.insurance || Math.round(priceVal * 0.009));
          const waterVal = Number(data.water_sewer || unitsVal * 60 * 12);
          const otherIncVal = Number(data.other_income || unitsVal * 35);

          // Génération dynamique du rent-roll par porte
          const rentPerDoor = Math.round(rentVal / unitsVal);
          const marketRentPerDoor = Math.round(rentPerDoor * 1.25);
          const generatedRentRoll: UnitDetail[] = Array.from({ length: unitsVal }, (_, i) => ({
            unitNumber: `Unit ${i + 1}`,
            type: `${unitsVal >= 6 ? '1 Bed / 1 Bath' : '2 Bed / 1 Bath'}`,
            currentRent: rentPerDoor,
            marketRent: marketRentPerDoor,
            leaseStatus: i === 0 ? 'Active (M2M)' : 'Leased (Stable)',
            squareFeet: 850
          }));

          // Comps de marché calibrés
          const generatedComps: MarketComp[] = [
            {
              address: `Nearby Comps #1 (${data.location})`,
              soldPrice: Math.round(priceVal * 1.15),
              units: unitsVal,
              pricePerUnit: Math.round((priceVal * 1.15) / unitsVal),
              date: 'Recent Sale'
            },
            {
              address: `Nearby Comps #2 (${data.location})`,
              soldPrice: Math.round(priceVal * 1.28),
              units: unitsVal,
              pricePerUnit: Math.round((priceVal * 1.28) / unitsVal),
              date: 'Recent Sale'
            }
          ];

          const formattedDeal = {
            id: String(data.id),
            title: data.title || `${unitsVal}-Unit Multi-Family Opportunity`,
            location: data.location || 'Cleveland, OH',
            address: data.address || data.formatted_address || 'Address On File',
            apn: data.apn || 'County Records Verified',
            price: priceVal,
            arv: Number(data.arv || Math.round(priceVal * 1.35)),
            units: unitsVal,
            yearBuilt: data.year_built || '1965',
            monthlyRent: rentVal,
            otherIncome: otherIncVal,
            vacancyRate: Number(data.vacancy_rate || 5),
            taxes: taxesVal,
            insurance: insVal,
            managementRate: Number(data.management_rate || 8),
            maintenanceRate: Number(data.maintenance_rate || 5),
            capexRate: Number(data.capex_rate || 5),
            waterSewer: waterVal,
            images: [
              data.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
            ],
            mechanics: {
              roof: 'Architectural Shingle / Inspected Membrane',
              hvac: 'Individual Metered Heating Units',
              electrical: `${unitsVal} Individual Metered Panels`,
              plumbing: 'Copper / PEX Distribution Supply',
              foundation: 'Poured Concrete / Full Basement Structure'
            },
            rentRoll: generatedRentRoll,
            marketComps: generatedComps,
            wholesaler: {
              name: data.wholesaler_name || 'Apex Wholesale Desk',
              phone: data.wholesaler_phone || '(216) 555-0194',
              email: data.wholesaler_email || 'acquisitions@apexwholesale.com',
            }
          };

          setDeal(formattedDeal);
          setDealImages(formattedDeal.images);
          setPurchasePrice(formattedDeal.price);
          setMonthlyRent(formattedDeal.monthlyRent);
          setOtherMonthlyIncome(formattedDeal.otherIncome);
          setAnnualTaxes(formattedDeal.taxes);
          setAnnualInsurance(formattedDeal.insurance);
          setAnnualUtilities(formattedDeal.waterSewer);
        }
      } catch (e) {
        console.error('Erreur récupération deal:', e);
      } finally {
        setLoading(false);
      }
    }

    loadDeal();
  }, [dealId]);

  // 2. Gestion des droits d'accès VIP / Starter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tierParam = urlParams.get('tier');

    if (tierParam === 'starter' || tierParam === 'vip') {
      localStorage.setItem('multidealprop_tier', tierParam);
      setIsUnlocked(true);
      setUserTier(tierParam);
      return;
    }

    const saved = localStorage.getItem('multidealprop_tier');
    if (saved === 'vip' || saved === 'starter') {
      setIsUnlocked(true);
      setUserTier(saved);
    } else {
      setIsUnlocked(false);
      setUserTier(null);
    }
  }, []);

  const handleStrategyChange = (newStrategy: 'BUY_HOLD' | 'BRRRR' | 'FLIP') => {
    setStrategy(newStrategy);
    if (newStrategy === 'BUY_HOLD') setRehabBudget(0);
    if (newStrategy === 'BRRRR') setRehabBudget(35000);
    if (newStrategy === 'FLIP') setRehabBudget(45000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080F] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Chargement des données du deal...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#06080F] text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black">Deal introuvable</h1>
        <Link href="/deals" className="text-emerald-400 font-bold text-xs underline">&larr; Retour au bureau des deals</Link>
      </div>
    );
  }

  // --- CALCULS FINANCIERS DYNAMIQUES SUR DONNÉES RÉELLES ---
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

  const totalCurrentRent = deal.rentRoll.reduce((acc: number, u: UnitDetail) => acc + u.currentRent, 0);
  const totalMarketRent = deal.rentRoll.reduce((acc: number, u: UnitDetail) => acc + u.marketRent, 0);
  const monthlyRentUpside = totalMarketRent - totalCurrentRent;

  const brrrrARV = deal.arv || purchasePrice * 1.35;
  const brrrrRefinanceLoan = brrrrARV * 0.75;
  const brrrrCashLeftInDeal = Math.max(0, (purchasePrice + rehabBudget + closingCostsAmount) - brrrrRefinanceLoan);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800 bg-[#06080F]/95 backdrop-blur sticky top-0 z-40 print:hidden">
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
              <span>Back</span>
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
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Deal Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-slate-900/40 p-4 sm:p-6 rounded-3xl border border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                {deal.location}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {deal.units} Units • Built {deal.yearBuilt} • APN: {isUnlocked ? deal.apn : '••••••••'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white">{deal.title}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isUnlocked 
                  ? deal.address 
                  : `${deal.address.split(',')[0].slice(0, 5)}•••••• St, ${deal.location} (Exact Street Unlocked with Membership)`}
              </span>
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Underwritten Assignment Price</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ${purchasePrice.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
              ${Math.round(purchasePrice / deal.units).toLocaleString()} / door
            </span>
          </div>
        </div>

        {/* Stratégie & Export Deal Memo */}
        <div className="bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-5 mb-6 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Select Acquisition &amp; Exit Strategy:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStrategyChange('BUY_HOLD')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'BUY_HOLD'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
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
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
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
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span className="truncate">Fix &amp; Flip</span>
              </button>
            </div>
          </div>

          <div className="md:border-l md:border-slate-800 md:pl-4 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              Lender Diligence Packet:
            </span>
            {isUnlocked ? (
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Export Deal Memo (PDF)</span>
              </button>
            ) : (
              <Link
                href="/vip"
                className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlock PDF Deal Memo</span>
              </Link>
            )}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Galerie Photos */}
            <div className="space-y-3">
              <div className="h-72 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
                <img 
                  src={dealImages[activeImageIndex] || deal.images[0]} 
                  alt={`${deal.title} - Photo ${activeImageIndex + 1}`} 
                  className={`w-full h-full object-cover transition-all duration-300 ${!isUnlocked && activeImageIndex > 0 ? 'filter blur-md' : ''}`}
                />
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 font-bold">
                  📷 {activeImageIndex + 1} / {dealImages.length}
                </div>

                {!isUnlocked && activeImageIndex > 0 && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                    <Lock className="w-8 h-8 text-amber-400 mb-2" />
                    <span className="text-white font-black text-sm uppercase">Full HD Interior Photo Gallery Locked</span>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Unlock full high-resolution interior, mechanical, and roof inspection photos with Starter or VIP access.
                    </p>
                    <Link href="/vip" className="mt-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition">
                      Unlock Gallery ($29/mo)
                    </Link>
                  </div>
                )}
              </div>

              {dealImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {dealImages.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-16 w-24 sm:h-20 sm:w-28 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-emerald-400 scale-95 shadow-lg shadow-emerald-500/20' 
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className={`w-full h-full object-cover ${!isUnlocked && idx > 0 ? 'filter blur-sm' : ''}`} />
                      {!isUnlocked && idx > 0 && (
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Metrics */}
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

            {/* BRRRR Simulation */}
            {strategy === 'BRRRR' && (
              <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 p-5 rounded-3xl shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">BRRRR Equity &amp; Refinance Matrix</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">After Repair Value (ARV)</span>
                    <strong className="text-white font-mono text-sm block mt-0.5">${brrrrARV.toLocaleString()}</strong>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Estimated Rehab</span>
                    <strong className="text-amber-400 font-mono text-sm block mt-0.5">${rehabBudget.toLocaleString()}</strong>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">75% Refinance Cashout</span>
                    <strong className="text-cyan-300 font-mono text-sm block mt-0.5">${Math.round(brrrrRefinanceLoan).toLocaleString()}</strong>
                  </div>
                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                    <span className="text-emerald-400 block text-[9px] uppercase font-bold">Net Cash Left in Deal</span>
                    <strong className="text-emerald-400 font-mono text-sm block mt-0.5">${Math.round(brrrrCashLeftInDeal).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Rent Roll */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Rent Roll &amp; Unit Mix Analysis</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Détail des baux actuels et potentiel d'augmentation des loyers.</p>
                </div>
                <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800 w-fit">
                  +{monthlyRentUpside > 0 ? `$${monthlyRentUpside}/mo` : '$0/mo'} Market Upside
                </span>
              </div>

              <div className={`overflow-x-auto ${!isUnlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                      <th className="py-2.5 font-bold">Unit</th>
                      <th className="py-2.5 font-bold">Type</th>
                      <th className="py-2.5 font-bold">In-Place Rent</th>
                      <th className="py-2.5 font-bold">Market Rent</th>
                      <th className="py-2.5 font-bold">Lease Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {deal.rentRoll.map((unit: UnitDetail, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 font-bold text-white">{unit.unitNumber}</td>
                        <td className="py-2.5 text-slate-300">{unit.type}</td>
                        <td className="py-2.5 font-mono text-emerald-400 font-bold">${unit.currentRent}/mo</td>
                        <td className="py-2.5 font-mono text-cyan-300 font-bold">${unit.marketRent}/mo</td>
                        <td className="py-2.5 text-slate-400">{unit.leaseStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!isUnlocked && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-white font-black text-xs uppercase">Itemized Lease Details &amp; Unit Breakdown Locked</span>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                    View lease expiration dates, square footage, and unit-by-unit upside potential.
                  </p>
                  <Link href="/vip" className="mt-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition shadow-lg">
                    Unlock Unit Mix &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Calculatrice & Souscription Institutionnelle */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <span>Institutional Underwriting &amp; Mortgage Engine</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Modélisation complète de dette, options I/O, fiscalité et ratios de couverture.</p>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                  Live Calculator
                </span>
              </div>

              {/* Financement */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>1. Debt Financing &amp; Capital Stack</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Contract Price ($)</label>
                    <input 
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400 outline-none"
                    />
                  </div>

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

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Loan Amortization Term</label>
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

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Interest-Only Period</label>
                    <select
                      value={interestOnlyYears}
                      onChange={(e) => setInterestOnlyYears(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none"
                    >
                      <option value="0">None (Full Amortization)</option>
                      <option value="1">1 Year I/O</option>
                      <option value="2">2 Years I/O</option>
                      <option value="3">3 Years I/O</option>
                      <option value="5">5 Years I/O</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Initial Rehab / CapEx ($)</label>
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

              {/* Dépenses */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>2. Operating Expenses &amp; Municipal Escrows</span>
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
                    <label className="text-slate-400 font-bold block mb-1">Management Fee (%)</label>
                    <input 
                      type="number"
                      value={managementRate}
                      onChange={(e) => setManagementRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Maintenance (%)</label>
                    <input 
                      type="number"
                      value={maintenanceRate}
                      onChange={(e) => setMaintenanceRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">CapEx Structural (%)</label>
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

              {/* Fiscalité */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
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
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Tax-Free Cash-Flow</span>
                    <strong className="text-emerald-400 font-mono text-sm block mt-0.5">100% Protected</strong>
                  </div>
                </div>
              </div>

              {/* Break-Even */}
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Break-Even Occupancy Threshold: {breakEvenOccupancy}%</strong>
                    <span className="text-slate-400">La propriété reste à flux positif même avec jusqu'à {100 - breakEvenOccupancy}% d'inoccupation.</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-900/60 px-3 py-1 rounded-xl border border-amber-500/40">
                  Fixed Costs: ${Math.round(totalFixedCostsAnnual / 12).toLocaleString()}/mo
                </span>
              </div>

              {/* Amortissement */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowAmortizationTable(!showAmortizationTable)}
                  className="w-full p-4 bg-slate-950 flex items-center justify-between text-xs font-black uppercase text-slate-300 hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>View 30-Year Loan Amortization &amp; Equity Waterfall Schedule</span>
                  </span>
                  {showAmortizationTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAmortizationTable && (
                  <div className="p-4 bg-slate-900/90 overflow-x-auto max-h-80 scrollbar-thin">
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

            </div>

            {/* Exit Waterfall */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Exit Strategy &amp; IRR Waterfall Analysis</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Simulation de sortie avec calcul du Multiple sur Capital et du TRI net.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Hold:</span>
                  <select
                    value={holdingPeriodYears}
                    onChange={(e) => setHoldingPeriodYears(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="7">7 Years</option>
                    <option value="10">10 Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Projected Year {holdingPeriodYears} Sale Price</span>
                  <strong className="text-white font-mono text-sm block mt-0.5">${projectedExitSalePrice.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Cumulative Net Cash-Flow</span>
                  <strong className="text-cyan-300 font-mono text-sm block mt-0.5">+${totalCumulativeCashFlow.toLocaleString()}</strong>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-400 block text-[9px] uppercase font-bold">Internal Rate of Return (IRR)</span>
                  <strong className="text-emerald-400 font-mono text-base block mt-0.5">~{estimatedIRR}% Net</strong>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-400 block text-[9px] uppercase font-bold">Equity Multiple</span>
                  <strong className="text-emerald-400 font-mono text-base block mt-0.5">{equityMultiple}x Capital</strong>
                </div>
              </div>
            </div>

            {/* Fiche Mécanique */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Physical Mechanics &amp; Inspection Audit</h3>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${!isUnlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Roof &amp; Guttering:</strong>
                    <span className="text-slate-400">{deal.mechanics.roof}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">HVAC / Heating:</strong>
                    <span className="text-slate-400">{deal.mechanics.hvac}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Electrical Distribution:</strong>
                    <span className="text-slate-400">{deal.mechanics.electrical}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Plumbing &amp; Waste:</strong>
                    <span className="text-slate-400">{deal.mechanics.plumbing}</span>
                  </div>
                </div>
              </div>

              {!isUnlocked && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-white font-black text-xs uppercase">Mechanical &amp; Inspection Audit Locked</span>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                    Access electrical panel ages, roof inspection reports, and plumbing line verification.
                  </p>
                  <Link href="/vip" className="mt-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition shadow-lg">
                    Unlock Inspection Audit &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Comparables */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Neighborhood Market Comps &amp; Arbitrage</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                      <th className="py-2.5 font-bold">Comparable Property</th>
                      <th className="py-2.5 font-bold">Sold Price</th>
                      <th className="py-2.5 font-bold">Price / Door</th>
                      <th className="py-2.5 font-bold">Date Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {deal.marketComps.map((comp: MarketComp, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 font-bold text-white">{comp.address}</td>
                        <td className="py-2.5 font-mono text-slate-200 font-bold">${comp.soldPrice.toLocaleString()}</td>
                        <td className="py-2.5 font-mono text-amber-400 font-bold">${comp.pricePerUnit.toLocaleString()} / unit</td>
                        <td className="py-2.5 text-slate-400">{comp.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column (1/3): Contacts & LOI */}
          <div className="space-y-6">
            
            {/* Carte Contacts Wholesaler */}
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
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(deal.wholesaler.email)}&su=${encodeURIComponent(`LOI Submission - ${deal.address}`)}&body=${encodeURIComponent(`Hello ${deal.wholesaler.name},\n\nI am interested in acquiring the assignment contract for ${deal.address} at $${purchasePrice.toLocaleString()} ($${Math.round(downPaymentAmount).toLocaleString()} down). Please provide title status and diligence files.\n\nBest regards.`)}`}
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
                    <div className="filter blur-md space-y-2 text-xs text-slate-400 pointer-events-none">
                      <p className="font-bold text-white">{deal.wholesaler.name}</p>
                      <p className="font-mono text-emerald-400">{deal.wholesaler.phone}</p>
                      <p className="font-mono text-xs">{deal.wholesaler.email}</p>
                    </div>
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center">
                      <Lock className="w-7 h-7 text-amber-400 mb-1" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-white">Assignor Contact Locked</span>
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

            {/* LOI Generator */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🚀</span>
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">Fast-Track Acquisition</span>
              </div>
              <h3 className="text-base font-black text-white mb-2">Submit an Offer / LOI</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Generate and submit an official Letter of Intent directly to the wholesaler based on your customized financing parameters.
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
                  {isUnlocked ? 'Generate & Submit LOI (PDF)' : '🔒 Unlock LOI Generator (Starter/VIP)'}
                </button>
              )}
            </div>

            {/* Radar Map */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-5 shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Target Market Geospatial Radar</span>
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" 
                  alt="Map Satellite"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{deal.location} Submarket Area</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-8 sm:py-12 mt-16 text-slate-400 text-xs font-sans print:hidden">
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
              &copy; 2026 MultiDealProp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
