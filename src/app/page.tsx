'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
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
  Briefcase
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

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
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
        // Jeu démo incluant du Multi-Family résidentiel et du Commercial
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
            property_type: 'RESIDENTIAL_MF',
            image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
            is_verified: true
          },
          {
            id: '2',
            title: '12-Unit Commercial Multi-Family Apartment Complex',
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
            title: 'Mixed-Use Commercial: Ground Retail + 4 Apartments',
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
        ]);
      }
      setLoading(false);
    }

    fetchDeals();
  }, []);

  // Calculs statistiques
  const totalDealsCount = deals.length;
  const avgCapRate = totalDealsCount > 0 
    ? (deals.reduce((acc, curr) => acc + (Number(curr.cap_rate) || 0), 0) / totalDealsCount).toFixed(1)
    : '0.0';
  const totalPipelineValue = deals.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  
  // Extraction des villes
  const cityCounts = deals.reduce((acc: { [key: string]: number }, deal) => {
    if (deal.city) {
      const cityName = deal.city.trim();
      acc[cityName] = (acc[cityName] || 0) + 1;
    }
    return acc;
  }, {});

  const uniqueCities = Object.keys(cityCounts).sort();

  // Filtrage combiné (Ville + État + Cap Rate + Recherche + Classe Commerciale/Résidentielle)
  const filteredDeals = deals.filter(deal => {
    const matchesCity = selectedCity === 'ALL' || deal.city?.trim().toLowerCase() === selectedCity.toLowerCase();
    const matchesState = selectedState === 'ALL' || deal.state === selectedState;
    const matchesCap = (deal.cap_rate || 0) >= minCapRate;
    
    // Détection classe d'actifs (Commercial vs Residential)
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
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black pb-16">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-800 bg-[#06080F]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-emerald-500/20">
              MP
            </div>
            <span className="font-black text-base sm:text-lg tracking-wider text-white">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/submit-deal" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Submit Contract / Commercial</span>
              <span className="sm:hidden">Submit</span>
            </Link>

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
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Live Multi-Family &amp; Commercial Real Estate Pipeline
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Off-Market Plexes &amp; Commercial Assets <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Underwritten for Institutional Cash-Flow
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Screen residential plexes (2-4 units), commercial multi-family complexes (5-20+ units), and mixed-use properties with validated pro-forma models and assignor contacts.
        </p>
      </section>

      {/* 3. Global KPI Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Inventory</div>
              <div className="text-lg font-black text-white font-mono">{totalDealsCount} Properties</div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Cap Rate</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{avgCapRate}% Net</div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pipeline Volume</div>
              <div className="text-lg font-black text-cyan-300 font-mono">${(totalPipelineValue / 1000).toFixed(0)}k Underwritten</div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Metros</div>
              <div className="text-lg font-black text-white font-mono">{uniqueCities.length} Target Cities</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Asset Class Tabs (Residential Plex vs Commercial) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setSelectedAssetClass('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              selectedAssetClass === 'ALL'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> All Asset Types
          </button>

          <button
            onClick={() => setSelectedAssetClass('RESIDENTIAL_MF')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              selectedAssetClass === 'RESIDENTIAL_MF'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>Residential Plex (2 - 4 Units)</span>
          </button>

          <button
            onClick={() => setSelectedAssetClass('COMMERCIAL_MF')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
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
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              selectedAssetClass === 'COMMERCIAL_OTHER'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>Mixed-Use &amp; Retail Commercial</span>
          </button>
        </div>
      </section>

      {/* 5. Dynamic City Filter Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> 
            <span>Active Target Markets ({uniqueCities.length} Cities Online)</span>
          </div>
          
          <Link
  href="/request-city"
  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-800/70 hover:border-cyan-400 px-3 py-1.5 rounded-xl transition-all w-fit"
>
  <Compass className="w-3.5 h-3.5" />
  <span>+ Request / Add New City ($4.99)</span>
</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setSelectedCity('ALL')}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedCity === 'ALL'
                ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                : 'bg-slate-900/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
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
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                selectedCity === city
                  ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  {cityCounts[city]}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  {cityCounts[city] > 1 ? 'Deals' : 'Deal'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black text-white mt-2 truncate">
                {city}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, commercial type, or zip..."
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

      {/* 7. Deals Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-xs font-bold text-emerald-400 animate-pulse">Scanning underwritten commercial &amp; multi-family inventory...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
            <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No assets matched your filter combination.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const isCommercialMF = (deal.units_count >= 5) || deal.property_type === 'COMMERCIAL_MF';
              const isMixedOrRetail = deal.property_type === 'MIXED_USE' || deal.property_type === 'COMMERCIAL_RETAIL';

              return (
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
                    
                    {/* Badge Typologie */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isCommercialMF && (
                        <span className="bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Commercial MF
                        </span>
                      )}
                      {isMixedOrRetail && (
                        <span className="bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Mixed-Use
                        </span>
                      )}
                      {!isCommercialMF && !isMixedOrRetail && (
                        <span className="bg-slate-950/90 border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Underwritten Plex
                        </span>
                      )}
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
                        <div className="text-xs font-black text-white font-mono mt-0.5">${Number(deal.price).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-500">Cap Rate</div>
                        <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">{deal.cap_rate}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-500">Est. Rent</div>
                        <div className="text-xs font-black text-cyan-300 font-mono mt-0.5">${deal.monthly_rent_estimate ? Number(deal.monthly_rent_estimate).toLocaleString() : 'N/A'}</div>
                      </div>
                    </div>

                    {/* Action Link */}
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

      {/* 8. Institutional Footer */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-12 mt-20 text-slate-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-white font-black tracking-wider text-sm">MULTIDEAL<span className="text-emerald-400">PROP</span></span>
              <p className="text-slate-500 text-xs mt-1">Institutional Off-Market Multi-Family &amp; Commercial Pipeline</p>
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
