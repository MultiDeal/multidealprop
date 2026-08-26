'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DealDetailsPage() {
  const params = useParams();
  const [userTier, setUserTier] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  // ÉTATS DU CALCULATEUR D'HYPOTHÈQUE INTERACTIF
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isVip = localStorage.getItem('multideal_vip') === 'true';
      const tier = localStorage.getItem('multideal_tier') || (isVip ? 'starter' : null);
      setUserTier(tier);

      // Préchargement de la bibliothèque jsPDF
      if (!(window as any).jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const isUnlocked = userTier !== null;
  const isElite = userTier === 'vip';
  const dealId = (params?.id as string) || 'OH-CLE-44120-01';

  const deal = {
    id: dealId,
    title: 'Renovated 3-Bed Brick Home - Section 8 Ready',
    tag: 'High-Cap Underwritten Asset',
    streetAddress: '12408 St Clair Ave',
    cityStateZip: 'Cleveland, OH 44120',
    priceNumeric: 89500,
    price: '$89,500',
    arv: '$115,000',
    capRate: '12.04%',
    monthlyRentNumeric: 1250,
    monthlyRent: '$1,250',
    grossAnnualRent: '$15,000',
    grossYield: '16.76%',
    noiNumeric: 10780,
    noi: '$10,780',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    wholesaler: {
      name: 'Apex Wholesale Capital LLC',
      phone: '+1 (216) 485-9921',
      email: 'acquisitions@apexwholesaledesk.com',
      assignmentFee: '$5,000 (included in purchase price)',
      titleCompany: 'First Choice Title & Escrow (EMD: $2,500)',
    },
    proforma: {
      grossIncome: 15000,
      vacancy: 750,
      effectiveGrossIncome: 14250,
      taxes: 1420,
      insurance: 850,
      management: 1200,
      maintenance: 750,
      waterSewer: 780,
      noi: 10780,
    },
    specs: {
      yearBuilt: 1952,
      rehabYear: 2024,
      sqft: '1,340 sqft',
      lotSize: '4,800 sqft',
      roof: 'Architectural Shingles (Installed 2021)',
      electrical: '100A Breaker Panel (City Code Certified)',
      plumbing: 'Full PEX Supply & PVC Waste Stacks',
      hvac: 'High-Efficiency Forced Air Gas (2022)',
      waterHeater: '40-Gallon Gas (Late 2023)',
      tenantTenure: '2.5+ Years (Cuyahoga County PHA Voucher - Zero Default)',
    }
  };

  // CALCULS DYNAMIQUES EN TEMPS RÉEL (CALCULATEUR INTERACTIF)
  const calcResults = useMemo(() => {
    const purchasePrice = deal.priceNumeric;
    const downPaymentAmount = (purchasePrice * downPaymentPct) / 100;
    const loanAmount = purchasePrice - downPaymentAmount;
    const estimatedClosingCosts = purchasePrice * 0.03; // ~3%
    const totalCashInvested = downPaymentAmount + estimatedClosingCosts;

    let monthlyDebtService = 0;
    let annualDebtService = 0;

    if (loanAmount > 0 && interestRate > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = loanTermYears * 12;
      monthlyDebtService =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
      annualDebtService = monthlyDebtService * 12;
    }

    const netAnnualCashFlow = deal.noiNumeric - annualDebtService;
    const netMonthlyCashFlow = netAnnualCashFlow / 12;
    const cashOnCashReturn = totalCashInvested > 0 ? (netAnnualCashFlow / totalCashInvested) * 100 : 0;
    const dscr = annualDebtService > 0 ? deal.noiNumeric / annualDebtService : 99.9;

    return {
      downPaymentAmount,
      loanAmount,
      totalCashInvested,
      monthlyDebtService: Math.round(monthlyDebtService),
      annualDebtService: Math.round(annualDebtService),
      netAnnualCashFlow: Math.round(netAnnualCashFlow),
      netMonthlyCashFlow: Math.round(netMonthlyCashFlow),
      cashOnCashReturn: cashOnCashReturn.toFixed(2),
      dscr: dscr.toFixed(2),
    };
  }, [deal.priceNumeric, deal.noiNumeric, downPaymentPct, interestRate, loanTermYears]);

  // GÉNÉRATEUR DE FICHIER PDF GRAPHIQUE PROFESSIONNEL
  const handleDownloadPdf = () => {
    try {
      setDownloading(true);
      const { jsPDF } = (window as any).jspdf || {};

      if (!jsPDF) {
        window.open(`/deals/${dealId}/print`, '_blank');
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      doc.setFillColor(7, 11, 20);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('Multi', 12, 16);
      doc.setTextColor(16, 185, 129);
      doc.text('Deal', 25, 16);
      doc.setTextColor(255, 255, 255);
      doc.text('Prop', 38, 16);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(56, 189, 248);
      doc.text('| Real Estate Intelligence Desk', 52, 16);

      if (isElite) {
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(138, 10, 60, 8, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(7, 11, 20);
        doc.text('✓ VIP ELITE AUDIT CERTIFIED', 141, 15.5);
      } else {
        doc.setFillColor(56, 189, 248);
        doc.roundedRect(144, 10, 54, 8, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(7, 11, 20);
        doc.text('✓ PRO STARTER AUDIT', 148, 15.5);
      }

      doc.setDrawColor(30, 41, 59);
      doc.line(12, 22, 198, 22);

      doc.setFillColor(13, 21, 39);
      doc.setDrawColor(30, 41, 59);
      doc.roundedRect(12, 26, 186, 26, 3, 3, 'FD');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(56, 189, 248);
      doc.text('HIGH-CAP UNDERWRITTEN ASSET • SECTION 8 READY', 16, 33);

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(deal.title, 16, 40);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text(`Exact Address: ${deal.streetAddress}, ${deal.cityStateZip}`, 16, 46);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184);
      doc.text('OFF-MARKET ASKING PRICE', 145, 33);

      doc.setFontSize(15);
      doc.setTextColor(16, 185, 129);
      doc.text(deal.price, 145, 41);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Est. ARV: ${deal.arv}`, 145, 46);

      const kpis = [
        { lbl: 'CAP RATE', val: deal.capRate, color: [16, 185, 129] },
        { lbl: 'CASH-ON-CASH', val: `${calcResults.cashOnCashReturn}%`, color: [245, 158, 11] },
        { lbl: 'GROSS RENT', val: `${deal.monthlyRent} / mo`, color: [56, 189, 248] },
        { lbl: 'ANNUAL NOI', val: `${deal.noi} / yr`, color: [255, 255, 255] },
      ];

      kpis.forEach((kpi, idx) => {
        const x = 12 + idx * 47.5;
        doc.setFillColor(13, 21, 39);
        doc.roundedRect(x, 56, 43.5, 16, 2, 2, 'FD');

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(148, 163, 184);
        doc.text(kpi.lbl, x + 4, 62);

        doc.setFontSize(10.5);
        doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
        doc.text(kpi.val, x + 4, 68);
      });

      doc.setFillColor(13, 21, 39);
      doc.roundedRect(12, 76, 90, 118, 3, 3, 'FD');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('12-MONTH PRO-FORMA P&L', 16, 83);
      doc.setDrawColor(30, 41, 59);
      doc.line(16, 85, 98, 85);

      const pnlRows = [
        ['Gross Rent ($1,250 x 12)', `$${deal.proforma.grossIncome.toLocaleString()}`, [255, 255, 255]],
        ['(-) Vacancy Loss (5%)', `-$${deal.proforma.vacancy.toLocaleString()}`, [248, 113, 113]],
        ['(=) Effective Gross Income', `$${deal.proforma.effectiveGrossIncome.toLocaleString()}`, [56, 189, 248]],
        ['• Property Taxes', `-$${deal.proforma.taxes.toLocaleString()}`, [203, 213, 225]],
        ['• Insurance (Hazard)', `-$${deal.proforma.insurance.toLocaleString()}`, [203, 213, 225]],
        ['• Management Fee (8%)', `-$${deal.proforma.management.toLocaleString()}`, [203, 213, 225]],
        ['• CapEx / Maintenance', `-$${deal.proforma.maintenance.toLocaleString()}`, [203, 213, 225]],
        ['• Owner Water Escrow', `-$${deal.proforma.waterSewer.toLocaleString()}`, [203, 213, 225]],
        ['(=) NET OPERATING INCOME', `$${deal.proforma.noi.toLocaleString()} / yr`, [16, 185, 129]],
        [`Leveraged Cashflow (${downPaymentPct}% Down)`, `+$${calcResults.netAnnualCashFlow.toLocaleString()} / yr`, [245, 158, 11]],
      ];

      let yPnl = 92;
      pnlRows.forEach((r) => {
        doc.setFontSize(7.2);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(r[0] as string, 16, yPnl);

        doc.setFont('helvetica', 'bold');
        const c = r[2] as number[];
        doc.setTextColor(c[0], c[1], c[2]);
        doc.text(r[1] as string, 98, yPnl, { align: 'right' });
        yPnl += 7.5;
      });

      doc.setFillColor(11, 25, 46);
      doc.roundedRect(16, 168, 82, 20, 2, 2, 'F');
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(56, 189, 248);
      doc.text('SECTION 8 DIRECT DEPOSIT GUARANTEE', 19, 173);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text('100% of $1,250/mo direct deposited by Cuyahoga PHA.', 19, 178);
      doc.text('Tenant tenure: 2.5 yrs with 0 default history.', 19, 183);

      doc.setFillColor(13, 21, 39);
      doc.roundedRect(108, 76, 90, 118, 3, 3, 'FD');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('PHYSICAL ASSET & MECHANICALS', 112, 83);
      doc.line(112, 85, 194, 85);

      const specs = [
        ['Year Built / Rehab:', `${deal.specs.yearBuilt} / Full Rehab ${deal.specs.rehabYear}`],
        ['Layout / Sqft:', `3 Beds | 1 Bath | ${deal.specs.sqft}`],
        ['Roof System:', deal.specs.roof],
        ['Electrical Panel:', deal.specs.electrical],
        ['Plumbing Lines:', deal.specs.plumbing],
        ['Heating / HVAC:', deal.specs.hvac],
        ['Hot Water Tank:', deal.specs.waterHeater],
      ];

      let ySpec = 92;
      specs.forEach((s) => {
        doc.setFontSize(7.2);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(s[0], 112, ySpec);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(s[1], 194, ySpec, { align: 'right' });
        ySpec += 7.5;
      });

      doc.setFillColor(16, 185, 129, 0.1);
      doc.setDrawColor(16, 185, 129);
      doc.roundedRect(112, 146, 82, 42, 2, 2, 'FD');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('DIRECT WHOLESALER & ASSIGNMENT DESK', 116, 152);

      doc.setFontSize(7);
      doc.setTextColor(203, 213, 225);
      doc.text(`Entity: ${deal.wholesaler.name}`, 116, 158);
      doc.setTextColor(16, 185, 129);
      doc.text(`Phone: ${deal.wholesaler.phone}`, 116, 164);
      doc.setTextColor(56, 189, 248);
      doc.text(`Email: ${deal.wholesaler.email}`, 116, 170);
      doc.setTextColor(148, 163, 184);
      doc.text(`Fee: ${deal.wholesaler.assignmentFee}`, 116, 176);
      doc.text(`Title: ${deal.wholesaler.titleCompany}`, 116, 182);

      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(
        `CONFIDENTIALITY NOTICE: Proprietary underwriting compiled for MultiDealProp ${isElite ? 'VIP Elite' : 'Pro Starter'} members.`,
        12,
        202
      );
      doc.text('All Cap Rates, cashflows, and estimates must be independently verified during the 5-day inspection period.', 12, 206);

      doc.save(`MultiDealProp_Underwriting_${dealId}.pdf`);
    } catch (err: any) {
      window.open(`/deals/${dealId}/print`, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Badges */}
        <div className="flex items-center justify-between">
          <Link
            href="/deals"
            className="text-slate-400 hover:text-white transition flex items-center gap-2 text-sm font-medium"
          >
            ← Back to Deals Feed
          </Link>

          {!isUnlocked ? (
            <Link
              href="/vip"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full shadow-lg transition"
            >
              ⚡ Upgrade Plan ($29 - $49)
            </Link>
          ) : userTier === 'starter' ? (
            <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-full flex items-center gap-1.5">
              ✓ Pro Starter Active ($29/mo)
            </span>
          ) : (
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-full flex items-center gap-1.5">
              ✓ VIP Elite Active ($49/mo)
            </span>
          )}
        </div>

        {/* Titre & Prix */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
              🛡️ {deal.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {deal.title}
            </h1>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm sm:text-base">
              <span className="text-emerald-400">📍</span>
              {isUnlocked ? (
                <span className="text-white font-semibold underline decoration-emerald-500/50">
                  {deal.streetAddress}, {deal.cityStateZip}
                </span>
              ) : (
                <span>
                  <span className="blur-sm select-none text-slate-500">12408 St Clair Ave</span>{' '}
                  {deal.cityStateZip}{' '}
                  <span className="text-amber-400 font-medium text-xs bg-amber-400/10 px-2 py-0.5 rounded ml-1">
                    (Exact Street Locked 🔒)
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-5 text-right min-w-[240px]">
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">
              Off-Market Asking Price
            </p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {deal.price}
            </p>
            <p className="text-xs text-slate-500 mt-1">Est. ARV: <span className="text-slate-300 font-semibold">{deal.arv}</span></p>
          </div>
        </div>

        {/* Grille Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne de Gauche : Photo, KPIs, Calculateur Interactif & Investment Synopsis */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Photo principale */}
            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Barre de métriques financières recalculées en direct */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0d1527] border border-slate-800 rounded-2xl p-5 text-center">
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Cap Rate</p>
                <p className="text-2xl font-black text-emerald-400">{deal.capRate}</p>
              </div>
              <div className="border-l border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Cash-on-Cash</p>
                <p className="text-2xl font-black text-amber-400">{calcResults.cashOnCashReturn}%</p>
              </div>
              <div className="border-l border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Gross Rent</p>
                <p className="text-2xl font-black text-sky-400">{deal.monthlyRent}</p>
              </div>
              <div className="border-l border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Annual NOI</p>
                <p className="text-2xl font-black text-white">{deal.noi}</p>
              </div>
            </div>

            {/* MODULE 2 : CALCULATEUR D'HYPOTHÈQUE & CASH-ON-CASH INTERACTIF */}
            <div className="bg-[#0d1527] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    🧮 Interactive Leveraged Cash-Flow & Mortgage Modeler
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust financing assumptions to dynamically model your exact return on equity.
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase self-start sm:self-auto">
                  Live Calculator
                </span>
              </div>

              {/* Contrôles du Calculateur */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* 1. Down Payment Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Down Payment</span>
                    <span className="text-emerald-400 font-bold">{downPaymentPct}% (${calcResults.downPaymentAmount.toLocaleString()})</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <button onClick={() => setDownPaymentPct(20)} className="hover:text-emerald-400">20%</button>
                    <button onClick={() => setDownPaymentPct(25)} className="hover:text-emerald-400">25%</button>
                    <button onClick={() => setDownPaymentPct(100)} className="hover:text-emerald-400">100% Cash</button>
                  </div>
                </div>

                {/* 2. Interest Rate Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Interest Rate</span>
                    <span className="text-sky-400 font-bold">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4.5"
                    max="11.5"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>6.5%</span>
                    <span>7.5%</span>
                    <span>8.5%</span>
                  </div>
                </div>

                {/* 3. Loan Term Control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Loan Term</span>
                    <span className="text-amber-400 font-bold">{loanTermYears} Years</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setLoanTermYears(30)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        loanTermYears === 30
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-[#131d36] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      30 Years
                    </button>
                    <button
                      onClick={() => setLoanTermYears(15)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        loanTermYears === 15
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-[#131d36] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      15 Years
                    </button>
                  </div>
                </div>

              </div>

              {/* Résultats Dynamiques Calculés */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#131d36] border border-slate-800 rounded-2xl p-4 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Cash In</p>
                  <p className="text-base sm:text-lg font-black text-white">${calcResults.totalCashInvested.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Down + 3% Est. Closing</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Mortgage P&I</p>
                  <p className="text-base sm:text-lg font-black text-rose-400">${calcResults.monthlyDebtService}/mo</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">${calcResults.annualDebtService.toLocaleString()}/yr</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Net Cash Flow</p>
                  <p className="text-base sm:text-lg font-black text-emerald-400">+${calcResults.netMonthlyCashFlow}/mo</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">+${calcResults.netAnnualCashFlow.toLocaleString()}/yr</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Cash-on-Cash</p>
                  <p className="text-base sm:text-lg font-black text-amber-400">{calcResults.cashOnCashReturn}%</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">DSCR: {calcResults.dscr}x</p>
                </div>
              </div>
            </div>

            {/* SECTION INVESTMENT SYNOPSIS COMPLÈTE */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    📊 Comprehensive Investment Synopsis & Pro-Forma
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Conservative 12-month expense audit, physical mechanicals, and government rent roll.
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase">
                  Institutional Grade
                </span>
              </div>

              {/* 1. Tableau Pro-Forma (P&L 12 Mois) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>💰</span> 12-Month Pro-Forma Cash Flow Breakdown
                </h3>
                
                <div className="bg-[#131d36]/80 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-sm">
                  <div className="flex justify-between text-slate-300 pb-2 border-b border-slate-800/80">
                    <span>(+) Gross Scheduled Annual Rent (12 x $1,250)</span>
                    <span className="font-bold text-white">${deal.proforma.grossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-300 pb-2 border-b border-slate-800/80">
                    <span>(-) Economic Vacancy Reserve (5.0%)</span>
                    <span>-${deal.proforma.vacancy.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sky-300 font-bold pb-2 border-b border-slate-800/80">
                    <span>(=) Effective Gross Income (EGI)</span>
                    <span>${deal.proforma.effectiveGrossIncome.toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-slate-400 font-sans uppercase font-bold pt-2">Operating Expenses:</div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Real Estate Property Taxes (Cuyahoga County)</span>
                    <span className="text-slate-300">-${deal.proforma.taxes.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Hazard & Liability Property Insurance</span>
                    <span className="text-slate-300">-${deal.proforma.insurance.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Professional Property Management Fee (8%)</span>
                    <span className="text-slate-300">-${deal.proforma.management.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>• Maintenance & Structural CapEx Reserve (5%)</span>
                    <span className="text-slate-300">-${deal.proforma.maintenance.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs pl-4 pb-2 border-b border-slate-800/80">
                    <span>• Owner Water/Sewer Escrow Contribution ($65/mo)</span>
                    <span className="text-slate-300">-${deal.proforma.waterSewer.toLocaleString()} / yr</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 font-bold text-base pt-1 pb-2 border-b border-slate-800">
                    <span className="font-sans">(=) Net Operating Income (NOI)</span>
                    <span>${deal.proforma.noi.toLocaleString()} / yr</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-xs pl-4">
                    <span>(-) Dynamic Mortgage Debt Service ({downPaymentPct}% Down @ {interestRate}%)</span>
                    <span className="text-rose-400">-${calcResults.annualDebtService.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-bold text-sm pt-1">
                    <span className="font-sans">(=) Net Leveraged Cash Flow</span>
                    <span>+${calcResults.netAnnualCashFlow.toLocaleString()} / yr (+${calcResults.netMonthlyCashFlow}/mo)</span>
                  </div>
                </div>
              </div>

              {/* 2. Audit physique */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>🔨</span> Asset Condition & Mechanicals Audit
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">Roof System</span>
                    <p className="text-white font-medium">{deal.specs.roof}</p>
                  </div>
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">Electrical Panel</span>
                    <p className="text-white font-medium">{deal.specs.electrical}</p>
                  </div>
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">Plumbing Lines</span>
                    <p className="text-white font-medium">{deal.specs.plumbing}</p>
                  </div>
                  <div className="bg-[#131d36]/60 border border-slate-800 p-4 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase">HVAC & Heating</span>
                    <p className="text-white font-medium">{deal.specs.hvac}</p>
                  </div>
                </div>
              </div>

              {/* 3. Garantie Section 8 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>🏛️</span> Tenant Profile & Government Subsidy Status
                </h3>

                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
                  <p className="leading-relaxed">
                    <strong className="text-white">Subsidy Direct Deposit:</strong> 100% of the $1,250 monthly rent is deposited directly by the <strong>Cuyahoga County Public Housing Authority (PHA)</strong> on the 1st of each month.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Tenant Longevity:</strong> Current tenant has resided in the property for <strong>{deal.specs.tenantTenure}</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Colonne Droite : Téléchargement PDF & Coordonnées Vendeur */}
          <div className="space-y-6">
            
            {/* Box Téléchargement PDF */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                📄 Institutional Due Diligence Vault
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Audit Report & Rent Roll</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Download verified institutional PDF pack with complete pro-forma, cap rates, and direct contract assignment.
              </p>

              {isUnlocked ? (
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-4 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  {downloading ? 'Generating Official PDF...' : `📥 Download ${isElite ? 'VIP Elite' : 'Pro Starter'} PDF Pack`}
                </button>
              ) : (
                <Link
                  href="/vip"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#131d36] hover:bg-[#1a2747] text-slate-300 border border-slate-700 font-semibold py-3.5 px-4 rounded-xl transition text-sm"
                >
                  🔒 Unlock Pro PDF Pack (Basic/VIP)
                </Link>
              )}
            </div>

            {/* Box Desk Vendeur / Grossiste */}
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Direct Wholesaler Desk
                </h3>
                {isUnlocked ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                    🔒 LOCKED
                  </span>
                )}
              </div>

              {isUnlocked ? (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Wholesaler Entity</p>
                    <p className="text-white font-bold text-base">{deal.wholesaler.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Direct Phone</p>
                    <a
                      href={`tel:${deal.wholesaler.phone}`}
                      className="text-emerald-400 font-extrabold hover:underline"
                    >
                      {deal.wholesaler.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Direct Email</p>
                    <a
                      href={`mailto:${deal.wholesaler.email}`}
                      className="text-sky-400 hover:underline text-sm break-all"
                    >
                      {deal.wholesaler.email}
                    </a>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Terms: {deal.wholesaler.assignmentFee}</p>
                    <p className="text-xs text-slate-400">Escrow: {deal.wholesaler.titleCompany}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-[#131d36]/60 rounded-xl space-y-2 select-none filter blur-[4px]">
                    <p className="text-slate-400 text-sm">👤 Apex Wholesaler Capital LLC</p>
                    <p className="text-slate-400 text-sm">📞 +1 (216) 485-0000</p>
                    <p className="text-slate-400 text-sm">✉️ acquisitions@dealdesk.com</p>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Unlock exact address & seller assignment direct contact starting at $29/mo.
                  </p>

                  <Link
                    href="/vip"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg text-sm"
                  >
                    ⚡ Unlock Contacts Now
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
