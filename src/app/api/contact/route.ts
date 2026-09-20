import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Sauvegarde dans la table Supabase "contacts"
    const { error: dbError } = await supabase.from('contacts').insert([
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
    ]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
    }

    // 2. Envoi de l'email d'alerte via Resend (syntaxe reply_to conforme au SDK)
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'MultiDealProp <onboarding@resend.dev>', // Modifiez avec support@multidealprop.com si le domaine est validé sur Resend
      to: ['support@multidealprop.com'], // Ou votre adresse de réception directe
      reply_to: data.email,
      subject: `[Nouveau Contact] ${data.subject} - ${data.name}`,
      text: `Nouveau message reçu depuis multidealprop.com :\n\nNom: ${data.name}\nEmail: ${data.email}\nSujet: ${data.subject}\n\nMessage:\n${data.message}`,
    });

    if (emailError) {
      console.error('Resend Error:', emailError);
      return NextResponse.json({ error: emailError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: emailData?.id }, { status: 200 });

  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
