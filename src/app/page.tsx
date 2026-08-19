'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  Home, 
  TreePine, 
  Store, 
  MapPin,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Search,
  SlidersHorizontal
} from 'lucide-react';

interface Deal {
  id: string;
  listing_id: string;
  title: string;
  property_type: 'plex' | 'single_family' | 'land' | 'commercial';
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
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchCity, setSearchCity] = useState<string>('');

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      try {
        let query = supabase
          .from('deals')
          .select('*')
          .order('deal_score', { ascending: false });

        if (filterType !== 'all') {
          query = query.eq('property_type', filterType);
        }

        const { data, error } = await query;
        if (!error && data) {
          setDeals(data as Deal[]);
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, [filterType]);

  const filteredDeals = deals.filter(deal => {
    if (!searchCity) return true;
    const match = `${deal.city} ${deal.state} ${deal.formatted_address}`.toLowerCase();
    return match.includes(searchCity.toLowerCase());
  });

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'plex':
        return <Building2 className="w-4 h-4" />;
      case 'single_family':
        return <Home className="w-4 h-4" />;
      case 'land':
        return <TreePine className="w-4 h-4" />;
      case 'commercial':
        return <Store className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getPropertyLabel = (type: string) => {
    switch (type) {
      case 'plex': return 'Multifamily (Plex)';
      case 'single_family': return 'Single Family';
      case 'land': return 'Land / Lot';
      case 'commercial': return 'Commercial';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black text-lg">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              MultiDeal<span className="text-emerald-400">Prop</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live US Deal Scanner
            </span>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-500/20">
              Get VIP Deals
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/90 text-slate-300 text-xs font-medium mb-6">
          <span className="text-emerald-400 font-bold">5 New Deals</span>
          <span>•</span>
          <span>Cleveland, Detroit, Memphis, Cape Coral & Columbus</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Find Under-Market <span className="text-emerald-400">Plexes, Land & Properties</span> in the US.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Automated valuation, instant Cap Rate calculations, and Section 8 yield estimation across high-cashflow American markets.
        </p>

        {/* Search & Filters */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, state or address..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            { label: 'All Opportunities', value: 'all' },
            { label: 'Multifamily (Plex)', value: 'plex' },
            { label: 'Single Family', value: 'single_family' },
            { label: 'Land', value: 'land' },
            { label: 'Commercial', value: 'commercial' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterType === tab.value
                  ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
            Scanning US database...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const discount = deal.estimated_market_value && deal.price
                ? Math.round(((deal.estimated_market_value - deal.price) / deal.estimated_market_value) * 100)
                : 0;

              return (
                <div
                  key={deal.id}
                  className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden group"
                >
                  {deal.is_vip_only && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> VIP 24h Early Access
                    </div>
                  )}

                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                        {getPropertyIcon(deal.property_type)}
                        {getPropertyLabel(deal.property_type)}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        Score: {deal.deal_score}/100
                      </span>
                    </div>

                    {/* Title & Address */}
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{deal.formatted_address}, {deal.city}, {deal.state} {deal.zip_code}</span>
                    </div>

                    {/* Price comparison box */}
                    <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">List Price</div>
                        <div className="text-base font-bold text-white">${Number(deal.price).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Est. Value</div>
                        <div className="text-base font-bold text-emerald-400">
                          ${Number(deal.estimated_market_value).toLocaleString()}
                          {discount > 0 && (
                            <span className="text-[10px] text-emerald-400/80 ml-1 font-normal">(-{discount}%)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center border-t border-slate-800/60 pt-3">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-medium">Cap Rate</div>
                        <div className="text-sm font-semibold text-emerald-400">
                          {Number(deal.cap_rate) > 0 ? `${deal.cap_rate}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-medium">Monthly Rent</div>
                        <div className="text-sm font-semibold text-white">
                          {Number(deal.monthly_rent_estimate) > 0 ? `$${Number(deal.monthly_rent_estimate).toLocaleString()}` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-medium">Units</div>
                        <div className="text-sm font-semibold text-white">{deal.units_count}</div>
                      </div>
                    </div>
                  </div>

                 {/* Card Footer */}
<div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
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
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
