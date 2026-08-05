"use client"

import { createStripeOrderAction } from "@/api/orders/orders-action"
import { StripeSkeleton } from "@/components/common/stripe/stripe-skeleton"
import { StripeCheckoutProviders } from "@/components/common/stripe/stripe-checkout-providers"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"
import { ProductsShippingForm } from "./products-shipping-form"
import z from "zod"
import { shippingFormSchema } from "@workspace/validators/validators/order-validators"
import { ProductsCheckoutForm } from "./products-checkout-form"

export const ProductCheckout = () => {
  const { products } = useAddToCartStore()
  const {
    mutate,
    data: clientSecret,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createStripeOrderAction,
  })

  const [shipping, setShipping] = useState<z.infer<
    typeof shippingFormSchema
  > | null>(null)
  const [step, setStep] = useState<"form" | "checkout">("form")
  useEffect(() => {
    if (products.length > 0) {
      mutate({
        order: products.map((p) => ({
          id: p.id,
          quantity: p.quantity,
          usedCoupon: p.usedCoupon,
          color: p.color,
          size: p.size,
        })),
      })
    }
  }, [products, mutate])

  if (isPending) {
    return <StripeSkeleton />
  }

  if (isError) {
    return (
      <div>{(error as Error).message || "Failed to initialize payment."}</div>
    )
  }

  if (!clientSecret) {
    return null
  }

  const handleShippingSubmit = (data: z.infer<typeof shippingFormSchema>) => {
    setShipping(data)
  }
  return (
    <StripeCheckoutProviders clientSecret={clientSecret}>
      {step === "form" ? (
        <ProductsShippingForm
          onSubmitData={handleShippingSubmit}
          setStep={setStep}
        />
      ) : (
        <ProductsCheckoutForm shipping={shipping!} />
      )}
    </StripeCheckoutProviders>
  )
}
