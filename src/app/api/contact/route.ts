import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Sauvegarde dans Supabase
    if (supabaseUrl && supabaseKey) {
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
    }

    // 2. Envoi par Resend (instancié uniquement à l'exécution de la requête)
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY manquante dans les variables d’environnement');
      return NextResponse.json({ success: true, warning: 'Saved to database, email skipped (no key)' }, { status: 200 });
    }

    const resend = new Resend(apiKey);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'MultiDealProp <onboarding@resend.dev>',
      to: ['prosebmail@gmail.com'], // Votre adresse autorisée en mode test
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
