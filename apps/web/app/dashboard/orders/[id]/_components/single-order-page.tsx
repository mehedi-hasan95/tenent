"use client"

import { singleOrderAction } from "@/api/reports/user/user-report-action"
import { OrderStatusBadge } from "@/components/common/orders/order-status-badge"
import { OrderTimeline } from "@/components/common/orders/order-timeline"
import { formatPrice } from "@/lib/lib"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ORDER_STATUS_TYPE } from "@workspace/validators/types/orders.types"
import { format } from "date-fns"
import Image from "next/image"

interface Props {
  id: string
}
export const SingleOrderPage = ({ id }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => singleOrderAction({ id }),
    enabled: !!id,
    staleTime: 60 * 1000 * 5,
  })
  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                <h1 className="text-3xl font-bold tracking-tight">
                  Order Details
                </h1>
              </CardTitle>
              {data?.orderItems.createdAt && (
                <CardDescription>
                  <p className="mt-2 text-gray-500 dark:text-zinc-400">
                    Order #ORD-{data.orders.id.slice(-8)} -
                    {format(data?.orderItems.createdAt as Date, "MMM dd, yyyy")}
                  </p>
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OrderTimeline
            currentStatus={data?.orderItems.status as ORDER_STATUS_TYPE}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{data?.orders?.phone}</p>
            <p className="font-semibold">{data?.orders?.line1}</p>
            <p>
              {data?.orders?.city}, {data?.orders?.state}{" "}
              {data?.orders?.postalCode}
            </p>
            <p>{data?.orders?.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>
                {formatPrice(
                  (data?.orderItems?.price ?? 0) *
                    (data?.orderItems?.quantity ?? 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4 last:border-b-0">
              <div className="flex flex-col">
                <p className="font-semibold">{data?.products?.title}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {data?.orderItems.quantity}
                </p>
              </div>
              <Image
                src={data?.products?.images[0] as string}
                alt={data?.products?.title ?? ""}
                height={100}
                width={100}
              />
              <p className="font-semibold">
                {formatPrice(data?.orderItems.price ?? 0)}
              </p>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span>
                {formatPrice(
                  (data?.orderItems.price ?? 0) *
                    (data?.orderItems.quantity ?? 0)
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
