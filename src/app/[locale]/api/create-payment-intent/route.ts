// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil' as any,
});

export async function POST(req: NextRequest) {
    try {
        console.log("============");
        
        const body = await req.json();
        const { amount } = body;
        console.log(amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
