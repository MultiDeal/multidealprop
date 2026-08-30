import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation client Supabase côté serveur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Cleveland';
  const state = searchParams.get('state') || 'OH';
  const limit = searchParams.get('limit') || '50';

  const apiKey = process.env.RENTCAST_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Clé RENTCAST_API_KEY absente dans les variables Vercel' },
      { status: 500 }
    );
  }

  try {
    // 1. Récupération des propriétés Multi-Family actives via RentCast
    const rentcastUrl = `https://api.rentcast.io/v1/listings/sale?city=${encodeURIComponent(
      city
    )}&state=${encodeURIComponent(state)}&propertyType=Multi-Family&status=Active&limit=${limit}`;

    const response = await fetch(rentcastUrl, {
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Erreur RentCast (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const rawListings = await response.json();

    if (!Array.isArray(rawListings) || rawListings.length === 0) {
      return NextResponse.json({
        success: true,
        message: `Aucune propriété trouvée pour ${city}, ${state}`,
        inserted: 0,
      });
    }

    // 2. Formatage des données compatibles avec votre schéma MultiDealProp
    const formattedDeals = rawListings.map((item: any) => {
      const price = item.price || 100000;
      const units = item.units || item.bedrooms || 2;
      const estimatedRent = item.rent || Math.round(price * 0.012);
      const address = item.formattedAddress || `${item.addressLine1 || ''}, ${item.city}, ${item.state} ${item.zipCode || ''}`.trim();

      return {
        id: String(item.id || item.id_ || Math.random().toString(36).substring(2, 9)),
        title: `${units}-Unit Multi-Family Opportunity`,
        location: `${item.city}, ${item.state}`,
        address: address,
        apn: item.county || 'N/A',
        price: price,
        arv: Math.round(price * 1.3),
        units: units,
        year_built: item.yearBuilt ? String(item.yearBuilt) : '1950',
        monthly_rent: estimatedRent,
        other_income: 50,
        vacancy_rate: 5,
        taxes: Math.round(price * 0.015),
        insurance: Math.round(price * 0.008),
        management_rate: 8,
        maintenance_rate: 5,
        capex_rate: 5,
        water_sewer: 800,
        image_url: item.primaryPhoto || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        wholesaler_name: 'Apex Contract Desk',
        wholesaler_phone: '(216) 555-0194',
        wholesaler_email: 'acquisitions@apexwholesale.com',
        created_at: new Date().toISOString(),
      };
    });

    // 3. Insertion / Mise à jour dans la table "deals" de Supabase
    const { data: insertedData, error: dbError } = await supabase
      .from('deals')
      .upsert(formattedDeals, { onConflict: 'id' });

    if (dbError) {
      return NextResponse.json({
        success: false,
        error: `Erreur Supabase: ${dbError.message}`,
        sampleData: formattedDeals[0],
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      city: `${city}, ${state}`,
      totalFetched: rawListings.length,
      message: `${rawListings.length} propriétés importées et sauvegardées avec succès dans Supabase !`,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
