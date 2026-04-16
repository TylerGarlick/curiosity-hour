import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || '';
const SUCCESS_URL = process.env.NEXT_PUBLIC_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success`;
const CANCEL_URL = process.env.NEXT_PUBLIC_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?canceled=true`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: CANCEL_URL,
      customer_email: email,
      metadata: {
        userId: userId || '',
        email: email,
        product: 'curiosity-hour-pro',
      },
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
