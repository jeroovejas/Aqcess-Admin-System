// /api/create-setup-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from "stripe"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as any,
})

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        
        const body = await req.json();
        const { customerId } = body;
        console.log(customerId);

        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
        });
        
        return NextResponse.json({ clientSecret: setupIntent.client_secret }, { status: 200 });
    
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

