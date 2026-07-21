"use client"

import { stripeConnectAction } from "@/api/stripe/stripe-action"
import { useMutation } from "@tanstack/react-query"
import { LoadingButton } from "../common/loading-button"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { FaStripe } from "react-icons/fa6"
import { useGetSession } from "@/hooks/auth/use-auth"

import { ConnectedAccountDetails } from "./connected-account-details"

export const StripeConnectSection = () => {
  const { user } = useGetSession()
  const { mutate, isPending } = useMutation({
    mutationFn: stripeConnectAction,
    onSuccess: (data) => {
      window.location.href = data.data.url
    },
    onError: (error) => {
      // console.error(error)
      toast.error(error.message ?? "Something went wrong")
    },
  })
  return (
    <>
      {user?.stripeVerified ? (
        <ConnectedAccountDetails />
      ) : (
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 opacity-20">
            <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-400 blur-3xl"></div>
            <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-400 blur-3xl"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 text-3xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <FaStripe className="font-bold" />
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl dark:text-muted-foreground">
              Scale your marketplace with <br />
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Stripe Connect
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
              To start receiving payments and managing your payouts, please
              connect your Stripe Express or Custom account. This is a secure
              process handled directly by Stripe.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isPending ? (
                <LoadingButton
                  className="bg-linear-to-br from-indigo-500 to-purple-500 px-8 py-6 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"
                  title="Connect with Stripe"
                />
              ) : (
                <Button
                  onClick={() => mutate()}
                  className="bg-linear-to-br from-indigo-500 to-purple-500 px-8 py-6 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  Connect with Stripe
                </Button>
              )}
            </div>
            <p className="text-md mt-6 text-red-300/60">
              Your information is encrypted and stored securely by Stripe. We do
              not have access to your login credentials.
            </p>
          </div>
        </section>
      )}
    </>
  )
}
