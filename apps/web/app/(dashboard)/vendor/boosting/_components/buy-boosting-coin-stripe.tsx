"use client"

import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"

import { StripeCheckoutProviders } from "@/components/common/stripe/stripe-checkout-providers"
import { BoostingCoinBuyForm } from "./boosting-coin-buy-form"
import { createCoinPaymentIntent } from "@/api/stripe/stripe-action"
import { BuyCoinSkeleton } from "./buy-coin-skeleton"

interface Props {
  coin: number
}

export const BuyBoostingCoinStripe = ({ coin }: Props) => {
  const {
    mutate,
    data: clientSecret,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createCoinPaymentIntent,
  })

  useEffect(() => {
    if (coin > 0) {
      mutate(coin)
    }
  }, [coin, mutate])

  if (isPending) {
    return <BuyCoinSkeleton />
  }

  if (isError) {
    return (
      <div>{(error as Error).message || "Failed to initialize payment."}</div>
    )
  }

  if (!clientSecret) {
    return null
  }

  return (
    <StripeCheckoutProviders clientSecret={clientSecret}>
      <BoostingCoinBuyForm />
    </StripeCheckoutProviders>
  )
}
