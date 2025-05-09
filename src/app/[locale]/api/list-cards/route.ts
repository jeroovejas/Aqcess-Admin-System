// /app/api/list-cards/route.ts (for App Router projects)
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as any,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId } = body

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 })
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })

    return NextResponse.json({ cards: paymentMethods.data }, { status: 200 })
  } catch (error: any) {
    console.error("Stripe Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
