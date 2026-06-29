"use client"

import { stripeConnectAction } from "@/api/stripe/stripe-action"
import { useMutation } from "@tanstack/react-query"
import { LoadingButton } from "../common/loading-button"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"

export const StripeConnectSection = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: stripeConnectAction,
    onSuccess: (data) => {
      console.log(data)
      // window.location.href = data.data.url;
    },
    onError: (error) => {
      // console.error(error)
      toast.error(error.message)
    },
  })
  return (
    <div>
      {isPending ? (
        <LoadingButton />
      ) : (
        <Button onClick={() => mutate()}>Connect Stripe</Button>
      )}
    </div>
  )
}
