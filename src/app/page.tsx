'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Filter, 
  Search,
  ArrowRight,
  Sparkles,
  PlusCircle
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  cap_rate: number;
  monthly_rent_estimate: number;
  gross_yield: number;
  units_count: number;
  image_url?: string;
  is_verified?: boolean;
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setDeals(data);
      } else {
        // Fallback demo assets
        setDeals([
          {
            id: '1',
            title: 'Turnkey Multi-Family Duplex - Fully Leased',
            city: 'Cleveland',
            state: 'OH',
            zip_code: '44105',
            price: 98000,
            cap_rate: 13.4,
            monthly_rent_estimate: 1950,
            gross_yield: 23.8,
            units_count: 2,
            image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
            is_verified: true
          },
          {
            id: '2',
            title: 'Cash-Flow 4-Plex Value-Add Opportunity',
            city: 'Memphis',
            state: 'TN',
            zip_code: '38114',
            price: 185000,
            cap_rate: 12.8,
            monthly_rent_estimate: 3200,
            gross_yield: 20.7,
            units_count: 4,
            image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
            is_verified: true
          },
          {
            id: '3',
            title: 'Stable Triplex Asset Near Medical Center',
            city: 'Detroit',
            state: 'MI',
            zip_code: '48206',
            price: 142000,
            cap_rate: 14.1,
            monthly_rent_estimate: 2450,
            gross_yield: 20.7,
            units_count: 3,
            image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
            is_verified: true
          }
        ]);
      }
      setLoading(false);
    }

    fetchDeals();
  }, []);

  const filteredDeals = deals.filter(deal => {
    const matchesState = selectedState === 'ALL' || deal.state === selectedState;
    const matchesCap = (deal.cap_rate || 0) >= minCapRate;
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.zip_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesCap && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Header Navigation with Wholesaler / Broker Link */}
      <header className="border-b border-slate-800 bg-[#06080F]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-base sm:text-lg tracking-wider text-white">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
          </div>

          <div className="flex items-center gap-3">
            {/* Wholesaler Submit Deal Button */}
            <Link 
              href="/submit-deal" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Submit Contract</span>
              <span className="sm:hidden">Submit</span>
            </Link>

            {/* VIP Upgrade Button */}
            <Link 
              href="/vip" 
              className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Unlock Deals</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Live High-Yield Multi-Family Inventory
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Off-Market Multi-Family Deals <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Underwritten for Institutional Cash-Flow
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Access high-cap rate duplexes, triplexes, and fourplexes with certified pro-forma analysis, direct wholesaler contacts, and instant due diligence dossiers.
        </p>
      </section>

      {/* 3. Filters & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, title, or zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 flex-1 md:flex-none"
            >
              <option value="ALL">All States</option>
              <option value="OH">Ohio (OH)</option>
              <option value="MI">Michigan (MI)</option>
              <option value="TN">Tennessee (TN)</option>
              <option value="PA">Pennsylvania (PA)</option>
              <option value="FL">Florida (FL)</option>
            </select>

            <select
              value={minCapRate}
              onChange={(e) => setMinCapRate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 flex-1 md:flex-none"
            >
              <option value="0">All Cap Rates</option>
              <option value="10">10%+ Cap Rate</option>
              <option value="12">12%+ Cap Rate</option>
              <option value="14">14%+ Cap Rate</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Deals Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xs font-bold text-emerald-400 animate-pulse">Scanning underwritten inventory...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
            <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No properties matched your specific filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div 
                key={deal.id}
                className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="h-48 relative overflow-hidden bg-slate-950">
                  <img 
                    src={deal.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Underwritten
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300">
                    {deal.units_count} Units
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{deal.city}, {deal.state} {deal.zip_code}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {deal.title}
                    </h3>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-center">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-500">Asking</div>
                      <div className="text-xs font-black text-white font-mono mt-0.5">${deal.price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-500">Cap Rate</div>
                      <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">{deal.cap_rate}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-500">Est. Rent</div>
                      <div className="text-xs font-black text-cyan-300 font-mono mt-0.5">${deal.monthly_rent_estimate?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    href={`/deals/${deal.id}`}
                    className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-black text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Deal &amp; Underwriting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. Institutional Footer */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-12 mt-20 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-white font-black tracking-wider text-sm">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
              <p className="text-slate-500 text-xs mt-1">Institutional Off-Market Multi-Family Pipeline &amp; Underwriting</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
              <Link href="/submit-deal" className="text-emerald-400 hover:underline transition-colors font-bold">+ Submit Deal</Link>
              <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/vip" className="hover:text-emerald-400 transition-colors">Pricing Plans</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Desk</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms &amp; Disclaimer</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
            <p className="text-center md:text-left">
              Disclaimer: MultiDealProp is a data aggregation platform and does not provide real estate brokerage, lending, or legal services.
            </p>
            <p className="flex-shrink-0">
              © {new Date().getFullYear()} MultiDealProp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
