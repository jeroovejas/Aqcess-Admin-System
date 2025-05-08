'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Load Stripe public key
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  console.warn('Stripe public key is not defined in environment variables.');
}
const stripePromise = loadStripe(stripePublicKey!);

// Subscription form component
const SubscribeForm = ({ onClose }: { onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setErrorMessage(result.error.message ?? 'An unknown error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <PaymentElement />
      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Processing...' : 'Subscribe'}
        </button>
      </div>
    </form>
  );
};

// Modal wrapper with subscription logic
const StripeModal = ({
  open,
  onClose,
  email,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const createSubscription = async () => {
      setLoading(true);
      try {
        const res = await fetch('/en/api/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        console.log("===============");
        console.log(data);
        
        window.location.href = data.url;
        // const data = await res.json();

        if (!res.ok || !data.clientSecret) {
          console.error('Failed to create subscription:', data);
          return;
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Subscription request failed:', err);
      } finally {
        setLoading(false);
      }
    };

    createSubscription();
  }, [open, email]);

  if (!open || loading || !clientSecret) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <SubscribeForm onClose={onClose} />
      </Elements>
    </div>
  );
};

export default StripeModal;
