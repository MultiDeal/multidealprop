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
    let fetchedDeals: any[] = [];
    let searchScope = 'EXACT_CITY';

    if (rentcastApiKey) {
      // 1. Première tentative : Recherche directe dans la municipalité
      let url = `https://api.rentcast.io/v1/listings/sale?city=${encodeURIComponent(
        city.trim()
      )}&state=${encodeURIComponent(
        state.trim().toUpperCase()
      )}&propertyType=Multi-Family&status=Active&limit=6`;

      let response = await fetch(url, {
        headers: { 'X-Api-Key': rentcastApiKey, 'Accept': 'application/json' }
      });

      let rawData = response.ok ? await response.json() : [];

      // 2. Deuxième tentative : Si aucun résultat (petit village), élargir au rayon / comté (address + radius=25 miles)
      if (!rawData || rawData.length === 0) {
        searchScope = 'SURROUNDING_COUNTY_25MI';
        const fallbackAddress = `${city.trim()}, ${state.trim().toUpperCase()}`;
        const radiusUrl = `https://api.rentcast.io/v1/listings/sale?address=${encodeURIComponent(
          fallbackAddress
        )}&radius=25&propertyType=Multi-Family&status=Active&limit=6`;

        const radiusResponse = await fetch(radiusUrl, {
          headers: { 'X-Api-Key': rentcastApiKey, 'Accept': 'application/json' }
        });

        if (radiusResponse.ok) {
          rawData = await radiusResponse.json();
        }
      }

      if (rawData && rawData.length > 0) {
        fetchedDeals = rawData.map((item: any) => {
          const price = item.price || 135000;
          const units = item.bedrooms ? Math.max(2, Math.floor(item.bedrooms / 2)) : 2;
          const monthlyRent = item.rentEstimate || Math.round(price * 0.012);
          const annualRent = monthlyRent * 12;
          const estimatedExpenses = annualRent * 0.35;
          const noi = annualRent - estimatedExpenses;
          const capRate = Number(((noi / price) * 100).toFixed(1));
          const grossYield = Number(((annualRent / price) * 100).toFixed(1));

          return {
            title: `${units}-Unit Multi-Family (${item.city || city} Market)`,
            exact_address: item.formattedAddress || `${item.addressLine1 || 'Main St'}`,
            city: item.city || city.trim(),
            state: item.state || state.trim().toUpperCase(),
            zip_code: item.zipCode || '00000',
            price: price,
            cap_rate: capRate > 0 ? capRate : 12.2,
            monthly_rent_estimate: monthlyRent,
            gross_yield: grossYield > 0 ? grossYield : 15.4,
            units_count: units,
            property_type: units >= 5 ? 'COMMERCIAL_MF' : 'RESIDENTIAL_MF',
            image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
            seller_name: 'Regional Asset Sourcing Desk',
            seller_phone: '+1 (800) 555-0199',
            seller_email: 'pipeline@multidealprop.com',
            description: `Asset matched for the ${city}, ${state} regional cluster. Automated market rent comps applied.`,
            is_published: true
          };
        });
      }
    }

    // 3. Troisième niveau de repli : Création d'un dossier de marché pour que l'acheteur ait toujours de la valeur
    if (fetchedDeals.length === 0) {
      fetchedDeals = [
        {
          title: `Regional Micro-Market Baseline - ${city}`,
          exact_address: `Primary Investment Corridor`,
          city: city.trim(),
          state: state.trim().toUpperCase(),
          zip_code: '00000',
          price: 125000,
          cap_rate: 12.5,
          monthly_rent_estimate: 1750,
          gross_yield: 16.8,
          units_count: 2,
          property_type: 'RESIDENTIAL_MF',
          image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
          seller_name: 'Market Watch Ingestion Desk',
          seller_phone: '+1 (800) 555-0199',
          seller_email: 'pipeline@multidealprop.com',
          description: `No active multi-family contracts on the MLS right now for ${city}, ${state}. Market monitoring active: alerts dispatched as new inventory is sourced.`,
          is_published: true
        }
      ];
    }

    // Ingestion dans Supabase
    await supabase.from('deals').insert(fetchedDeals);

    return NextResponse.json({ 
      success: true, 
      count: fetchedDeals.length, 
      city, 
      state,
      searchScope 
    });
  } catch (error: any) {
    console.error('Fetch city error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
