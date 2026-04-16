import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleSuccessfulPayment(session);
    } catch (error) {
      console.error('Error handling successful payment:', error);
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const email = session.customer_email || session.metadata?.email;
  const userId = session.metadata?.userId;
  const amount = session.amount_total || 0;
  const currency = session.currency || 'usd';
  const paymentIntent = session.payment_intent as string;

  if (!email) {
    console.error('No email found in session');
    return;
  }

  // Update or create user in Supabase
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    // Update existing user
    await supabaseAdmin
      .from('users')
      .update({
        is_pro: true,
        purchase_date: new Date().toISOString(),
        stripe_customer_id: session.customer as string,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id);
  } else {
    // Create new user
    await supabaseAdmin.from('users').insert({
      email,
      is_pro: true,
      purchase_date: new Date().toISOString(),
      stripe_customer_id: session.customer as string,
    });
  }

  // Record the purchase
  await supabaseAdmin.from('purchases').insert({
    user_email: email,
    user_id: userId || null,
    amount,
    currency,
    stripe_payment_id: paymentIntent,
    status: 'completed',
    product: 'curiosity-hour-pro',
  });

  console.log(`Pro upgrade completed for ${email}`);
}
