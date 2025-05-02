// pages/api/create-subscription.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil' as any,
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Step 1: Create customer
  const customer = await stripe.customers.create({ email });

  // Step 2: Create subscription
  const subscription:any = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_MONTHLY_PRICE_ID! }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

  return NextResponse.json({ clientSecret });
}
