import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });
dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
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

const gemini = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

function resolveBaseUrl(req) {
  const host = req.get('host');
  if (!host) return APP_URL;
  return `${req.protocol}://${host}`.replace(/\/$/, '');
}

function ensureStripeReady(res) {
  if (!stripe) {
    res.status(500).json({ error: 'Stripe is not configured.' });
    return false;
  }
  return true;
}

function ensureGeminiReady(res) {
  if (!gemini) {
    res.status(503).json({ error: 'Gemini is not configured.' });
    return false;
  }
  return true;
}

function parseProductType(input) {
  if (input === 'doctor_listing' || input === 'press_kit') return input;
  return null;
}

export function registerApiRoutes(app) {
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/v1/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'health-care-app',
      stripeConfigured: Boolean(stripe),
      geminiConfigured: Boolean(gemini),
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
        error: `Missing price id for ${productType}.`,
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
        metadata: { product_type: productType },
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

  app.post('/api/v1/ai/chat', async (req, res) => {
    if (!ensureGeminiReady(res)) return;

    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      res.status(400).json({ error: 'Missing message.' });
      return;
    }

    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are Susan Sweeney, a dedicated healthcare advocate for the South Denver community (Highlands Ranch, Greenwood Village, Cherry Hills).
Be compassionate, professional, and concise. Help patients find the right specialists and understand local healthcare options.

User says: ${message}`,
              },
            ],
          },
        ],
        config: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });

      res.json({
        text:
          response.text ||
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      });
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Gemini error';
      res.status(500).json({ error: messageText });
    }
  });

  app.post('/api/v1/ai/tts', async (req, res) => {
    if (!ensureGeminiReady(res)) return;

    const asset = req.body?.asset;
    if (!asset || typeof asset.name !== 'string') {
      res.status(400).json({ error: 'Missing asset payload.' });
      return;
    }

    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [
          {
            parts: [
              {
                text: `Media Asset: ${asset.name}. Type: ${asset.type}. Size: ${asset.size}. Tags: ${
                  Array.isArray(asset.tags) ? asset.tags.join(', ') : 'None'
                }. Description: ${asset.description || 'No description provided.'}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) {
        res.status(502).json({ error: 'No audio returned.' });
        return;
      }

      res.json({ audioData, mimeType: 'audio/wav' });
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Gemini TTS error';
      res.status(500).json({ error: messageText });
    }
  });

  app.post('/api/v1/ai/image', async (req, res) => {
    if (!ensureGeminiReady(res)) return;

    const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : '';
    const style = typeof req.body?.style === 'string' ? req.body.style.trim() : 'realistic';
    const keywords = typeof req.body?.keywords === 'string' ? req.body.keywords.trim() : '';

    if (!subject) {
      res.status(400).json({ error: 'Missing subject.' });
      return;
    }

    try {
      const prompt = `A ${style} image of ${subject}. ${keywords ? `Keywords: ${keywords}` : ''}`;
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          res.json({
            dataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            prompt,
          });
          return;
        }
      }

      res.status(502).json({ error: 'No image data returned.' });
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Gemini image error';
      res.status(500).json({ error: messageText });
    }
  });
}

export function createApiApp() {
  const app = express();
  registerApiRoutes(app);
  return app;
}
