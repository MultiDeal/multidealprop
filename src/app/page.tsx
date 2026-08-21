'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  Mail,
  X,
  Sparkles,
  BellRing,
  LayoutGrid,
  ListFilter,
  ArrowUpDown,
  TrendingUp,
  Percent,
  DollarSign,
  Flame
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  property_type: string;
  formatted_address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  estimated_market_value: number;
  units_count: number;
  monthly_rent_estimate: number;
  cap_rate: number;
  deal_score: number;
  section8_eligible: boolean;
  is_vip_only: boolean;
  image_url?: string;
  created_at?: string;
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [searchCity, setSearchCity] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [onlySection8, setOnlySection8] = useState<boolean>(false);
  const [onlyUnderMarket, setOnlyUnderMarket] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('score_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modale VIP & Alerte
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [vipInterest, setVipInterest] = useState('VIP Deals Club');
  const [vipSubmitting, setVipSubmitting] = useState(false);
  const [vipSuccess, setVipSuccess] = useState(false);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('deal_score', { ascending: false });

        if (error) throw error;
        if (data) setDeals(data as Deal[]);
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipEmail) return;
    setVipSubmitting(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: vipEmail, 
          interested_in: vipInterest 
        })
      });
      setVipSuccess(true);
    } catch (err) {
      console.error('Error submitting lead:', err);
    } finally {
      setVipSubmitting(false);
    }
  };

  // Métriques de marché
  const marketStats = useMemo(() => {
    if (deals.length === 0) return { totalDeals: 0, avgCap: 0, avgDiscount: 0, avgRent: 0 };
    const totalDeals = deals.length;
    const avgCap = (deals.reduce((acc, d) => acc + (Number(d.cap_rate) || 0), 0) / totalDeals).toFixed(1);
    const avgRent = Math.round(deals.reduce((acc, d) => acc + (Number(d.monthly_rent_estimate) || 0), 0) / totalDeals);
    
    const validDiscountDeals = deals.filter(d => d.estimated_market_value && d.price && d.estimated_market_value > d.price);
    const avgDiscount = validDiscountDeals.length > 0
      ? Math.round(validDiscountDeals.reduce((acc, d) => acc + (((d.estimated_market_value - d.price) / d.estimated_market_value) * 100), 0) / validDiscountDeals.length)
      : 0;

    return { totalDeals, avgCap, avgDiscount, avgRent };
  }, [deals]);

  // Filtrage et Tri
  const filteredDeals = useMemo(() => {
    return deals
      .filter((deal) => {
        const matchesType = filterType === 'all' || deal.property_type.toLowerCase() === filterType.toLowerCase();
        const matchesCity = searchCity === '' || 
          deal.city.toLowerCase().includes(searchCity.toLowerCase()) ||
          deal.state.toLowerCase().includes(searchCity.toLowerCase()) ||
          deal.title.toLowerCase().includes(searchCity.toLowerCase());
        const matchesCap = minCapRate === 0 || (deal.cap_rate || 0) >= minCapRate;
        const matchesPrice = maxPrice === 0 || (deal.price || 0) <= maxPrice;
        const matchesSection8 = !onlySection8 || deal.section8_eligible;
        
        const discount = deal.estimated_market_value && deal.price
          ? ((deal.estimated_market_value - deal.price) / deal.estimated_market_value) * 100
          : 0;
        const matchesUnderMarket = !onlyUnderMarket || discount >= 10;

        return matchesType && matchesCity && matchesCap && matchesPrice && matchesSection8 && matchesUnderMarket;
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return (b.deal_score || 0) - (a.deal_score || 0);
        if (sortBy === 'cap_desc') return (b.cap_rate || 0) - (a.cap_rate || 0);
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'discount_desc') {
          const discA = a.estimated_market_value ? (a.estimated_market_value - a.price) / a.estimated_market_value : 0;
          const discB = b.estimated_market_value ? (b.estimated_market_value - b.price) / b.estimated_market_value : 0;
          return discB - discA;
        }
        return 0;
      });
  }, [deals, searchCity, filterType, minCapRate, maxPrice, onlySection8, onlyUnderMarket, sortBy]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-emerald-500 selection:text-black relative">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-black font-black text-xl w-9 h-9 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              M
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">MultiDeal<span className="text-emerald-400">Prop</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live US Deal Scanner
            </span>
            <button 
              onClick={() => {
                setVipInterest('VIP Deals Club');
                setVipSuccess(false);
                setIsVipModalOpen(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Get VIP Deals
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 pb-8 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Off-Market & High-Yield US Real Estate Scanner
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3">
          Find High-Cashflow <span className="text-emerald-400">Multifamily & Plex</span> Deals.
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
          Instant Cap Rate calculations, Section 8 rent optimization, and deep below-market spread analysis.
        </p>

        {/* Live Market Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="p-2 text-center border-r border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Active Deals
            </div>
            <div className="text-lg font-black text-white mt-0.5">{marketStats.totalDeals}</div>
          </div>
          <div className="p-2 text-center sm:border-r border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Percent className="w-3 h-3 text-emerald-400" /> Avg Cap Rate
            </div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">{marketStats.avgCap}%</div>
          </div>
          <div className="p-2 text-center border-r border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> Avg Spread
            </div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">-{marketStats.avgDiscount}%</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3 text-purple-400" /> Avg Mo. Rent
            </div>
            <div className="text-lg font-black text-white mt-0.5">${marketStats.avgRent.toLocaleString()}</div>
          </div>
        </div>
      </section>

      {/* Main Terminal Controls & Deals */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filter Control Center */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 shadow-xl backdrop-blur space-y-4">
          {/* Row 1: Search & Asset Categories */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex items-center px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl flex-1">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search city, state (e.g. Cleveland, OH, Memphis)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-200 placeholder-slate-500 w-full"
              />
              {searchCity && (
                <button onClick={() => setSearchCity('')} className="text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Asset Types */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Deals' },
                { id: 'plex', label: 'Multifamily (Plex)' },
                { id: 'single_family', label: 'Single Family' },
                { id: 'land', label: 'Land' },
                { id: 'commercial', label: 'Commercial' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    filterType === tab.id 
                      ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/10' 
                      : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Deep Filters & Sorting */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Cap Rate Selector */}
              <select
                value={minCapRate}
                onChange={(e) => setMinCapRate(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value={0}>Min Cap Rate: Any</option>
                <option value={8}>Min Cap Rate: 8%+</option>
                <option value={10}>Min Cap Rate: 10%+</option>
                <option value={12}>Min Cap Rate: 12%+</option>
              </select>

              {/* Price Ceiling Selector */}
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value={0}>Max Price: Any</option>
                <option value={150000}>Max Price: &lt; $150,000</option>
                <option value={250000}>Max Price: &lt; $250,000</option>
                <option value={400000}>Max Price: &lt; $400,000</option>
              </select>

              {/* Toggles */}
              <button
                onClick={() => setOnlySection8(!onlySection8)}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  onlySection8 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Section 8 Eligible
              </button>

              <button
                onClick={() => setOnlyUnderMarket(!onlyUnderMarket)}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  onlyUnderMarket 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-semibold' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Below Market (-10%+)
              </button>
            </div>

            {/* Sort & View Mode Switches */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-300 outline-none text-xs cursor-pointer"
                >
                  <option value="score_desc">Sort: Highest Deal Score</option>
                  <option value="cap_desc">Sort: Highest Cap Rate</option>
                  <option value="discount_desc">Sort: Deepest Discount</option>
                  <option value="price_asc">Sort: Price (Low to High)</option>
                  <option value="price_desc">Sort: Price (High to Low)</option>
                </select>
              </div>

              {/* View Toggle Button */}
              <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md cursor-pointer ${viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md cursor-pointer ${viewMode === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Table Comparison View"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Criteria */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredDeals.length}</strong> matching investment opportunities</span>
          {(minCapRate > 0 || maxPrice > 0 || onlySection8 || onlyUnderMarket || searchCity) && (
            <button 
              onClick={() => {
                setSearchCity('');
                setFilterType('all');
                setMinCapRate(0);
                setMaxPrice(0);
                setOnlySection8(false);
                setOnlyUnderMarket(false);
              }}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Dynamic Display Rendering */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Scanning multi-family databases & calculating live yields...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No deals match these exact filters</h3>
            <p className="text-xs text-slate-400 mb-6">
              Create an instant alert. Our engine will notify you as soon as a property matching these criteria enters the pipeline.
            </p>
            <button
              onClick={() => {
                setVipInterest(`Alert: ${searchCity || 'Custom Search'} (Min Cap: ${minCapRate}%)`);
                setVipSuccess(false);
                setIsVipModalOpen(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              Set Instant Alert for this Search
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const discount = deal.estimated_market_value && deal.price
                ? Math.round(((deal.estimated_market_value - deal.price) / deal.estimated_market_value) * 100)
                : 0;

              return (
                <div 
                  key={deal.id} 
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                    <img 
                      src={deal.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'} 
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-200 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700/50 uppercase">
                        {deal.property_type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold text-emerald-400 bg-slate-900/90 backdrop-blur border border-emerald-500/40 px-2.5 py-1 rounded-full">
                        Score: {deal.deal_score}/100
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-300 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {deal.city}, {deal.state} {deal.zip_code}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {deal.title}
                      </h3>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">List Price</div>
                        <div className="text-base font-bold text-white">${Number(deal.price).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Est. Value</div>
                        <div className="text-base font-bold text-emerald-400">
                          ${Number(deal.estimated_market_value).toLocaleString()}
                          {discount > 0 && <span className="text-[10px] ml-1 text-emerald-500">(-{discount}%)</span>}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/40">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Cap Rate</div>
                        <div className="text-xs font-semibold text-emerald-400">{deal.cap_rate}%</div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/40">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Monthly Rent</div>
                        <div className="text-xs font-semibold text-white">${Number(deal.monthly_rent_estimate).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      {deal.section8_eligible ? (
                        <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Section 8
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Market Rate</span>
                      )}
                      <a 
                        href={`/deals/${deal.id}`}
                        className="text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        View Deal <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE FINANCIAL COMPARISON VIEW */
          <div className="overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Property</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Est. Value</th>
                  <th className="py-3 px-4 font-semibold">Cap Rate</th>
                  <th className="py-3 px-4 font-semibold">Est. Rent</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDeals.map((deal) => {
                  const discount = deal.estimated_market_value && deal.price
                    ? Math.round(((deal.estimated_market_value - deal.price) / deal.estimated_market_value) * 100)
                    : 0;

                  return (
                    <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white max-w-[200px] truncate">
                        {deal.title}
                        <div className="text-[10px] text-slate-500 uppercase">{deal.property_type}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        {deal.city}, {deal.state}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-white">
                        ${Number(deal.price).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-emerald-400">${Number(deal.estimated_market_value).toLocaleString()}</span>
                        {discount > 0 && <span className="ml-1 text-[10px] text-cyan-400">(-{discount}%)</span>}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-emerald-400">
                        {deal.cap_rate}%
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-200">
                        ${Number(deal.monthly_rent_estimate).toLocaleString()}/mo
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                          {deal.deal_score}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {deal.section8_eligible ? (
                          <span className="text-[10px] text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30">Section 8</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Market Rate</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <a
                          href={`/deals/${deal.id}`}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          View <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Custom Deal Alert Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
              <BellRing className="w-3.5 h-3.5" /> Deal Flow Direct Engine
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Looking for a specific market or off-market multi-family?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We scrape auction platforms, county foreclosure lists, and private wholesalers daily. Set your target criteria and get notified first.
            </p>
          </div>
          <button
            onClick={() => {
              setVipInterest('Custom Acquisition Request');
              setVipSuccess(false);
              setIsVipModalOpen(true);
            }}
            className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Create Custom Buy Alert
          </button>
        </div>
      </main>

      {/* POPUP / MODALE VIP & ALERTS */}
      {isVipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl shadow-emerald-500/10">
            <button 
              onClick={() => setIsVipModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {vipSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Alerte Confirmée !</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Votre demande a bien été enregistrée. Vous recevrez nos meilleures opportunités off-market directement par email.
                </p>
                <button
                  onClick={() => setIsVipModalOpen(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
                  <BellRing className="w-3.5 h-3.5" /> Accès Investisseur Prioritaire
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Recevez les opportunités <span className="text-emerald-400">48h en avance</span>
                </h2>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Rejoignez notre réseau privé d'acheteurs d'immeubles de rapport et plexes américains à fort rendement.
                </p>

                <form onSubmit={handleVipSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="Votre adresse email professionnelle..."
                      value={vipEmail}
                      onChange={(e) => setVipEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={vipSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {vipSubmitting ? 'Activation en cours...' : 'Activer mon Accès VIP Gratuit'}
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
                  <span>✓ 100% Gratuit</span>
                  <span>•</span>
                  <span>✓ Zéro Spam</span>
                  <span>•</span>
                  <span>✓ Désinscription en 1 clic</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
