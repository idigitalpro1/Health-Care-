import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });
dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY. Add it to .env.local.');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });

const domains = [
  { name: 'registercall.com', required: true },
  { name: 'conews.press', required: true },
  { name: 'healthhq.conews.press', required: true },
  {
    name: process.env.STRIPE_OPTIONAL_DOMAIN || 'healthiq.registercall.com',
    required: false,
  },
];

async function registerDomain(domainName, required) {
  try {
    const domain = await stripe.paymentMethodDomains.create({ domain_name: domainName });
    console.log(`registered: ${domain.domain_name} (${domain.id})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('already')) {
      console.log(`already exists: ${domainName}`);
      return;
    }
    if (!required) {
      console.warn(`optional domain skipped: ${domainName} (${message})`);
      return;
    }
    throw error;
  }
}

async function run() {
  for (const domain of domains) {
    await registerDomain(domain.name, domain.required);
  }
  console.log('done');
}

run().catch((error) => {
  console.error('failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
