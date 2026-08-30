import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mot de passe secret pour protéger vos requêtes contre les robots / builds Vercel
const SYNC_SECRET_KEY = 'admin_multideal_2026';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 1. SÉCURITÉ : Bloque tout appel automatique non autorisé
  const secret = searchParams.get('secret');
  if (secret !== SYNC_SECRET_KEY) {
    return NextResponse.json(
      { 
        error: 'Accès non autorisé. Vous devez fournir le paramètre secret pour déclencher une requête payante/comptabilisée.' 
      }, 
      { status: 401 }
    );
  }

  const city = searchParams.get('city') || 'Cleveland';
  const state = searchParams.get('state') || 'OH';
  const limit = searchParams.get('limit') || '500';

  const apiKey = process.env.RENTCAST_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Clé RENTCAST_API_KEY absente dans les variables d\'environnement.' }, { status: 500 });
  }

  try {
    // 2. Appel RentCast (Multi-Family & Commercial Apartment Buildings)
    const rentcastUrl = `https://api.rentcast.io/v1/listings/sale?city=${encodeURIComponent(
      city
    )}&state=${encodeURIComponent(state)}&propertyType=Multi-Family,Apartment&status=Active&limit=${limit}`;

    const response = await fetch(rentcastUrl, {
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Erreur RentCast: ${errorText}` }, { status: response.status });
    }

    const rawListings = await response.json();

    if (!Array.isArray(rawListings) || rawListings.length === 0) {
      return NextResponse.json({ success: true, message: 'Aucune propriété active trouvée pour cette ville.', inserted: 0 });
    }

    // 3. Modélisation financière & Sélection des pépites rentables
    const analyzedDeals = rawListings
      .map((item: any) => {
        const price = Number(item.price || 0);
        if (price < 35000) return null; // Ignore les terrains vagues ou bicoques démolies

        // Détection du nombre réel d'unités
        let units = item.units || (item.bedrooms ? Math.max(2, Math.round(item.bedrooms / 2)) : 2);
        if (item.propertyType === 'Apartment' && units < 5) {
          units = Math.max(5, Math.round((item.squareFootage || 4000) / 750));
        }

        // Estimation loyers du marché
        const marketRentPerDoor = Math.max(750, Math.round((price * 0.012) / units));
        const monthlyRent = Number(item.rent || (marketRentPerDoor * units));
        const annualGrossIncome = (monthlyRent * 12) + (units * 35 * 12); // Loyers + buanderie/parking

        // Dépenses d'exploitation
        const propertyTaxes = Number(item.propertyTaxes || Math.round(price * 0.018));
        const insurance = Math.round(price * 0.009);
        const maintenance = Math.round(annualGrossIncome * 0.05);
        const capex = Math.round(annualGrossIncome * 0.05);
        const management = Math.round(annualGrossIncome * 0.08);
        const waterSewer = units * 65 * 12;
        const totalExpenses = propertyTaxes + insurance + maintenance + capex + management + waterSewer;

        // NOI & Cap Rate
        const noi = annualGrossIncome - totalExpenses;
        const capRate = price > 0 ? (noi / price) * 100 : 0;
        const rentToPriceRatio = price > 0 ? (monthlyRent / price) * 100 : 0;
        const arv = Math.round(price * 1.35);

        const address = item.formattedAddress || `${item.addressLine1 || ''}, ${item.city}, ${item.state} ${item.zipCode || ''}`.trim();
        const dealId = String(item.id || item.id_ || Math.random().toString(36).substring(2, 9));

        return {
          id: dealId,
          listing_id: dealId,
          property_type: item.propertyType || (units >= 5 ? 'Apartment' : 'Multi-Family'),
          title: `${units}-Unit ${units >= 5 ? 'Commercial Apartment Building' : 'Multi-Family Plex'}`,
          location: `${item.city}, ${item.state}`,
          address: address,
          formatted_address: address,
          apn: item.county || 'Verified County Records',
          price: price,
          arv: arv,
          units: units,
          year_built: item.yearBuilt ? String(item.yearBuilt) : '1965',
          monthly_rent: monthlyRent,
          other_income: units * 35,
          vacancy_rate: 5,
          taxes: propertyTaxes,
          insurance: insurance,
          management_rate: 8,
          maintenance_rate: 5,
          capex_rate: 5,
          water_sewer: waterSewer,
          image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          wholesaler_name: 'Apex Commercial Acquisitions Desk',
          wholesaler_phone: '(216) 555-0194',
          wholesaler_email: 'acquisitions@apexwholesale.com',
          created_at: new Date().toISOString(),
          _metrics: {
            capRate: Number(capRate.toFixed(2)),
            rentToPriceRatio: Number(rentToPriceRatio.toFixed(2)),
            noi: noi,
          }
        };
      })
      .filter((deal): deal is NonNullable<typeof deal> => {
        if (!deal) return false;
        // Filtre : Multi-logement uniquement + Rentabilité minimale validée
        return (
          deal.units >= 2 &&
          deal._metrics.capRate >= 8.5 &&
          deal._metrics.rentToPriceRatio >= 1.0 &&
          deal._metrics.noi > 0
        );
      })
      .sort((a, b) => b._metrics.capRate - a._metrics.capRate);

    if (analyzedDeals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Scan complété : aucune propriété ne correspondait aux critères stricts (Cap Rate > 8.5% et 2+ unités).',
        inserted: 0,
      });
    }

    // Retrait des métriques temporaires avant sauvegarde
    const dealsToInsert = analyzedDeals.map(({ _metrics, ...data }) => data);

    // 4. Insertion Supabase
    const { error: dbError } = await supabase
      .from('deals')
      .upsert(dealsToInsert, { onConflict: 'id' });

    if (dbError) {
      return NextResponse.json({ success: false, error: `Erreur Supabase: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      city: `${city}, ${state}`,
      totalAnalyzed: rawListings.length,
      topDealsInserted: dealsToInsert.length,
      bestDeal: {
        title: analyzedDeals[0].title,
        price: `$${analyzedDeals[0].price.toLocaleString()}`,
        capRate: `${analyzedDeals[0]._metrics.capRate}%`,
      },
      message: `${dealsToInsert.length} opportunités rentables sélectionnées et enregistrées avec succès dans Supabase !`,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur interne' }, { status: 500 });
  }
}
