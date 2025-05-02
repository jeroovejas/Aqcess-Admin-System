'use client';

import { useState } from 'react';
import StripeModal from '@/components/Stripe/checkoutForm';

export default function Stripe() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Book Now</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Pay £12.88
      </button>

      <StripeModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
