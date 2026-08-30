'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
Building2,
MapPin,
ShieldCheck,
Zap,
ArrowLeft,
Lock,
Unlock,
Calculator,
FileSpreadsheet,
Coins,
TrendingUp,
Sliders,
DollarSign,
Printer,
Flame,
CheckCircle2,
Wrench,
Compass,
BarChart3,
FileText,
Percent,
ChevronDown,
ChevronUp,
Layers,
Activity,
AlertTriangle
} from 'lucide-react';

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

const DEALS_DATABASE: Record<string, any> = {
'1': {
id: '1',
title: 'Turnkey Multi-Family Duplex - Fully Leased',
location: 'Cleveland, OH',
address: '1428-1436 E 120th St, Cleveland, OH 44106',
apn: '120-14-082',
price: 98000,
arv: 145000,
units: 2,
yearBuilt: '1924 (Updated 2021)',
monthlyRent: 1950,
otherIncome: 50,
vacancyRate: 5,
taxes: 1420,
insurance: 850,
managementRate: 8,
maintenanceRate: 5,
capexRate: 5,
waterSewer: 780,
images: [
'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80'
],
mechanics: {
roof: 'Architectural Shingle (Replaced 2021)',
hvac: '2x High-Efficiency Forced Air Furnaces (2020)',
electrical: 'Separate 100A Breaker Panels (No Knob & Tube)',
plumbing: 'PEX Supply Lines & PVC Drain Stacks',
foundation: 'Poured Concrete & Brick Piers (Dry / Inspected)'
},
rentRoll: [
{ unitNumber: 'Unit 1 (Lower)', type: '2 Bed / 1 Bath', currentRent: 950, marketRent: 1150, leaseStatus: 'Active (M2M)', squareFeet: 950 },
{ unitNumber: 'Unit 2 (Upper)', type: '2 Bed / 1 Bath', currentRent: 1000, marketRent: 1150, leaseStatus: 'Leased thru Dec 2026', squareFeet: 950 }
],
marketComps: [
{ address: '1380 E 120th St', soldPrice: 132000, units: 2, pricePerUnit: 66000, date: 'May 2026' },
{ address: '1452 E 118th St', soldPrice: 148000, units: 2, pricePerUnit: 74000, date: 'July 2026' },
{ address: '1210 Superior Ave', soldPrice: 155000, units: 2, pricePerUnit: 77500, date: 'Aug 2026' }
],
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
arv: 920000,
units: 12,
yearBuilt: '1974 (Brick)',
monthlyRent: 9600,
otherIncome: 350,
vacancyRate: 6,
taxes: 8400,
insurance: 4200,
managementRate: 8,
maintenanceRate: 5,
capexRate: 5,
waterSewer: 3600,
images: [
'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
],
mechanics: {
roof: 'Pitched Metal Roof (Refurbished 2022)',
hvac: 'Individual PTAC Units in each suite',
electrical: '12 Separate Meters + Common House Meter',
plumbing: 'Copper Supply with Individual Shutoffs',
foundation: 'Slab on Grade (Structural Soundness Verified)'
},
rentRoll: [
{ unitNumber: 'Units 1-4 (Ground)', type: '1 Bed / 1 Bath', currentRent: 3200, marketRent: 4000, leaseStatus: '100% Occupied', squareFeet: 2400 },
{ unitNumber: 'Units 5-8 (Floor 2)', type: '1 Bed / 1 Bath', currentRent: 3200, marketRent: 4000, leaseStatus: '100% Occupied', squareFeet: 2400 },
{ unitNumber: 'Units 9-12 (Floor 3)', type: '2 Bed / 1 Bath', currentRent: 3200, marketRent: 4600, leaseStatus: 'Occupied (Value-Add)', squareFeet: 3000 }
],
marketComps: [
{ address: '3150 Jackson Ave', soldPrice: 850000, units: 12, pricePerUnit: 70833, date: 'Apr 2026' },
{ address: '3420 Summer Ave', soldPrice: 910000, units: 12, pricePerUnit: 75833, date: 'Jun 2026' }
],
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
arv: 420000,
units: 5,
yearBuilt: '1938',
monthlyRent: 4800,
otherIncome: 120,
vacancyRate: 5,
taxes: 3800,
insurance: 2100,
managementRate: 8,
maintenanceRate: 5,
capexRate: 5,
waterSewer: 1600,
images: [
'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
],
mechanics: {
roof: 'EPDM Commercial Membrane (2019)',
hvac: 'Separate Rooftop Package Unit for Retail + Split A/C',
electrical: '5 Meters (4 Residential + 1 Commercial 3-Phase)',
plumbing: 'Updated Copper / Cast Iron Main',
foundation: 'Full Concrete Basement'
},
rentRoll: [
{ unitNumber: 'Retail Suite A', type: 'Commercial Retail', currentRent: 1800, marketRent: 2200, leaseStatus: 'NNN 3-Year Lease', squareFeet: 1800 },
{ unitNumber: 'Apt 1-4 (Upper)', type: '1 Bed / 1 Bath', currentRent: 3000, marketRent: 3800, leaseStatus: 'Fully Leased', squareFeet: 2600 }
],
marketComps: [
{ address: '8200 Grand River', soldPrice: 380000, units: 4, pricePerUnit: 95000, date: 'Feb 2026' },
{ address: '8910 Dexter Ave', soldPrice: 415000, units: 5, pricePerUnit: 83000, date: 'May 2026' }
],
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
arv: 210000,
units: 4,
yearBuilt: '1928',
monthlyRent: 2400,
otherIncome: 80,
vacancyRate: 5,
taxes: 1950,
insurance: 1100,
managementRate: 8,
maintenanceRate: 5,
capexRate: 5,
waterSewer: 960,
images: [
'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
],
mechanics: {
roof: 'Asphalt Shingle (2018)',
hvac: '4x Gas Wall Heaters + Window A/C',
electrical: '4 Separate 60A Panels',
plumbing: 'Galvanized with PEX updates',
foundation: 'Solid Brick Foundation'
},
rentRoll: [
{ unitNumber: 'Units 1-4', type: '1 Bed / 1 Bath (4x)', currentRent: 2400, marketRent: 3200, leaseStatus: '3 Leased / 1 Vacant', squareFeet: 2800 }
],
marketComps: [
{ address: '10100 St Clair', soldPrice: 195000, units: 4, pricePerUnit: 48750, date: 'Mar 2026' }
],
wholesaler: {
name: 'Buckeye Equity Flow (Marcus Vance)',
phone: '(216) 555-0194',
email: 'acquisitions@apexwholesale.com',
}
}
};

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
const resolvedParams = use(params);
const dealId = resolvedParams.id || '1';
const deal = DEALS_DATABASE[dealId] || DEALS_DATABASE['1'];

// Statut Membre - Verrouillé par défaut pour les non-abonnés
const [isUnlocked, setIsUnlocked] = useState(false);
const [userTier, setUserTier] = useState<string | null>(null);

// Galerie photos
const dealImages = deal.images || [deal.imageUrl];
const [activeImageIndex, setActiveImageIndex] = useState(0);

// Stratégie d'Acquisition
const [strategy, setStrategy] = useState<'BUY_HOLD' | 'BRRRR' | 'FLIP'>('BUY_HOLD');

// Paramètres de Financement
const [purchasePrice, setPurchasePrice] = useState(deal.price);
const [downPercent, setDownPercent] = useState(20);
const [interestRate, setInterestRate] = useState(7.25);
const [loanTermYears, setLoanTermYears] = useState(30);
const [interestOnlyYears, setInterestOnlyYears] = useState(0);
const [closingCostPercent, setClosingCostPercent] = useState(2.5);
const [rehabBudget, setRehabBudget] = useState(0);

// Revenus
const [monthlyRent, setMonthlyRent] = useState(deal.monthlyRent);
const [otherMonthlyIncome, setOtherMonthlyIncome] = useState(deal.otherIncome || 0);
const [vacancyRate, setVacancyRate] = useState(deal.vacancyRate || 5);

// Dépenses Opérationnelles
const [annualTaxes, setAnnualTaxes] = useState(deal.taxes);
const [annualInsurance, setAnnualInsurance] = useState(deal.insurance);
const [managementRate, setManagementRate] = useState(deal.managementRate || 8);
const [maintenanceRate, setMaintenanceRate] = useState(deal.maintenanceRate || 5);
const [capexRate, setCapexRate] = useState(deal.capexRate || 5);
const [annualUtilities, setAnnualUtilities] = useState(deal.waterSewer || 0);

// Modélisation de Sortie
const [holdingPeriodYears, setHoldingPeriodYears] = useState(5);
const [exitCapRate, setExitCapRate] = useState(7.5);
const [annualAppreciation, setAnnualAppreciation] = useState(3.0);
const [annualRentGrowth, setAnnualRentGrowth] = useState(2.5);
const [marginalTaxRate, setMarginalTaxRate] = useState(28);

const [showAmortizationTable, setShowAmortizationTable] = useState(false);
const [loiSubmitted, setLoiSubmitted] = useState(false);

useEffect(() => {
// Vérification prioritaire de l'URL (?tier=starter ou ?tier=vip)
const urlParams = new URLSearchParams(window.location.search);
const tierParam = urlParams.get('tier');

if (tierParam === 'starter' || tierParam === 'vip') {
  localStorage.setItem('multidealprop_tier', tierParam);
  setIsUnlocked(true);
  setUserTier(tierParam);
  return;
}

// Vérification du stockage local
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

// --- MOTEUR DE CALCUL MATHEMATIQUE ---
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
const monthlyOperatingExpenses = totalOperatingExpenses / 12;

const annualNOI = effectiveGrossIncome - totalOperatingExpenses;
const monthlyNOI = annualNOI / 12;
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
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Export Deal Memo (PDF)</span>
          <span className="sm:hidden">PDF</span>
        </button>

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
          <span>{isUnlocked ? deal.address : `${deal.location} (Exact Street Unlocked with Membership)`}</span>
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
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
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
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Export Deal Memo (PDF)</span>
        </button>
      </div>
    </div>

    {/* 2-Column Institutional Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Left Column (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Galerie Photos */}
        <div className="space-y-3">
          <div className="h-72 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
            <img 
              src={dealImages[activeImageIndex]} 
              alt={`${deal.title} - Photo ${activeImageIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 font-bold">
              📷 {activeImageIndex + 1} / {dealImages.length}
            </div>
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
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* HERO BAR : NET CASH FLOW EXCLUSIF (SANS CAP RATE) */}
        <div className="bg-[#0d1527] border border-emerald-500/30 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
              Net Free Cash Flow (Monthly &amp; Annual)
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Flux de trésorerie net après déduction du service de dette (P&amp;I) et de l'ensemble des dépenses d'exploitation.
            </p>
          </div>

          <div className="text-center sm:text-right bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-800/80 min-w-[200px]">
            <span className={`text-2xl sm:text-3xl font-black font-mono block ${monthlyNetCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {monthlyNetCashFlow >= 0 ? '+' : ''}${Math.round(monthlyNetCashFlow).toLocaleString()}/mo
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold block mt-0.5">
              {annualNetCashFlow >= 0 ? '+' : ''}${Math.round(annualNetCashFlow).toLocaleString()} / year
            </span>
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
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
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

          <div className="overflow-x-auto">
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
              Wall St. Model
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

          {/* Ratios & Cap Rate dans le cadre de souscription */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Unleveraged Cap Rate</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">{capRate}%</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Cash-on-Cash Return</span>
              <strong className="text-emerald-400 font-mono text-sm block mt-0.5">{cashOnCash}%</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Annual NOI</span>
              <strong className="text-cyan-300 font-mono text-sm block mt-0.5">${Math.round(annualNOI).toLocaleString()}/yr</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-bold">DSCR Coverage</span>
              <strong className="text-amber-400 font-mono text-sm block mt-0.5">{dscr}x</strong>
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
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Physical Mechanics &amp; Inspection Audit</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
        
        {/* CARTE CONTACTS WHOLESALER : FLOUTÉE SI NON ABONNÉ */}
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
          © 2026 MultiDealProp. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

</div>


);
}
