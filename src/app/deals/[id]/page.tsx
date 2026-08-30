'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

export default function DealDetailPage() {
  const routerParams = useParams();
  const dealId = (typeof routerParams?.id === 'string' ? routerParams.id : Array.isArray(routerParams?.id) ? routerParams.id[0] : '1');
  const deal = DEALS_DATABASE[dealId] || DEALS_DATABASE['1'];

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<string | null>(null);

  const dealImages = deal.images || [deal.imageUrl];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const [strategy, setStrategy] = useState<'BUY_HOLD' | 'BRRRR' | 'FLIP'>('BUY_HOLD');

  const [purchasePrice, setPurchasePrice] = useState<number>(deal.price);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestOnlyYears, setInterestOnlyYears] = useState<number>(0);
  const [closingCostPercent, setClosingCostPercent] = useState<number>(2.5);
  const [rehabBudget, setRehabBudget] = useState<number>(0);

  const [monthlyRent, setMonthlyRent] = useState<number>(deal.monthlyRent);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(deal.otherIncome || 0);
  const [vacancyRate, setVacancyRate] = useState<number>(deal.vacancyRate || 5);

  const [annualTaxes, setAnnualTaxes] = useState<number>(deal.taxes);
  const [annualInsurance, setAnnualInsurance] = useState<number>(deal.insurance);
  const [managementRate, setManagementRate] = useState<number>(deal.managementRate || 8);
  const [maintenanceRate, setMaintenanceRate] = useState<number>(deal.maintenanceRate || 5);
  const [capexRate, setCapexRate] = useState<number>(deal.capexRate || 5);
  const [annualUtilities, setAnnualUtilities] = useState<number>(deal.waterSewer || 0);

  const [holdingPeriodYears, setHoldingPeriodYears] = useState<number>(5);
  const [exitCapRate, setExitCapRate] = useState<number>(7.5);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(3.0);
  const [annualRentGrowth, setAnnualRentGrowth] = useState<number>(2.5);
  const [marginalTaxRate] = useState<number>(28);

  const [showAmortizationTable, setShowAmortizationTable] = useState<boolean>(false);
  const [loiSubmitted, setLoiSubmitted] = useState<boolean>(false);

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

  const downPaymentAmount = (purchasePrice * downPercent) / 10
