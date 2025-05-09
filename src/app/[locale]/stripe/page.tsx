"use client"

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import SaveCardForm from "@/components/Stripe/checkoutForm"
import { useAppSelector } from "@/store/hooks"

const stripePromise = loadStripe("pk_test_51Lx8GyC2tGzLi2V6scY52DyDdyBQvZTyw24ZWtfr7UR41KTPJoIKe4eLvAPWB0otYKjQ92zGcMzMElEBtFQ4hfdZ00715aO4sq")

export default function StripePage() {
  const [clientSecret, setClientSecret] = useState("")
  const user = useAppSelector((state) => state.auth.userData)
  const customerId = user?.subscription?.customerId

  useEffect(() => {
    if (!customerId) return

    const fetchClientSecret = async () => {
      const res = await fetch("/en/api/create-setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      })

      const data = await res.json()
      setClientSecret(data.clientSecret)
    }

    fetchClientSecret()
  }, [customerId])

  const appearance = {
    theme: "stripe" as const,
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    clientSecret && (
      <div className="h-screen flex justify-center items-center">
        <div className="w-1/2">
          <Elements stripe={stripePromise} options={options}>
            <SaveCardForm />
          </Elements>
        </div>
      </div>
    )
  )
}
