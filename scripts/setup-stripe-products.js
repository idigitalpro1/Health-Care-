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

const productDefinitions = [
  {
    envVar: 'STRIPE_PRICE_DOCTOR_LISTING',
    name: 'Doctor Listing',
    amount: Number(process.env.DOCTOR_LISTING_AMOUNT_CENTS || 29900),
    description: 'Trusted Care Network doctor listing placement.',
    metadata: { product_type: 'doctor_listing' },
  },
  {
    envVar: 'STRIPE_PRICE_PRESS_KIT',
    name: 'Press Kit Access',
    amount: Number(process.env.PRESS_KIT_AMOUNT_CENTS || 9900),
    description: 'Press kit access and media assets package.',
    metadata: { product_type: 'press_kit' },
  },
];

async function findOrCreateProduct(definition) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  const existing = products.data.find((p) => p.name === definition.name);
  if (existing) return existing;

  return stripe.products.create({
    name: definition.name,
    description: definition.description,
    metadata: definition.metadata,
  });
}

async function findOrCreatePrice(productId, amount) {
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const existing = prices.data.find(
    (price) =>
      price.currency === 'usd' &&
      price.type === 'one_time' &&
      price.unit_amount === amount,
  );
  if (existing) return existing;

  return stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: amount,
  });
}

async function run() {
  const created = [];

  for (const definition of productDefinitions) {
    const product = await findOrCreateProduct(definition);
    const price = await findOrCreatePrice(product.id, definition.amount);
    created.push({ definition, product, price });
  }

  console.log('\nStripe product setup complete.\n');
  for (const row of created) {
    console.log(`${row.definition.name}`);
    console.log(`  product: ${row.product.id}`);
    console.log(`  price:   ${row.price.id}`);
    console.log(`  amount:  $${(row.definition.amount / 100).toFixed(2)}`);
    console.log('');
  }

  console.log('Add/update these values in .env.local:');
  for (const row of created) {
    console.log(`${row.definition.envVar}=${row.price.id}`);
  }
}

run().catch((error) => {
  console.error('failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
