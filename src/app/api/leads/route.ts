import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.tcpa_accepted) {
      return NextResponse.json(
        { error: 'TCPA consent is required to submit a request.' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('leads').insert([
      {
        property_type: data.propertyType,
        loan_purpose: data.loanPurpose,
        property_value: Number(data.propertyValue),
        loan_amount: Number(data.loanAmount),
        state: data.state,
        credit_score: data.creditScore,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        tcpa_accepted: data.tcpa_accepted,
        status: 'new'
      }
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
