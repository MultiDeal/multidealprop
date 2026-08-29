import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendWelcomeEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialisation sécurisée du client Supabase Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    // 1. Vérification de la signature Stripe
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    // 2. Traitement des événements Stripe
    switch (event.type) {
      
      // CAS 1 : Paiement / Inscription complétée avec succès
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email;

        const planMeta = session.metadata?.plan || session.metadata?.tier || '';
        
        // Détection universelle : 'vip_49', 'vip', 'elite' ou montant de 49.00$
        const isVip = 
          planMeta === 'vip_49' || 
          planMeta === 'vip' || 
          planMeta === 'elite' || 
          session.amount_total === 4900;

        const planTier: 'starter' | 'vip' = isVip ? 'vip' : 'starter';

        console.log(`✅ Checkout completed for ${customerEmail} (Detected Tier: ${planTier})`);

        if (customerEmail) {
          const cleanEmail = customerEmail.toLowerCase().trim();

          // A. Sauvegarde dans Supabase si la table existe
          if (supabaseAdmin) {
            try {
              const { error: dbError } = await supabaseAdmin.from('subscriptions').upsert({
                email: cleanEmail,
                tier: planTier,
                status: 'active',
                stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'email' });

              if (dbError) {
                console.warn('Supabase sync notice:', dbError.message);
              } else {
                console.log(`🗄️ Supabase profile updated for ${cleanEmail} -> ${planTier}`);
              }
            } catch (dbErr: any) {
              console.warn('Supabase connection skipped:', dbErr.message);
            }
          }

          // B. Envoi du courriel d'activation avec le bon lien
          try {
            await sendWelcomeEmail({
              email: cleanEmail,
              tier: planTier,
            });
            console.log(`✉️ Welcome email dispatched to ${cleanEmail} with tier ${planTier}`);
          } catch (emailErr: any) {
            console.error('Failed to send welcome email:', emailErr.message);
          }
        }
        break;
      }

      // CAS 2 : Annulation d'abonnement (Met à jour le statut dans la DB si applicable)
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (supabaseAdmin && customerId) {
          try {
            await supabaseAdmin
              .from('subscriptions')
              .update({ status: 'canceled', updated_at: new Date().toISOString() })
              .eq('stripe_customer_id', customerId);
            console.log(`🚫 Subscription marked as canceled for customer ID: ${customerId}`);
          } catch (err: any) {
            console.warn('Error updating canceled subscription:', err.message);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Stripe Webhook processing error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
