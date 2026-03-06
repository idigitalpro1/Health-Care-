<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3ad2b7dc-3eaa-4b30-b818-895e06a7de0d

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   `npm install`
2. Create local env file:
   `cp .env.example .env.local`
3. Fill required keys in `.env.local` (keep this file untracked):
   - `GEMINI_API_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
4. Start Stripe backend API (terminal 1):
   `npm run dev:api`
5. Start Vite frontend (terminal 2):
   `npm run dev`
6. Open:
   `http://localhost:3000`

## Stripe setup

### 1) Register payment method domains

```
npm run stripe:register-domains
```

Script file: `scripts/register-stripe-domain.js`  
Domains registered:
- `registercall.com`
- `conews.press`
- `healthhq.conews.press`
- optional: `healthiq.registercall.com` (or override with `STRIPE_OPTIONAL_DOMAIN`)

### 2) Create products/prices

```
npm run stripe:setup-products
```

This creates/fetches:
- `Doctor Listing`
- `Press Kit Access`

Copy printed price IDs into `.env.local`:
- `STRIPE_PRICE_DOCTOR_LISTING`
- `STRIPE_PRICE_PRESS_KIT`

### 3) Payment flow endpoints

- `POST /api/v1/payments/checkout-session`
- `GET /api/v1/payments/session/:sessionId`
- `GET /api/v1/health`

Checkout success returns to:
- `/success?session_id=...`

The success screen verifies session payment status and unlocks the relevant feature locally.
