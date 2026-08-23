'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  ArrowUpRight, 
  ShieldCheck, 
  Download,
  BarChart3,
  TrendingUp,
  Percent,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PropertyDeal {
  id: string;
  title: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  cap_rate: number;
  monthly_rent_estimate: number;
  gross_yield?: number;
  image_url?: string;
  seller_name?: string;
  seller_phone?: string;
}

const FEATURED_CITIES = [
  { name: 'ALL', label: 'All Markets', state: 'USA', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cleveland', label: 'Cleveland', state: 'OH', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Detroit', label: 'Detroit', state: 'MI', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80' },
  { name: 'Memphis', label: 'Memphis', state: 'TN', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Indianapolis', label: 'Indianapolis', state: 'IN', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' },
  { name: 'Kansas City', label: 'Kansas City', state: 'MO', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
];

export default function HomePage() {
  const [deals, setDeals] = useState<PropertyDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setDeals(data as PropertyDeal[]);
        } else {
          // Default underwritten sample duplex inventory
          setDeals([
            {
              id: '1',
              title: 'Turnkey Multi-Family Duplex - 2 Units Leased',
              city: 'Cleveland',
              state: 'OH',
              zip_code: '44105',
              price: 98000,
              cap_rate: 13.4,
              monthly_rent_estimate: 1950,
              gross_yield: 23.8,
              image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Apex Wholesale Capital LLC',
              seller_phone: '+1 (216) 884-2190'
            },
            {
              id: '2',
              title: 'Brick Multi-Family Value-Add Duplex',
              city: 'Detroit',
              state: 'MI',
              zip_code: '48227',
              price: 79000,
              cap_rate: 14.2,
              monthly_rent_estimate: 1800,
              gross_yield: 27.3,
              image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Motor City Wholesale Desk',
              seller_phone: '+1 (313) 490-1120'
            },
            {
              id: '3',
              title: 'Cash-Flowing Side-by-Side 2-Unit Duplex',
              city: 'Memphis',
              state: 'TN',
              zip_code: '38109',
              price: 115000,
              cap_rate: 12.1,
              monthly_rent_estimate: 2100,
              gross_yield: 21.9,
              image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Bluff City Direct Acquisitions',
              seller_phone: '+1 (901) 329-8740'
            },
            {
              id: '4',
              title: 'High Cashflow Duplex Near Medical Center',
              city: 'Indianapolis',
              state: 'IN',
              zip_code: '46201',
              price: 128000,
              cap_rate: 12.8,
              monthly_rent_estimate: 2200,
              gross_yield: 20.6,
              image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Circle City Deal Desk',
              seller_phone: '+1 (317) 550-9812'
            },
            {
              id: '5',
              title: 'Fully Occupied Turnkey Duplex Portfolio Add',
              city: 'Kansas City',
              state: 'MO',
              zip_code: '64130',
              price: 109000,
              cap_rate: 13.1,
              monthly_rent_estimate: 1980,
              gross_yield: 21.8,
              image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Midwest Capital Flow',
              seller_phone: '+1 (816) 430-6721'
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  // Filtered inventory based on active state
  const filteredDeals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return deals.filter((deal) => {
      const matchesSearch = 
        !query ||
        deal.title?.toLowerCase().includes(query) ||
        deal.city?.toLowerCase().includes(query) ||
        deal.state?.toLowerCase().includes(query) ||
        deal.zip_code?.includes(query);

      const matchesCity = 
        selectedCity === 'ALL' || 
        deal.city?.toLowerCase() === selectedCity.toLowerCase();

      const matchesCap = Number(deal.cap_rate || 0) >= minCapRate;
      const matchesPrice = Number(deal.price || 0) <= maxPrice;

      return matchesSearch && matchesCity && matchesCap && matchesPrice;
    });
  }, [deals, searchQuery, selectedCity, minCapRate, maxPrice]);

  // Aggregate Market Stats Calculation
  const marketStats = useMemo(() => {
    const targetPool = filteredDeals.length > 0 ? filteredDeals : deals;
    if (targetPool.length === 0) {
      return { totalDeals: 0, avgCapRate: '0.0', avgGrossYield: '0.0', avgPrice: 0, avgMonthlyRent: 0, rentToPriceRatio: '0.00' };
    }

    const totalDeals = targetPool.length;
    const sumCap = targetPool.reduce((acc, d) => acc + Number(d.cap_rate || 0), 0);
    const sumPrice = targetPool.reduce((acc, d) => acc + Number(d.price || 0), 0);
    const sumRent = targetPool.reduce((acc, d) => acc + Number(d.monthly_rent_estimate || 0), 0);
    const sumGrossYield = targetPool.reduce((acc, d) => {
      const yieldVal = d.gross_yield ? Number(d.gross_yield) : ((Number(d.monthly_rent_estimate || 0) * 12) / (Number(d.price) || 1)) * 100;
      return acc + yieldVal;
    }, 0);

    const avgPrice = Math.round(sumPrice / totalDeals);
    const avgMonthlyRent = Math.round(sumRent / totalDeals);
    const rentToPrice = avgPrice > 0 ? ((avgMonthlyRent / avgPrice) * 100).toFixed(2) : '0.00';

    return {
      totalDeals,
      avgCapRate: (sumCap / totalDeals).toFixed(1),
      avgGrossYield: (sumGrossYield / totalDeals).toFixed(1),
      avgPrice,
      avgMonthlyRent,
      rentToPriceRatio: rentToPrice
    };
  }, [deals, filteredDeals]);

  // Helper count per city for badge indicators
  const getCityDealCount = (cityName: string) => {
    if (cityName === 'ALL') return deals.length;
    return deals.filter(d => d.city?.toLowerCase() === cityName.toLowerCase()).length;
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#06080F]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-emerald-500 text-black font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              M
            </div>
            <span className="font-bold text-base tracking-tight text-white">MultiDeal<span className="text-emerald-400">Prop</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/vip" className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all">
              ⚡ VIP Pro Access
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-6 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live US Multi-Family Yield Scanner
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
          Find High-Yield Duplexes <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            With 12%+ Cap Rates
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mb-6">
          Pre-underwritten off-market multi-family deals, verified rent estimates, and direct wholesaler assignment contacts.
        </p>

        {/* 1. CITY QUICK-SELECTOR CARDS */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto mb-3 px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Target Multi-Family Markets
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Click city to filter</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-4xl mx-auto">
            {FEATURED_CITIES.map((city) => {
              const isActive = selectedCity.toLowerCase() === city.name.toLowerCase();
              const count = getCityDealCount(city.name);
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => setSelectedCity(city.name)}
                  className={`relative overflow-hidden rounded-2xl border text-left p-3 transition-all cursor-pointer group flex flex-col justify-between h-24 ${
                    isActive 
                      ? 'border-emerald-400 ring-2 ring-emerald-500/40 bg-slate-900 shadow-lg shadow-emerald-500/10' 
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                    <img src={city.img} alt={city.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-emerald-500 text-black' : 'bg-slate-800/80 text-slate-300'}`}>
                      {city.state}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {count} {count === 1 ? 'deal' : 'deals'}
                    </span>
                  </div>
                  <div className="relative z-10 font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                    {city.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. LIVE MARKET INTELLIGENCE MATRIX (Aggregated Statistics Box) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0B1320] border border-slate-800 p-5 rounded-3xl max-w-4xl mx-auto shadow-2xl backdrop-blur mb-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Live Underwriting Metrics ({selectedCity === 'ALL' ? 'National Average' : selectedCity})
              </h3>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Market Depth: <strong className="text-emerald-400">{marketStats.totalDeals} Properties</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Percent className="w-3 h-3 text-emerald-400" /> Average Cap Rate
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {marketStats.avgCapRate}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Net cash yield</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-cyan-400" /> Avg Gross Yield
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
                {marketStats.avgGrossYield}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Annual gross return</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-white" /> Average Price
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                ${marketStats.avgPrice.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Off-market baseline</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-amber-400" /> Rent-to-Price
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                {marketStats.rentToPriceRatio}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Rule of thumb matrix</div>
            </div>
          </div>
        </div>

        {/* 3. FILTER SEARCH CONTROL BAR */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-3xl max-w-4xl mx-auto shadow-2xl backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search Keyword, Zip..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="ALL">All Target Markets</option>
                <option value="Cleveland">Cleveland, OH</option>
                <option value="Detroit">Detroit, MI</option>
                <option value="Memphis">Memphis, TN</option>
                <option value="Indianapolis">Indianapolis, IN</option>
                <option value="Kansas City">Kansas City, MO</option>
              </select>
            </div>

            {/* Cap Rate Filter */}
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={minCapRate}
                onChange={(e) => setMinCapRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="0">All Cap Rates</option>
                <option value="10">Min 10%+ Cap Rate</option>
                <option value="12">Min 12%+ Cap Rate</option>
                <option value="14">Min 14%+ Cap Rate</option>
              </select>
            </div>

            {/* Max Price Filter */}
            <div className="relative">
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="1000000">Any Max Price</option>
                <option value="80000">Under $80,000</option>
                <option value="100000">Under $100,000</option>
                <option value="150000">Under $150,000</option>
                <option value="200000">Under $200,000</option>
              </select>
            </div>

          </div>

          {/* Active Filter Status & Reset */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Active Filters:</span>
              {selectedCity !== 'ALL' && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  📍 {selectedCity}
                </span>
              )}
              {minCapRate > 0 && (
                <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  ⚡ {minCapRate}%+ Cap Rate
                </span>
              )}
              {maxPrice < 1000000 && (
                <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md">
                  💰 Under ${maxPrice.toLocaleString()}
                </span>
              )}
              {selectedCity === 'ALL' && minCapRate === 0 && maxPrice === 1000000 && !searchQuery && (
                <span className="text-slate-500">Showing all {deals.length} properties</span>
              )}
            </div>

            {(selectedCity !== 'ALL' || minCapRate > 0 || maxPrice < 1000000 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCity('ALL');
                  setMinCapRate(0);
                  setMaxPrice(1000000);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-white underline cursor-pointer text-[11px]"
              >
                Reset filters
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 4. DEALS INVENTORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active Properties Available ({filteredDeals.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-xs animate-pulse">
            Scanning multi-family databases &amp; underwriting cash-flows...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
            <p className="text-sm font-bold text-white mb-1">No properties matching your criteria</p>
            <p className="text-xs text-slate-400 mb-4">Try broadening your search or resetting the active filters.</p>
            <button
              onClick={() => {
                setSelectedCity('ALL');
                setMinCapRate(0);
                setMaxPrice(1000000);
                setSearchQuery('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all flex flex-col justify-between group shadow-xl hover:shadow-2xl"
              >
                <div>
                  {/* Image Header */}
                  <div className="h-48 bg-slate-950 relative overflow-hidden">
                    <img 
                      src={deal.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'} 
                      alt={deal.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                      {deal.cap_rate || 13.0}% Cap Rate
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {deal.city || 'Market'}, {deal.state || ''} {deal.zip_code || ''}
                    </div>
                    <h3 className="text-base font-bold text-white mb-4 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {deal.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">List Price</div>
                        <div className="text-base font-black text-white font-mono">${Number(deal.price || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Gross Rent / Mo</div>
                        <div className="text-base font-black text-emerald-400 font-mono">${Number(deal.monthly_rent_estimate || 1800).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <Link
                    href={`/deals/${deal.id}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors block text-center"
                  >
                    View Deal Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/deals/${deal.id}/print`}
                    target="_blank"
                    className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-[11px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700/50 block text-center"
                  >
                    <Download className="w-3 h-3 text-emerald-400" /> Due Diligence PDF Pack
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#04060A] py-12 mt-20 text-slate-400 text-xs">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
    <div>
      <span className="text-white font-black tracking-wider text-sm">MULTIDEALPROP</span>
      <p className="text-slate-500 mt-1">Institutional Off-Market Multi-Family Pipeline</p>
    </div>

    <div className="flex flex-wrap items-center gap-6">
      <Link href="/vip" className="hover:text-emerald-400 transition-colors">Pricing Plans</Link>
      <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Desk</Link>
      <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms &amp; Disclaimer</Link>
      <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
    </div>

    <div className="text-slate-600 text-[11px]">
      © {new Date().getFullYear()} MultiDealProp. All rights reserved.
    </div>
  </div>
</footer>

    </div>
  );
}
