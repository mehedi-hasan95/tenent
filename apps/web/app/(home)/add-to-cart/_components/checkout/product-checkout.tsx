"use client"

import { createStripeOrderAction } from "@/api/orders/orders-action"
import { StripeSkeleton } from "@/components/common/stripe/stripe-skeleton"
import { StripeCheckoutProviders } from "@/components/common/stripe/stripe-checkout-providers"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { ProductsShippingForm } from "./products-shipping-form"
import z from "zod"
import { shippingFormSchema } from "@workspace/validators/validators/order-validators"
import { ProductsCheckoutForm } from "./products-checkout-form"

export const ProductCheckout = () => {
  const { products } = useAddToCartStore()
  const [shipping, setShipping] = useState<z.infer<
    typeof shippingFormSchema
  > | null>(null)
  const [step, setStep] = useState<"form" | "checkout">("form")

  const {
    mutate,
    data: clientSecret,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createStripeOrderAction,
  })

  // Trigger order creation directly upon user submission
  const handleShippingSubmit = (data: z.infer<typeof shippingFormSchema>) => {
    setShipping(data)

    if (products.length === 0) {
      return
    }

    mutate(
      {
        // todo: send data for checkout
        order: products,
      },
      {
        onSuccess: () => {
          setStep("checkout")
        },
      }
    )
  }

  if (isPending) {
    return <StripeSkeleton />
  }

  if (isError) {
    return (
      <div>{(error as Error).message || "Failed to initialize payment."}</div>
    )
  }

  return (
    <>
      {step === "form" ? (
        <ProductsShippingForm
          onSubmitData={handleShippingSubmit}
          setStep={setStep}
        />
      ) : clientSecret ? (
        <StripeCheckoutProviders clientSecret={clientSecret}>
          <ProductsCheckoutForm shipping={shipping!} />
        </StripeCheckoutProviders>
      ) : null}
    </>
  )
}
