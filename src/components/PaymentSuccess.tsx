import React, { useEffect, useState } from 'react';
import { setUnlockState } from './StripePurchase';

type Status = 'loading' | 'success' | 'error';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setStatus('error');
      setMessage('Missing session ID in callback URL.');
      return;
    }

    fetch(`/api/v1/payments/session/${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || 'Failed to verify session.');
        }

        if (payload.unlocked && payload.productType) {
          setUnlockState(payload.productType);
          setStatus('success');
          setMessage(
            payload.productType === 'doctor_listing'
              ? 'Doctor listing access unlocked.'
              : 'Press kit access unlocked.',
          );
          return;
        }

        throw new Error('Payment is not completed yet.');
      })
      .catch((error: unknown) => {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unable to verify payment.');
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full border border-slate-700 rounded-xl bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold mb-3">Payment Confirmation</h1>
        <p
          className={`text-base ${
            status === 'success'
              ? 'text-emerald-300'
              : status === 'error'
                ? 'text-red-300'
                : 'text-slate-200'
          }`}
        >
          {message}
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex rounded bg-white text-slate-900 font-semibold px-4 py-2 hover:bg-slate-200"
          >
            Return to app
          </a>
        </div>
      </div>
    </main>
  );
}
