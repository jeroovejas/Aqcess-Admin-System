// pages/api/create-subscription.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as any,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newPaymentMethodId, customerId } = body;

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: newPaymentMethodId,
      },
    });

    return NextResponse.json({ status:true, message: "Payment method update successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
