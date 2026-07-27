"use client"

import {
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout"
import { FormEvent, SubmitEvent, useState } from "react"
import { BuyCoinSkeleton } from "./buy-coin-skeleton"
import { Button } from "@workspace/ui/components/button"
import { useCoinStepStore } from "@/store/stripe-store/useCoinStepStore"
import { useModalActiveStore } from "@/store/useModalActiveStore"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

export const BoostingCoinBuyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const setStep = useCoinStepStore((state) => state.setStep)
  const { onOpen } = useModalActiveStore()

  const checkoutState = useCheckoutElements()
  if (checkoutState.type === "loading") {
    return <BuyCoinSkeleton />
  }

  if (checkoutState.type === "error") {
    return <div>Error: {checkoutState.error.message}</div>
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { checkout } = checkoutState
    setIsSubmitting(true)

    const confirmResult = await checkout.confirm()
    if (confirmResult.type === "error") {
      setMessage(confirmResult.error.message)
    }

    setIsSubmitting(false)
  }
  return (
    <ScrollArea className="max-h-[80vh]">
      <form onSubmit={handleSubmit}>
        <h4>Payment</h4>
        <PaymentElement id="payment-element" />

        <div className="mt-5 flex items-center gap-3">
          <Button
            type="reset"
            onClick={() => {
              setStep("form")
              onOpen(false)
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            disabled={!checkoutState.checkout.canConfirm || isSubmitting}
            id="submit"
            type="submit"
            variant={"primary"}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="spinner"></div>
            ) : (
              `Pay ${checkoutState.checkout.total.total.amount} now`
            )}
          </Button>
        </div>

        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </ScrollArea>
  )
}
