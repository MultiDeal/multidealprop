import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Cleveland';
  const state = searchParams.get('state') || 'OH';
  const limit = searchParams.get('limit') || '50';

  const apiKey = process.env.RENTCAST_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Clé RENTCAST_API_KEY non configurée dans Vercel' },
      { status: 500 }
    );
  }

  try {
    // 1 seule requête RentCast pour récupérer les propriétés Multi-Family à vendre
    const url = `https://api.rentcast.io/v1/listings/sale?city=${encodeURIComponent(
      city
    )}&state=${encodeURIComponent(state)}&propertyType=Multi-Family&status=Active&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Erreur RentCast (${response.status}): ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Formatage des données pour MultiDealProp
    const deals = (data || []).map((item: any) => {
      const price = item.price || 100000;
      const units = item.units || item.bedrooms || 2;
      const estimatedRent = item.rent || Math.round(price * 0.012); // Estimation loyer si non fourni

      return {
        id: item.id || String(Math.random()),
        title: `${units}-Unit Multi-Family Property`,
        location: `${item.city}, ${item.state}`,
        address: item.formattedAddress || `${item.addressLine1}, ${item.city}, ${item.state} ${item.zipCode}`,
        price: price,
        units: units,
        yearBuilt: item.yearBuilt ? String(item.yearBuilt) : 'N/A',
        monthlyRent: estimatedRent,
        pricePerDoor: Math.round(price / units),
        daysOnMarket: item.daysOnMarket || 0,
        squareFeet: item.squareFootage || 0,
        imageUrl: item.primaryPhoto || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      };
    });

    return NextResponse.json({
      success: true,
      city: `${city}, ${state}`,
      count: deals.length,
      deals: deals,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur interne' },
      { status: 500 }
    );
  }
}
