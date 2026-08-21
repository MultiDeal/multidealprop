'use client';

import { useEffect, useState } from 'react';
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
  BellRing
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
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchCity, setSearchCity] = useState<string>('');

  // États pour la modale VIP
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
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
          interested_in: 'VIP Deals Club' 
        })
      });
      setVipSuccess(true);
    } catch (err) {
      console.error('Error submitting VIP lead:', err);
    } finally {
      setVipSubmitting(false);
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesType = filterType === 'all' || deal.property_type.toLowerCase() === filterType.toLowerCase();
    const matchesCity = searchCity === '' || 
      deal.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      deal.state.toLowerCase().includes(searchCity.toLowerCase()) ||
      deal.title.toLowerCase().includes(searchCity.toLowerCase());
    return matchesType && matchesCity;
  });

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
      <section className="py-12 sm:py-16 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Off-Market & Under-Market Opportunities • High Yield
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
          Find Under-Market <span className="text-emerald-400">Plexes, Land & Properties</span> in the US.
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Automated valuation, instant Cap Rate calculations, and Section 8 yield estimation across high-cashflow American markets.
        </p>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl max-w-2xl mx-auto shadow-2xl backdrop-blur">
          <div className="flex items-center px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search by city, state or address..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-200 placeholder-slate-500 w-full"
            />
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${filterType === 'all' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All Opportunities
            </button>
            <button 
              onClick={() => setFilterType('plex')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${filterType === 'plex' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Multifamily (Plex)
            </button>
            <button 
              onClick={() => setFilterType('single_family')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${filterType === 'single_family' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Single Family
            </button>
            <button 
              onClick={() => setFilterType('land')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${filterType === 'land' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Land
            </button>
            <button 
              onClick={() => setFilterType('commercial')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${filterType === 'commercial' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Commercial
            </button>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Scanning multi-family databases & calculating yields...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No properties match your current search criteria.
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
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
                >
                  {/* Property Image Header */}
                  <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                    <img 
                      src={deal.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80'} 
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                    
                    {/* Badges on Image */}
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

                    {/* Financial Matrix */}
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

                    {/* Card Footer */}
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
        )}
      </main>

      {/* POPUP / MODALE VIP */}
      {isVipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl shadow-emerald-500/10">
            {/* Bouton Fermer */}
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
                <h3 className="text-xl font-bold text-white mb-2">Bienvenue au Club VIP !</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Votre accès prioritaire est activé. Vous recevrez nos meilleures opportunités off-market 48h avant leur publication publique.
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
                  <BellRing className="w-3.5 h-3.5" /> Accès Investisseur Exclusif
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Recevez les deals <span className="text-emerald-400">48h en avant-première</span>
                </h2>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Rejoignez notre réseau privé d'acheteurs. Recevez les plexes à plus de 12% de rentabilité et les opportunités sous-évaluées avant tout le monde.
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
                    {vipSubmitting ? 'Inscription...' : 'Rejoindre la liste VIP Gratuite'}
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
