
// "use client"

// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
// import { useState, useEffect } from "react"
// import { toggleAddMethodModal, toggleIsUpdated } from "@/store/Slices/SettingSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";


// export default function SaveCardForm() {
//   const stripe = useStripe()
//   const elements = useElements()
//   const [loading, setLoading] = useState(false)
//   // const [cards, setCards] = useState<any[]>([])
//   const user = useAppSelector((state) => state.auth.userData)
//   // const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
//   const customerId = user?.subscription?.customerId
//     const dispatch = useAppDispatch();


//   // const fetchCards = async () => {
//   //   try {
//   //     const res = await fetch("/en/api/list-cards", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ customerId }),
//   //     })

//   //     if (!res.ok) {
//   //       const errorData = await res.json()
//   //       console.error("Error fetching cards:", errorData.error || res.statusText)
//   //       throw new Error(errorData.error || "Failed to fetch cards")
//   //     }

//   //     const data = await res.json()
//   //     console.log("Fetched cards:", data)
//   //     setCards(data.cards || [])
//   //   } catch (error: any) {
//   //     console.error("fetchCards error:", error.message)
//   //     alert("Unable to fetch saved cards. Please try again later.")
//   //   }
//   // }

//   // useEffect(() => {
//   //   if (customerId) {
//   //     fetchCards()
//   //   }
//   // }, [customerId])


//   // const handleCardSelect = (cardId: string) => {
//   //   setSelectedCardId(cardId)
//   // }

//   const handleSubmit = async () => {
//     setLoading(true)

//     const result = await stripe?.confirmSetup({
//       elements: elements!,
//       confirmParams: {
//         return_url: window.location.href,
//       },
//       redirect: "if_required",
//     })

//     if (result?.error) {
//       alert(result.error.message)
//     } else {
//       dispatch(toggleAddMethodModal())
//       alert("Card saved successfully")
//     }

//     setLoading(false)
//   }

//   return (
//     <div>
//       <PaymentElement />
//       <button
//         onClick={handleSubmit}
//         disabled={!stripe || loading}
//         className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg"
//       >
//         {loading ? "Saving..." : "Save Card"}
//       </button>

//       {/* Display Saved Cards */}
//       {/* {cards.length > 0 && (
//         <div className="pt-6 border-t mt-6">
//           <h3 className="text-md font-medium mb-3">Saved Cards</h3>
//           <ul className="space-y-2">
//             {cards.map((card) => {
//               const isSelected = selectedCardId === card.id
//               return (
//                 <li
//                   key={card.id}
//                   onClick={() => handleCardSelect(card.id)}
//                   className={`p-3 rounded-lg border cursor-pointer transition 
//           ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}
//                 >
//                   <div className="text-sm text-gray-800 font-medium">
//                     **** **** **** {card.card.last4}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {card.card.brand.toUpperCase()} · Expires {card.card.exp_month}/{card.card.exp_year}
//                   </div>
//                 </li>
//               )
//             })}
//           </ul>

//         </div>
//       )} */}
//     </div>
//   )
// }


"use client"

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useState, useEffect } from "react"
import { toggleAddMethodModal, toggleIsUpdated } from "@/store/Slices/SettingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";


export default function SaveCardForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.userData)
  const customerId = user?.subscription?.customerId
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    setLoading(true)

    const result = await stripe?.confirmSetup({
      elements: elements!,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    })

    if (result?.error) {
      alert(result.error.message)
    } else {
      dispatch(toggleAddMethodModal())
      alert("Card saved successfully")
    }

    setLoading(false)
  }

  return (
    <div>
      <PaymentElement />
      <button
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Saving..." : "Save Card"}
      </button>
    </div>
  )
}
