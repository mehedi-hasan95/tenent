"use client"

import { useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { StripeCheckoutProviders } from "@/components/common/stripe/stripe-checkout-providers"
import { BoostingCoinBuyForm } from "./boosting-coin-buy-form"
import { createCoinPaymentIntent } from "@/api/stripe/stripe-action"
import { BuyCoinSkeleton } from "./buy-coin-skeleton"
import {
  CACHE_COIN_PURCHASE_HISTORY,
  CACHE_VENDOR_AVAILABLE_BOOSTING_COIN,
} from "@/lib/query-cache"

interface Props {
  coin: number
}

export const BuyBoostingCoinStripe = ({ coin }: Props) => {
  const queryClient = useQueryClient()
  const {
    mutate,
    data: clientSecret,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createCoinPaymentIntent,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_VENDOR_AVAILABLE_BOOSTING_COIN,
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_COIN_PURCHASE_HISTORY({}),
      })
    },
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
