import React, { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

type ProductType = 'doctor_listing' | 'press_kit';

type UnlockState = Record<ProductType, boolean>;

const UNLOCK_KEYS: Record<ProductType, string> = {
  doctor_listing: 'villager_unlock_doctor_listing',
  press_kit: 'villager_unlock_press_kit',
};

const PRODUCT_CONFIG: Record<ProductType, { label: string; price: string }> = {
  doctor_listing: { label: 'Buy Doctor Listing', price: 'Doctor Listing' },
  press_kit: { label: 'Buy Press Kit', price: 'Press Kit Access' },
};

function getUnlockState(): UnlockState {
  if (typeof window === 'undefined') {
    return { doctor_listing: false, press_kit: false };
  }

  return {
    doctor_listing: localStorage.getItem(UNLOCK_KEYS.doctor_listing) === 'true',
    press_kit: localStorage.getItem(UNLOCK_KEYS.press_kit) === 'true',
  };
}

export function setUnlockState(productType: ProductType) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UNLOCK_KEYS[productType], 'true');
}

export default function StripePurchase() {
  const [unlockState, setLocalUnlockState] = useState<UnlockState>(() => getUnlockState());
  const [loading, setLoading] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stripePromise = useMemo(() => {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) return null;
    return loadStripe(key);
  }, []);

  useEffect(() => {
    setLocalUnlockState(getUnlockState());
  }, []);

  async function checkout(productType: ProductType) {
    setError(null);
    setLoading(productType);

    try {
      const response = await fetch('/api/v1/payments/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to create checkout session.');
      }

      if (!stripePromise) {
        if (payload.url) {
          window.location.href = payload.url;
          return;
        }
        throw new Error('Missing VITE_STRIPE_PUBLISHABLE_KEY.');
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe initialization failed.');

      const result = await stripe.redirectToCheckout({ sessionId: payload.id });
      if (result.error) throw new Error(result.error.message || 'Stripe checkout failed.');
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed.');
      setLoading(null);
    }
  }

  return (
    <section className="border border-slate-700/60 bg-slate-900/60 rounded-xl p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Trusted Care Network Payments</h2>
          <p className="text-slate-300 text-sm">
            Complete payment to unlock doctor listing submission and press kit features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(PRODUCT_CONFIG) as ProductType[]).map((productType) => {
          const cfg = PRODUCT_CONFIG[productType];
          const unlocked = unlockState[productType];
          return (
            <div
              key={productType}
              className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 flex flex-col gap-3"
            >
              <div className="text-white font-medium">{cfg.price}</div>
              <div className="text-xs text-slate-400">
                Status: {unlocked ? 'Unlocked' : 'Payment required'}
              </div>
              <button
                type="button"
                disabled={unlocked || loading === productType}
                onClick={() => checkout(productType)}
                className="rounded bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-400 text-white px-4 py-2 text-sm font-semibold"
              >
                {unlocked ? 'Unlocked' : loading === productType ? 'Processing...' : cfg.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-slate-300">
        <p>
          Doctor onboarding form:{' '}
          {unlockState.doctor_listing ? (
            <a className="text-cyan-300 underline" href="/onboard">
              unlocked
            </a>
          ) : (
            <span className="text-amber-300">locked until payment</span>
          )}
        </p>
      </div>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </section>
  );
}
