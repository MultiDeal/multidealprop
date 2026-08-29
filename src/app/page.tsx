'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Search,
  ArrowRight,
  Sparkles,
  PlusCircle,
  Activity,
  Layers,
  Coins,
  Compass,
  Briefcase,
  LogIn
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
  property_type?: 'RESIDENTIAL_MF' | 'COMMERCIAL_MF' | 'COMMERCIAL_RETAIL' | 'MIXED_USE' | 'INDUSTRIAL';
  image_url?: string;
  is_verified?: boolean;
}

const DEFAULT_DEALS: Deal[] = [
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
    property_type: 'RESIDENTIAL_MF',
    image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    is_verified: true
  },
  {
    id: '2',
    title: '12-Unit Commercial Multi-Family Complex',
    city: 'Memphis',
    state: 'TN',
    zip_code: '38114',
    price: 640000,
    cap_rate: 11.2,
    monthly_rent_estimate: 9600,
    gross_yield: 18.0,
    units_count: 12,
    property_type: 'COMMERCIAL_MF',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    is_verified: true
  },
  {
    id: '3',
    title: 'Mixed-Use Commercial: Ground Retail + 4 Apts',
    city: 'Detroit',
    state: 'MI',
    zip_code: '48206',
    price: 295000,
    cap_rate: 14.5,
    monthly_rent_estimate: 4800,
    gross_yield: 19.5,
    units_count: 5,
    property_type: 'MIXED_USE',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    is_verified: true
  },
  {
    id: '4',
    title: 'Cash-Flow 4-Plex Value-Add Opportunity',
    city: 'Cleveland',
    state: 'OH',
    zip_code: '44108',
    price: 135000,
    cap_rate: 13.9,
    monthly_rent_estimate: 2400,
    gross_yield: 21.3,
    units_count: 4,
    property_type: 'RESIDENTIAL_MF',
    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    is_verified: true
  }
];

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>(DEFAULT_DEALS);
  const [loading, setLoading] = useState(true);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchDeals() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data, error } = await supabase
            .from('deals')
            .select('*')
            .order('created_at', { ascending: false });

          if (data && data.length > 0 && !error) {
            setDeals(data);
          }
        }
      } catch (e) {
        console.warn('Using default deals pipeline fallback:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  const totalDealsCount = deals.length;
  const avgCapRate = totalDealsCount > 0 
    ? (deals.reduce((acc, curr) => acc + (Number(curr.cap_rate) || 0), 0) / totalDealsCount).toFixed(1)
    : '0.0';
  const totalPipelineValue = deals.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  
  const cityCounts = deals.reduce((acc: { [key: string]: number }, deal) => {
    if (deal.city) {
      const cityName = deal.city.trim();
      acc[cityName] = (acc[cityName] || 0) + 1;
    }
    return acc;
  }, {});

  const uniqueCities = Object.keys(cityCounts).sort();

  const filteredDeals = deals.filter(deal => {
    const matchesCity = selectedCity === 'ALL' || deal.city?.trim().toLowerCase() === selectedCity.toLowerCase();
    const matchesState = selectedState === 'ALL' || deal.state === selectedState;
    const matchesCap = (deal.cap_rate || 0) >= minCapRate;
    
    let matchesAssetClass = true;
    if (selectedAssetClass === 'RESIDENTIAL_MF') {
      matchesAssetClass = (deal.units_count <= 4) && (!deal.property_type || deal.property_type === 'RESIDENTIAL_MF');
    } else if (selectedAssetClass === 'COMMERCIAL_MF') {
      matchesAssetClass = (deal.units_count >= 5) || deal.property_type === 'COMMERCIAL_MF';
    } else if (selectedAssetClass === 'COMMERCIAL_OTHER') {
      matchesAssetClass = deal.property_type === 'MIXED_USE' || deal.property_type === 'COMMERCIAL_RETAIL' || deal.property_type === 'INDUSTRIAL';
    }

    const matchesSearch = deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.zip_code?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesState && matchesCap && matchesAssetClass && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black pb-16 overflow-x-hidden">
      
      {/* 1. Header Navigation Responsive */}
      <header className="border-b border-slate-800 bg-[#06080F]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-sm sm:text-lg tracking-wider text-white">
              MULTIDEAL<span className="text-emerald-400">PROP</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link 
              href="/submit-deal" 
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Submit Deal</span>
              <span className="sm:hidden">Submit</span>
            </Link>

            <Link 
              href="/login" 
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign In</span>
            </Link>

            <Link 
              href="/vip" 
              className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-1 flex-shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Unlock Deals</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-8 sm:pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Live High-Yield Multi-Family &amp; Commercial Pipeline
        </div>
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Off-Market Multi-Family &amp; Commercial Deals <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Underwritten for Institutional Cash-Flow
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          Access high-cap rate duplexes, triplexes, 5+ unit commercial complexes, and mixed-use properties with validated pro-forma models and assignor contacts.
        </p>
      </section>

      {/* 3. Global KPI Statistics Bar */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          <div className="bg-slate-900/50 border border-slate-800/80 p-3 sm:p-4 rounded-2xl flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Assets</div>
              <div className="text-sm sm:text-lg font-black text-white font-mono">{totalDealsCount} Properties</div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-3 sm:p-4 rounded-2xl flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Cap Rate</div>
              <div className="text-sm sm:text-lg font-black text-emerald-400 font-mono">{avgCapRate}% Net</div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-3 sm:p-4 rounded-2xl flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pipeline Volume</div>
              <div className="text-sm sm:text-lg font-black text-cyan-300 font-mono">${(totalPipelineValue / 1000).toFixed(0)}k Underwritten</div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-3 sm:p-4 rounded-2xl flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Metros</div>
              <div className="text-sm sm:text-lg font-black text-white font-mono">{uniqueCities.length} Target Cities</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Asset Class Tabs */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          <button
            onClick={() => setSelectedAssetClass('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              selectedAssetClass === 'ALL'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> All Assets
          </button>

          <button
            onClick={() => setSelectedAssetClass('RESIDENTIAL_MF')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              selectedAssetClass === 'RESIDENTIAL_MF'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>Residential Plex (2-4 Units)</span>
          </button>

          <button
            onClick={() => setSelectedAssetClass('COMMERCIAL_MF')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              selectedAssetClass === 'COMMERCIAL_MF'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Commercial Multi-Family (5+ Units)</span>
          </button>

          <button
            onClick={() => setSelectedAssetClass('COMMERCIAL_OTHER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              selectedAssetClass === 'COMMERCIAL_OTHER'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>Mixed-Use &amp; Retail</span>
          </button>
        </div>
      </section>

      {/* 5. Dynamic City Filter Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" /> 
            <span>Target Markets ({uniqueCities.length} Metros Online)</span>
          </div>
          
          <Link
            href="/request-city"
            className="inline-flex items-center justify-center gap-2 text-[11px] font-extrabold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-800/80 hover:border-cyan-400 px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-cyan-950/40 w-full sm:w-fit"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Request City ($4.99)</span>
            <span className="bg-cyan-400/20 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-cyan-400/30">
              48h Lock
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <button
            onClick={() => setSelectedCity('ALL')}
            className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedCity === 'ALL'
                ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                : 'bg-slate-900/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              {totalDealsCount} Assets
            </span>
            <span className="text-xs sm:text-sm font-black text-white mt-1">
              All Metros
            </span>
          </button>

          {uniqueCities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                selectedCity === city
                  ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-mono font-black text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  {cityCounts[city]}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  {cityCounts[city] > 1 ? 'Deals' : 'Deal'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black text-white mt-1.5 truncate">
                {city}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6">
        <div className="bg-slate-900/50 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city, address, or zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
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
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
            >
              <option value="0">All Cap Rates</option>
              <option value="10">10%+ Cap Rate</option>
              <option value="12">12%+ Cap Rate</option>
              <option value="14">14%+ Cap Rate</option>
            </select>
          </div>
        </div>
      </section>

      {/* 7. Deals Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xs font-bold text-emerald-400 animate-pulse">Scanning underwritten inventory...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/30 border border-slate-800 rounded-3xl p-6">
            <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No assets matched your filter combination.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDeals.map((deal) => {
              const isCommercialMF = (deal.units_count >= 5) || deal.property_type === 'COMMERCIAL_MF';
              const isMixedOrRetail = deal.property_type === 'MIXED_USE' || deal.property_type === 'COMMERCIAL_RETAIL';

              return (
                <div 
                  key={deal.id}
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group"
                >
                  <div className="h-44 sm:h-48 relative overflow-hidden bg-slate-950">
                    <img 
                      src={deal.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'} 
                      alt={deal.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {isCommercialMF && (
                        <span className="bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Commercial MF
                        </span>
                      )}
                      {isMixedOrRetail && (
                        <span className="bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Mixed-Use
                        </span>
                      )}
                      {!isCommercialMF && !isMixedOrRetail && (
                        <span className="bg-slate-950/90 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Underwritten Plex
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded-lg border border-slate-800 text-[9px] sm:text-[10px] font-bold text-slate-300">
                      {deal.units_count} Units
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{deal.city}, {deal.state} {deal.zip_code}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {deal.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-950/60 p-2.5 sm:p-3 rounded-2xl border border-slate-800/80 text-center">
                      <div>
                        <div className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-500">Asking</div>
                        <div className="text-[11px] sm:text-xs font-black text-white font-mono mt-0.5">${Number(deal.price).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-500">Cap Rate</div>
                        <div className="text-[11px] sm:text-xs font-black text-emerald-400 font-mono mt-0.5">{deal.cap_rate}%</div>
                      </div>
                      <div>
                        <div className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-500">Est. Rent</div>
                        <div className="text-[11px] sm:text-xs font-black text-cyan-300 font-mono mt-0.5">${deal.monthly_rent_estimate ? Number(deal.monthly_rent_estimate).toLocaleString() : 'N/A'}</div>
                      </div>
                    </div>

                    <Link
                      href={`/deals/${deal.id}`}
                      className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-black text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>View Asset &amp; Financials</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 8. Institutional Footer Responsive */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-8 sm:py-12 mt-16 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
            <div>
              <span className="text-white font-black tracking-wider text-sm">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
              <p className="text-slate-500 text-xs mt-0.5">Institutional Off-Market Multi-Family &amp; Commercial Pipeline</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium">
              <Link href="/login" className="text-white hover:text-emerald-400 transition-colors font-bold">Sign In / Access</Link>
              <Link href="/submit-deal" className="text-emerald-400 hover:underline transition-colors font-bold">+ Submit Deal</Link>
              <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/vip" className="hover:text-emerald-400 transition-colors">Pricing Plans</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Desk</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms &amp; Disclaimer</Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-slate-600 text-center md:text-left">
            <p>
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
