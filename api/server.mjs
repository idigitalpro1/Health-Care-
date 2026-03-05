import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.API_PORT || 8790);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');

const PRODUCT_CONFIG = {
  doctor_listing: {
    label: 'Doctor Listing',
    priceId: process.env.STRIPE_PRICE_DOCTOR_LISTING || '',
    unlockKey: 'villager_unlock_doctor_listing',
  },
  press_kit: {
    label: 'Press Kit Access',
    priceId: process.env.STRIPE_PRICE_PRESS_KIT || '',
    unlockKey: 'villager_unlock_press_kit',
  },
};

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' })
  : null;

function resolveBaseUrl(req) {
  const host = req.get('host');
  if (!host) return APP_URL;
  return `${req.protocol}://${host}`.replace(/\/$/, '');
}

function ensureStripeReady(res) {
  if (!stripe) {
    res.status(500).json({
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.',
    });
    return false;
  }
  return true;
}

function parseProductType(input) {
  if (input === 'doctor_listing' || input === 'press_kit') return input;
  return null;
}

app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'stripe-payments-api',
    stripeConfigured: Boolean(stripe),
  });
});

app.post('/api/v1/payments/checkout-session', async (req, res) => {
  if (!ensureStripeReady(res)) return;

  const productType = parseProductType(req.body?.productType);
  if (!productType) {
    res.status(400).json({ error: 'Invalid productType.' });
    return;
  }

  const config = PRODUCT_CONFIG[productType];
  if (!config.priceId) {
    res.status(400).json({
      error: `Missing price id for ${productType}. Set ${productType === 'doctor_listing' ? 'STRIPE_PRICE_DOCTOR_LISTING' : 'STRIPE_PRICE_PRESS_KIT'}.`,
    });
    return;
  }

  const baseUrl = resolveBaseUrl(req);
  const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/?checkout=cancelled`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: config.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        product_type: productType,
      },
      allow_promotion_codes: true,
      customer_email: req.body?.customerEmail || undefined,
    });

    res.json({
      id: session.id,
      url: session.url,
      productType,
      label: config.label,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/v1/payments/session/:sessionId', async (req, res) => {
  if (!ensureStripeReady(res)) return;

  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const productType = parseProductType(session.metadata?.product_type || '');
    const unlockKey = productType ? PRODUCT_CONFIG[productType].unlockKey : null;

    res.json({
      id: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
      customerEmail: session.customer_details?.email || session.customer_email || null,
      productType,
      unlockKey,
      unlocked: session.payment_status === 'paid' && Boolean(unlockKey),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe error';
    res.status(404).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`[stripe-api] listening on http://127.0.0.1:${PORT}`);
});
