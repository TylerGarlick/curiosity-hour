# Revenue System Documentation

## Curiosity Hour - Hybrid Monetization Approach

### Overview
This document outlines the revenue system implemented for the Curiosity Hour web application.

### Pricing Model
- **Free Tier**: Ad-supported with full functionality
- **Pro Tier**: $2.99 one-time purchase (not a subscription)

### Pro Features
1. Remove all advertisements
2. Unlimited custom questions
3. Exclusive Pro-only question categories
4. Priority support
5. Early access to new features

### Implementation

#### Free Tier (Ad-Supported)
- Displays a non-intrusive banner ad at the bottom of the screen
- Ad banner shows "Ad-supported free tier" message with upgrade link
- In production, this would integrate with Google AdMob or similar ad network

#### Pro Tier (One-Time Purchase)
- User purchases once, owns Pro forever
- Status stored in localStorage (for demo purposes)
- In production, purchase verification would happen on a backend

### Revenue System Options

#### Option 1: Stripe Checkout (Recommended for Web)
- **Setup**: Create a Stripe account and product
- **Implementation**:
  1. Create product in Stripe Dashboard ($2.99 one-time)
  2. Create Stripe Checkout session API endpoint
  3. Redirect to Stripe Checkout on "Pay" button click
  4. Use Stripe Webhooks to verify payment
  5. Store Pro status in database keyed by user ID or email
- **Pros**: Easy setup, secure, handles receipts
- **Cons**: Requires backend for webhook verification

#### Option 2: Google AdMob (For Mobile)
- If deployed as a mobile app (Android/iOS), use AdMob
- Requires separate mobile app build
- More complex integration

#### Option 3: LemonSqueezy (Alternative)
- Similar to Stripe, simpler for indie devs
- Handles VAT/tax automatically
- Good for digital products

### Production Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web App       │────▶│   Backend API   │────▶│   Database      │
│   (Next.js)     │     │   (Next.js)    │     │   (Postgres/    │
│                 │     │                 │     │    Supabase)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Stripe       │
                        │   (Payments)   │
                        └─────────────────┘
```

### Database Schema (for production)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  is_pro BOOLEAN DEFAULT FALSE,
  purchase_date TIMESTAMP,
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  stripe_payment_id TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Current Implementation Notes

- Currently using localStorage for demo purposes
- Pro status is stored per-browser/device
- Payment flow is simulated (shows alert explaining production would use Stripe)

### To Deploy for Production

1. Set up Stripe account at https://stripe.com
2. Create product with price: $2.99
3. Create API route for checkout session
4. Add webhook handler to verify payment
5. Replace localStorage with database-backed user table
6. Optionally add: purchase restoration, receipt emails

### Files Changed

- `hooks/useProStatus.ts` - Pro status management
- `components/AdBanner.tsx` - Ad banner component
- `components/ProUpgradeModal.tsx` - Upgrade UI
- `app/page.tsx` - Integrated monetization
- `components/WelcomeScreen.tsx` - Added upgrade prompt