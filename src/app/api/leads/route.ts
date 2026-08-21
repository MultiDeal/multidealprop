import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, interested_in } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // 1. Enregistrement dans Supabase
    const { error: dbError } = await supabase
      .from('leads')
      .insert([{ email, interested_in: interested_in || 'Général' }]);

    if (dbError) {
      console.error('Erreur Supabase:', dbError);
    }

    // 2. Envoi de la notification par email
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (resendApiKey && adminEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'MultiDealProp <support@multidealprop.com>',
          to: adminEmail,
          subject: `🔥 Nouveau Lead Investisseur : ${email}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0B0F19; color: #ffffff; padding: 24px; border-radius: 12px;">
              <h2 style="color: #10B981; margin-top: 0;">Nouveau Prospect Détecté !</h2>
              <p style="color: #94A3B8; font-size: 14px;">Un utilisateur vient de soumettre ses coordonnées sur MultiDealProp.</p>
              
              <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 6px 0; font-size: 14px;"><strong>Email investisseur :</strong> <span style="color: #38BDF8;">${email}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Intérêt / Origine :</strong> <span style="color: #FBBF24;">${interested_in || 'Général'}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
              </div>

              <p style="font-size: 12px; color: #64748B;">MultiDealProp Notification System</p>
            </div>
          `
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur API Lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
