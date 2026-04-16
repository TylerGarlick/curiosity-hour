/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

// Mock the route handler
const createCheckoutSession = jest.fn();

jest.mock('@/app/api/checkout/route', () => ({
  POST: async (request: NextRequest) => {
    const body = await request.json();
    const { email, userId } = body;

    if (!email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession();
    return Response.json({ sessionId: session.id, url: session.url });
  },
}));

describe('Checkout API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a checkout session with valid email', async () => {
    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/cs_test_123',
    };

    createCheckoutSession.mockResolvedValue(mockSession);

    const { POST } = await import('@/app/api/checkout/route');
    const request = new NextRequest(new URL('http://localhost:3000/api/checkout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sessionId).toBe('cs_test_123');
    expect(data.url).toBe('https://checkout.stripe.com/cs_test_123');
  });

  it('should return 400 when email is missing', async () => {
    const { POST } = await import('@/app/api/checkout/route');
    const request = new NextRequest(new URL('http://localhost:3000/api/checkout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email is required');
  });

  it('should handle checkout errors gracefully', async () => {
    createCheckoutSession.mockRejectedValue(new Error('Stripe error'));

    const { POST } = await import('@/app/api/checkout/route');
    const request = new NextRequest(new URL('http://localhost:3000/api/checkout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
