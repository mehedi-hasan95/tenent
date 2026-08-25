"use client"

import { LoadingButton } from "@/components/common/loading-button"
import {
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout"
import { Button } from "@workspace/ui/components/button"
import { shippingFormSchema } from "@workspace/validators/validators/order-validators"
import { SubmitEvent, useState } from "react"
import z from "zod"

interface Props {
  shipping: z.infer<typeof shippingFormSchema>
}
export const ProductsCheckoutForm = ({ shipping }: Props) => {
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const checkoutState = useCheckoutElements()

  // ✅ Always call hook (no conditions here)

  if (checkoutState.type === "loading") {
    return <div>Loading...</div>
  }

  if (checkoutState.type === "error") {
    return <div>Error: {checkoutState.error.message}</div>
  }

  const { checkout } = checkoutState

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    setHasError(false)

    await checkout.updateShippingAddress({
      name: "shipping_address",
      address: {
        country: shipping.country,
        line1: shipping.line1,
        line2: shipping.phone,
        city: shipping.city,
        postal_code: shipping.postalCode,
        state: shipping.state,
      },
    })

    const confirmResult = await checkout.confirm()

    if (confirmResult.type === "error") {
      setMessage(confirmResult.error.message)
      setHasError(true)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Payment</h4>

      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      {isSubmitting ? (
        <LoadingButton className="mt-5 w-full bg-blue-800 text-white hover:bg-blue-900" />
      ) : (
        <Button
          disabled={!checkout.canConfirm || isSubmitting || hasError}
          className="mt-5 w-full"
          variant={"primary"}
        >
          Pay {checkout.total.total.amount} now
        </Button>
      )}

      {message && (
        <div id="payment-message" className="mt-2 text-destructive">
          {message}
        </div>
      )}
    </form>
  )
}
