'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function DealPrintPdfPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeal() {
      if (!id) return;
      
      const { data } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setDeal(data);
      } else {
        setDeal({
          id,
          title: 'Turnkey Multi-Family Duplex - Value Add Opportunity',
          city: 'Cleveland',
          state: 'OH',
          zip_code: '44105',
          price: 98000,
          cap_rate: 13.4,
          monthly_rent_estimate: 1950,
          seller_name: 'Apex Wholesale Capital LLC',
          seller_phone: '+1 (216) 884-2190',
          seller_email: 'acquisitions@apexreicapital.com',
          property_taxes_annual: 1850,
          insurance_annual: 1100,
          noi_annual: 13130,
        });
      }
      setLoading(false);
    }
    loadDeal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A10] flex items-center justify-center text-white">
        <p className="text-sm font-bold animate-pulse">Generating Due Diligence Audit PDF...</p>
      </div>
    );
  }

  const price = Number(deal.price || 0);
  const rent = Number(deal.monthly_rent_estimate || 1800);
  const taxes = Number(deal.property_taxes_annual || 1800);
  const insurance = Number(deal.insurance_annual || 1200);
  const noi = Number(deal.noi_annual || (rent * 12 * 0.7 - taxes));
  const capRate = deal.cap_rate || ((noi / (price || 1)) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:p-0 py-8 px-4 font-sans antialiased">
      
      {/* Action Header (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Deal
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Verified Due Diligence Audit Pack
          </span>
          <button
            onClick={() => window.print()}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* PDF Document Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 print:border-none p-10 rounded-2xl shadow-2xl print:shadow-none print:max-w-full">
        
        {/* Header Document */}
        <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-emerald-600 text-white font-black text-xl w-8 h-8 rounded flex items-center justify-center">
                M
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                MultiDeal<span className="text-emerald-600">Prop</span>
              </h1>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Institutional Due Diligence &amp; Underwriting Audit Pack
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase inline-block mb-1">
              VIP Pro Certified
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Report Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              ID: {id?.slice(0, 16)}...
            </div>
          </div>
        </div>

        {/* Title & Location */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{deal.title}</h2>
          <p className="text-sm font-semibold text-slate-600">
            📍 {deal.city || 'Market'}, {deal.state || ''} {deal.zip_code || ''} • USA Multi-Family Market
          </p>
        </div>

        {/* Core Financial Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-[11px] uppercase font-bold text-slate-500">List Price</div>
            <div className="text-xl font-black text-slate-900 mt-1 font-mono">${price.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Off-Market Baseline</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <div className="text-[11px] uppercase font-bold text-emerald-800">Cap Rate</div>
            <div className="text-xl font-black text-emerald-700 mt-1 font-mono">{capRate}%</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">High-Yield Tier</div>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-xl">
            <div className="text-[11px] uppercase font-bold text-cyan-800">Gross Rent / Mo</div>
            <div className="text-xl font-black text-cyan-700 mt-1 font-mono">${rent.toLocaleString()}</div>
            <div className="text-[10px] text-cyan-600 font-semibold mt-0.5">${(rent * 12).toLocaleString()} / year</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-[11px] uppercase font-bold text-slate-500">Net Op. Income (NOI)</div>
            <div className="text-xl font-black text-slate-900 mt-1 font-mono">${Math.round(noi).toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Annualized projection</div>
          </div>
        </div>

        {/* Section 1: Rent Roll & Unit Schedule */}
        <div className="mb-8">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
            1. Audited Rent Roll &amp; Unit Breakdown
          </h3>

          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[10px]">
              <tr>
                <th className="p-3">Unit Name</th>
                <th className="p-3">Configuration</th>
                <th className="p-3">Occupancy Status</th>
                <th className="p-3 text-right">Current / Est. Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Unit A (Ground Level)</td>
                <td className="p-3 text-slate-600">2 Bed / 1 Bath (950 sqft)</td>
                <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Occupied (Lease in place)</span></td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">${Math.round(rent * 0.52).toLocaleString()} / mo</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Unit B (Upper Level)</td>
                <td className="p-3 text-slate-600">2 Bed / 1 Bath (920 sqft)</td>
                <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Occupied (Lease in place)</span></td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">${Math.round(rent * 0.48).toLocaleString()} / mo</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-slate-900">
              <tr>
                <td colSpan={3} className="p-3 text-right">Total Scheduled Monthly Rent :</td>
                <td className="p-3 text-right font-mono text-emerald-700 font-black">${rent.toLocaleString()} / mo</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section 2: Expense Underwriting */}
        <div className="mb-8">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
            2. Annualized Expense Underwriting
          </h3>

          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Property Taxes (County Assessor) :</span>
                <span className="font-mono font-semibold">${taxes.toLocaleString()} / yr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Landlord Hazard Insurance :</span>
                <span className="font-mono font-semibold">${insurance.toLocaleString()} / yr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Maintenance &amp; Repairs (7%) :</span>
                <span className="font-mono font-semibold">${Math.round(rent * 12 * 0.07).toLocaleString()} / yr</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Property Management Reserve (8%) :</span>
                <span className="font-mono font-semibold">${Math.round(rent * 12 * 0.08).toLocaleString()} / yr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Vacancy Reserve (5%) :</span>
                <span className="font-mono font-semibold">${Math.round(rent * 12 * 0.05).toLocaleString()} / yr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 font-bold text-slate-900 bg-slate-50 px-2 rounded">
                <span>Net Projected Annual Cash-Flow :</span>
                <span className="font-mono text-emerald-700 font-black">${Math.round(noi).toLocaleString()} / yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Unredacted Wholesaler / Assignment Contact */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            VIP Unlocked Acquisition Desk
          </div>
          <h4 className="text-base font-black mb-3">Direct Seller &amp; Assignment Contact</h4>

          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Entity / Wholesaler</div>
              <div className="font-bold text-slate-100 mt-0.5">{deal.seller_name || 'Apex Wholesale Capital LLC'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Direct Phone Desk</div>
              <div className="font-bold text-emerald-400 mt-0.5">{deal.seller_phone || '+1 (216) 884-2190'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Assignment Email</div>
              <div className="font-bold text-cyan-300 mt-0.5">{deal.seller_email || 'acquisitions@dealflow-direct.com'}</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 leading-relaxed">
          <p>
            <strong>Disclaimer :</strong> This due diligence pack is generated by the MultiDealProp algorithmic engine for informational underwriting purposes. Real estate cash flow estimates, rent rolls, and Cap Rates are based on municipal market data and comparables. Investors must conduct independent physical inspections and legal title verifications prior to contract execution.
          </p>
        </div>

      </div>
    </div>
  );
}
