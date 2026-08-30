import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ active: false, tier: null });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) {
      return NextResponse.json({ active: false, tier: null });
    }

    const isExpired = new Date(data.current_period_end).getTime() < Date.now();
    const isActive = data.status === 'active' && !isExpired;

    return NextResponse.json({
      active: isActive,
      tier: isActive ? data.plan_tier : null,
      currentPeriodEnd: data.current_period_end,
    });
  } catch (err) {
    return NextResponse.json({ active: false, tier: null });
  }
}
