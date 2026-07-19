"use client"

import { useTheme } from "next-themes"
import { useMemo } from "react"
import { Appearance, loadStripe } from "@stripe/stripe-js"
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout"

interface Props {
  children: React.ReactNode
  clientSecret: string
}
export const StripeCheckoutProviders = ({ children, clientSecret }: Props) => {
  const { theme } = useTheme()
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  )
  const appearance: Appearance = useMemo(() => {
    return {
      theme: theme === "dark" ? "night" : "stripe",
    }
  }, [theme])
  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        elementsOptions: { appearance },
      }}
    >
      {children}
    </CheckoutElementsProvider>
  )
}
