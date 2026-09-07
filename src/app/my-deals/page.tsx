'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Trash2, Edit3, Plus, ArrowLeft, Loader2, LogOut, Check, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyDealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // État pour le deal en cours d'édition rapide
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: 0,
    monthly_rent: 0,
  });

  useEffect(() => {
    fetchMyDeals();
  }, []);

  const fetchMyDeals = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserEmail(user.email ?? null);

    // Grâce aux politiques RLS, même sans filtrer explicitement,
    // Supabase protège les données, mais filtrer par user_id garantit l'affichage propre
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      alert('Error loading deals: ' + error.message);
    } else {
      setDeals(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (error) {
      alert('Error deleting listing: ' + error.message);
    } else {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const startEdit = (deal: any) => {
    setEditingId(deal.id);
    setEditForm({
      title: deal.title,
      price: deal.price,
      monthly_rent: deal.monthly_rent,
    });
  };

  const saveEdit = async (id: string | number) => {
    const { error } = await supabase
      .from('deals')
      .update({
        title: editForm.title,
        price: Number(editForm.price),
        monthly_rent: Number(editForm.monthly_rent),
      })
      .eq('id', id);

    if (error) {
      alert('Error updating deal: ' + error.message);
    } else {
      setDeals((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...editForm } : d))
      );
      setEditingId(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans">
      <header className="border-b border-slate-800/80 bg-[#04060C]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">My Listings Dashboard</h1>
            <p className="text-slate-400 text-xs mt-1">Manage and edit your active portfolio deals.</p>
          </div>
          <Link
            href="/submit-deal"
            className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Deal
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h2 className="text-lg font-bold text-white">No listings found</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't listed any deals yet. Add your first multi-family property to generate verified underwritten memos.
            </p>
            <Link
              href="/submit-deal"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Post your first deal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {deals.map((deal) => {
              const isEditing = editingId === deal.id;
              return (
                <div
                  key={deal.id}
                  className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700"
                >
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Price"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                            className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Rent"
                            value={editForm.monthly_rent}
                            onChange={(e) => setEditForm({ ...editForm, monthly_rent: Number(e.target.value) })}
                            className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">{deal.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{deal.formatted_address}</p>
                        <div className="flex gap-4 mt-2 text-xs font-mono">
                          <span className="text-white">${Number(deal.price).toLocaleString()}</span>
                          <span className="text-emerald-400">${Number(deal.monthly_rent).toLocaleString()}/mo</span>
                          <span className="text-slate-400">{deal.units} Doors</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(deal.id)}
                          className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 p-2 rounded-xl text-xs font-bold transition"
                          title="Save Changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs transition"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(deal)}
                          className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 p-2.5 rounded-xl transition"
                          title="Edit Listing"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(deal.id)}
                          className="bg-slate-900 hover:bg-red-500/20 text-red-400 border border-slate-700 hover:border-red-500/50 p-2.5 rounded-xl transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
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
