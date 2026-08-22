'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  ArrowUpRight, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Lock,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minCapRate, setMinCapRate] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setDeals(data);
        } else {
          // Exemples par défaut
          setDeals([
            {
              id: '1',
              title: 'Turnkey Duplex - 2 Units Fully Rented',
              city: 'Cleveland',
              state: 'OH',
              zip_code: '44105',
              price: 98000,
              cap_rate: 13.4,
              monthly_rent_estimate: 1950,
              gross_yield: 23.8,
              image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Apex Capital',
              seller_phone: '+1 (216) 884-2190'
            },
            {
              id: '2',
              title: 'Brick Multi-Family Value Add Duplex',
              city: 'Detroit',
              state: 'MI',
              zip_code: '48227',
              price: 79000,
              cap_rate: 14.2,
              monthly_rent_estimate: 1800,
              gross_yield: 27.3,
              image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Motor City Deals',
              seller_phone: '+1 (313) 490-1120'
            },
            {
              id: '3',
              title: 'Cash-Flowing Side-by-Side Duplex',
              city: 'Memphis',
              state: 'TN',
              zip_code: '38109',
              price: 115000,
              cap_rate: 12.1,
              monthly_rent_estimate: 2100,
              gross_yield: 21.9,
              image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
              seller_name: 'Bluff City RE',
              seller_phone: '+1 (901) 329-8740'
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

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = 
      deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.zip_code?.includes(searchQuery);
    
    const matchesCap = (deal.cap_rate || 0) >= minCapRate;
    const matchesPrice = (deal.price || 0) <= maxPrice;

    return matchesSearch && matchesCap && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#06080F]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-emerald-500 text-black font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              M
            </div>
            <span className="font-bold text-base tracking-tight text-white">MultiDeal<span className="text-emerald-400">Prop</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/vip" className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all">
              ⚡ VIP Pro Access
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live Real Estate Yield Scanner
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          Find High-Yield Duplexes <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            With 12%+ Cap Rates
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mb-8">
          Underwritten off-market multi-family deals, verified rent estimates, and direct wholesaler assignment contacts.
        </p>

        {/* Filter Bar */}
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3 rounded-2xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-2xl backdrop-blur">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by City, State, or Zip..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={minCapRate}
              onChange={(e) => setMinCapRate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="0">All Cap Rates</option>
              <option value="10">10%+ Cap Rate</option>
              <option value="12">12%+ Cap Rate</option>
              <option value="14">14%+ Cap Rate</option>
            </select>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Available Duplex Inventory ({filteredDeals.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-xs">
            Scanning multi-family databases...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image */}
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

                  {/* Body */}
                  <div className="p-6">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {deal.city || 'Market'}, {deal.state || ''} {deal.zip_code || ''}
                    </div>
                    <h3 className="text-base font-bold text-white mb-4 line-clamp-1">{deal.title}</h3>

                    <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">List Price</div>
                        <div className="text-base font-black text-white font-mono">${Number(deal.price || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Est. Rent / Mo</div>
                        <div className="text-base font-black text-emerald-400 font-mono">${Number(deal.monthly_rent_estimate || 1800).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
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
                    <Download className="w-3 h-3 text-emerald-400" /> Due Diligence PDF Audit
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#04060A] text-slate-500 text-xs py-8 text-center">
        <p>© {new Date().getFullYear()} MultiDealProp. All rights reserved.</p>
      </footer>

    </div>
  );
}
