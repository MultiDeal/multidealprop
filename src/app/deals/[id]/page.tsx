import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import DealClientView from './DealClientView';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: Promise<{ id: string }>;
}

// 1. Balises Open Graph pour Facebook & Twitter (Next.js 15 async params)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rawId = decodeURIComponent(id);

  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('id', rawId)
    .single();

  if (!deal) {
    return {
      title: 'Deal Not Found | MultiDealProp',
      description: 'Multi-family investment underwriting platform.'
    };
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
  let ogImage = fallbackImage;

  if (Array.isArray(deal.images) && deal.images.length > 0 && typeof deal.images[0] === 'string' && deal.images[0].startsWith('http')) {
    ogImage = deal.images[0];
  } else if (deal.image_url && typeof deal.image_url === 'string' && deal.image_url.startsWith('http')) {
    ogImage = deal.image_url;
  }

  const cleanTitle = `${deal.title || 'Multi-Family Deal'} - $${Number(deal.price || 0).toLocaleString()} (${deal.units || 2} Units)`;
  const cleanDescription = `Underwritten Multi-Family in ${deal.formatted_address || deal.address || 'Midwest'}. Gross Rent: $${Number(deal.monthly_rent || 0).toLocaleString()}/mo. View full DSCR audit & diligence memo.`;
  const shareUrl = `https://www.multidealprop.com/deals/${deal.id}`;

  return {
    title: `${cleanTitle} | MultiDealProp`,
    description: cleanDescription,
    alternates: {
      canonical: shareUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: shareUrl,
      siteName: 'MultiDealProp',
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: deal.title || 'Property Underwriting',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      images: [ogImage],
    }
  };
}

// 2. Server Component (Next.js 15 async params)
export default async function DealPage({ params }: PageProps) {
  const { id } = await params;
  const rawId = decodeURIComponent(id);

  const { data: initialDeal, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', rawId)
    .single();

  if (error || !initialDeal) {
    notFound();
  }

  return <DealClientView initialDeal={initialDeal} dealId={rawId} />;
}
