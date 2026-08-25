"use client"

import { retrievePurchaseAction } from "@/api/orders/orders-action"
import { formatPrice } from "@/lib/lib"
import { CACHE_ALL_PRODUCTS } from "@/lib/query-cache"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight, CheckCircle, Package } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

interface Props {
  id: string
}
export const OrderSuccessPage = ({ id }: Props) => {
  const clear = useAddToCartStore((state) => state.clear)
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["retrieve-purchase", id],
    queryFn: () => retrievePurchaseAction({ id }),
    enabled: !!id,
  })
  useEffect(() => {
    if (data) {
      queryClient.invalidateQueries({
        queryKey: CACHE_ALL_PRODUCTS(),
      })

      clear()
    }
  }, [data, queryClient, clear])

  if (isLoading) {
    return <p>Loading...</p>
  }
  const totalPrice = data?.products?.data?.reduce(
    (total: number, item: any) => total + item.amount_total,
    0
  )
  return (
    <div className="container-default min-h-screen bg-linear-to-br from-background via-accent/5 to-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      <div className="relative z-10">
        <div className="px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              {/* Animated success icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-accent/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="h-20 w-20 fill-accent text-accent" />
                  </div>
                </div>
              </div>

              <h1 className="mb-3 text-4xl font-bold text-balance text-foreground sm:text-5xl">
                Order Confirmed!
              </h1>
              <p className="mb-8 text-lg text-pretty text-muted-foreground">
                Thank you for your purchase. Your order has been received and is
                being prepared for shipment.
              </p>

              {/* Order Summary */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-foreground">
                  <Package className="h-6 w-6 text-muted-foreground" />
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border">
                      <thead className="">
                        <tr>
                          <th className="border-b px-4 py-2 text-center text-sm font-semibold text-muted-foreground">
                            Name
                          </th>
                          <th className="border-b px-4 py-2 text-center text-sm font-semibold text-muted-foreground">
                            Quantity
                          </th>
                          <th className="border-b px-4 py-2 text-center text-sm font-semibold text-muted-foreground">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.data.map((item: any) => (
                          <tr className="" key={item.id}>
                            <td className="border-b px-4 py-2">
                              {item.description}
                            </td>
                            <td className="border-b px-4 py-2">
                              {item.quantity}
                            </td>
                            <td className="border-b px-4 py-2">
                              {formatPrice(item.amount_total / 100)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-2 text-right font-bold"
                          >
                            Total
                          </td>
                          <td className="border-t px-4 py-2 font-bold">
                            {formatPrice(totalPrice / 100)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-5 flex justify-center gap-5">
                  <Link href="/dashboard">
                    <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
                      Go to My Account
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>

                  {/* Continue Shopping */}
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-lg border-primary text-base font-semibold text-primary hover:bg-primary/10"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
