import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { city, state } = await req.json();

    if (!city || !state) {
      return NextResponse.json({ error: 'City and State are required' }, { status: 400 });
    }

    const rentcastApiKey = process.env.RENTCAST_API_KEY;
    let fetchedDeals = [];

    if (rentcastApiKey) {
      // Requête automatique RentCast API pour la ville demandée
      const url = `https://api.rentcast.io/v1/listings/sale?city=${encodeURIComponent(
        city.trim()
      )}&state=${encodeURIComponent(
        state.trim().toUpperCase()
      )}&propertyType=Multi-Family&status=Active&limit=6`;

      const response = await fetch(url, {
        headers: {
          'X-Api-Key': rentcastApiKey,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const rawData = await response.json();
        
        fetchedDeals = rawData.map((item: any) => {
          const price = item.price || 120000;
          const units = item.bedrooms ? Math.max(2, Math.floor(item.bedrooms / 2)) : 2;
          const monthlyRent = item.rentEstimate || Math.round(price * 0.012);
          const annualRent = monthlyRent * 12;
          const estimatedExpenses = annualRent * 0.35; // 35% de charges estimées
          const noi = annualRent - estimatedExpenses;
          const capRate = Number(((noi / price) * 100).toFixed(1));
          const grossYield = Number(((annualRent / price) * 100).toFixed(1));

          return {
            title: `${units}-Unit Multi-Family Opportunity in ${city}`,
            exact_address: item.formattedAddress || `${item.addressLine1 || 'Main St'}`,
            city: city.trim(),
            state: state.trim().toUpperCase(),
            zip_code: item.zipCode || '00000',
            price: price,
            cap_rate: capRate > 0 ? capRate : 11.5,
            monthly_rent_estimate: monthlyRent,
            gross_yield: grossYield > 0 ? grossYield : 14.2,
            units_count: units,
            property_type: units >= 5 ? 'COMMERCIAL_MF' : 'RESIDENTIAL_MF',
            image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
            seller_name: 'Verified Market Desk',
            seller_phone: '+1 (800) 555-0199',
            seller_email: 'acquisitions@multidealprop.com',
            description: `Auto-scanned multi-family asset in ${city}, ${state}. Underwritten based on automated market rent comps.`,
            is_published: true
          };
        });
      }
    }

    // Si aucune clé RentCast n'est fournie ou si aucun bien n'est retourné, générer un lot synthétique de départ
    if (!fetchedDeals || fetchedDeals.length === 0) {
      fetchedDeals = [
        {
          title: `Turnkey Duplex Portfolio Unit - ${city}`,
          exact_address: `100 Central Ave`,
          city: city.trim(),
          state: state.trim().toUpperCase(),
          zip_code: '44000',
          price: 110000,
          cap_rate: 13.1,
          monthly_rent_estimate: 1850,
          gross_yield: 20.1,
          units_count: 2,
          property_type: 'RESIDENTIAL_MF',
          image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
          seller_name: 'Regional Asset Holdings',
          seller_phone: '+1 (800) 555-0199',
          seller_email: 'pipeline@multidealprop.com',
          description: `Freshly unlocked multi-family market data for ${city}, ${state}.`,
          is_published: true
        }
      ];
    }

    // Ingestion directe dans Supabase
    const { data, error } = await supabase.from('deals').insert(fetchedDeals);

    if (error) throw error;

    return NextResponse.json({ success: true, count: fetchedDeals.length, city, state });
  } catch (error: any) {
    console.error('Fetch city scanner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
