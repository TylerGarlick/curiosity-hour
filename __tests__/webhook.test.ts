/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Stripe Webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
  });

  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('should return 400 for invalid signature', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    
    const request = new NextRequest(new URL('http://localhost:3000/api/webhooks/stripe'), {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid_signature' },
      body: 'raw_body',
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should handle checkout.session.completed event', async () => {
    const Stripe = (await import('stripe')).default;
    const mockStripe = new Stripe('sk_test_mock');
    
    (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          customer_email: 'test@example.com',
          amount_total: 299,
          currency: 'usd',
          payment_intent: 'pi_123',
          metadata: {
            userId: 'user_123',
            email: 'test@example.com',
            product: 'curiosity-hour-pro',
          },
        },
      },
    });

    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const request = new NextRequest(new URL('http://localhost:3000/api/webhooks/stripe'), {
      method: 'POST',
      headers: { 'stripe-signature': 'valid_signature' },
      body: 'raw_body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('should handle other event types gracefully', async () => {
    const Stripe = (await import('stripe')).default;
    const mockStripe = new Stripe('sk_test_mock');
    
    (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'payment_intent.created',
      data: { object: {} },
    });

    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const request = new NextRequest(new URL('http://localhost:3000/api/webhooks/stripe'), {
      method: 'POST',
      headers: { 'stripe-signature': 'valid_signature' },
      body: 'raw_body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });
});
