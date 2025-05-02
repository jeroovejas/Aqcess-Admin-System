'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const SubscribeForm = ({
  onClose,
  onSuccess,
  onError,
}: {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // can be changed to a success page
      },
    });

    if (result.error) {
      onError(result.error.message || 'Payment failed');
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <PaymentElement />
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

const StripeModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetch('/en/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'customer@example.com', // dynamic if needed
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => setErrorMessage('Failed to create subscription'));
    }
  }, [open]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  const handlePaymentError = (message: string) => {
    setErrorMessage(message);
  };

  if (!open || !clientSecret) return null;

  const options = {
    clientSecret,
    appearance: { theme: 'stripe' as const },
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <Elements stripe={stripePromise} options={options}>
          <SubscribeForm
            onClose={onClose}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>
      </div>

      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-green-600 text-xl font-bold">Congratulations!</h2>
            <p className="mt-2">Subscription Activated!</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
          <div className="bg-red-600 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-white text-xl font-bold">Subscription Failed</h2>
            <p className="mt-2 text-white">{errorMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="bg-red-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StripeModal;
