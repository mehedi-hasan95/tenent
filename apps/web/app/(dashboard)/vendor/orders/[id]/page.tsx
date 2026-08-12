"use client"

import { vendorSingleOrderAction } from "@/api/reports/vendor/vendor-report-action"
import { formatPrice } from "@/lib/lib"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { format, formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { useParams } from "next/navigation"
import { UpdateOrderItems } from "./_components/update-order-items"

const Page = () => {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-single-order", params.id],
    queryFn: () => vendorSingleOrderAction({ id: params.id }),
  })

  if (!data) {
    return
  }
  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Order details
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              #{data?.orders.id.slice(0, 8)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {format(data?.orders.createdAt, "MMM dd, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={data.orders.isPaid ? "primary" : "destructive"}>
              {data.orders.isPaid ? "Paid" : "Unpaid"}
            </Badge>
          </div>
        </header>
        <Separator />
        <div className="mt-5 grid gap-6 md:grid-cols-5">
          <div className="space-y-6 md:col-span-3">
            <Card title="Items">
              <CardContent>
                <div className="flex gap-4">
                  <Image
                    src={data.products.images[0]!}
                    alt={data.products.title}
                    loading="lazy"
                    className="h-24 w-24 shrink-0 rounded-xl border border-border object-cover"
                    height={200}
                    width={200}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="text-base font-semibold text-foreground">
                        {data.products.title}
                      </h2>
                      <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                        {data.orderItems.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty {data.orderItems.quantity}
                      {data.orderItems.size
                        ? ` · Size ${data.orderItems.size}`
                        : ""}
                      {data.orderItems.color
                        ? ` · ${data.orderItems.color}`
                        : ""}
                      {data.orderItems.usedCoupon ? " · Coupon applied" : ""}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-foreground">
                      {formatPrice(
                        data.orderItems.price * data.orderItems.quantity
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card title="Shipping address">
              <CardContent>
                <address className="text-sm leading-relaxed text-foreground not-italic">
                  {data.orders.line1}
                  <br />
                  {data.orders.city}
                  {data.orders.state ? `, ${data.orders.state}` : ""}{" "}
                  {data.orders.postalCode}
                  <br />
                  {data.orders.country}
                </address>
                <div className="mt-4 border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <span>{data.orders.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phone</span>
                    <span>{data.orders.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:col-span-2">
            <Card title="Summary">
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>
                    {formatPrice(
                      data.orderItems.price * data.orderItems.quantity
                    )}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-foreground">
                    Total
                  </span>
                  <span className="text-2xl font-semibold text-foreground">
                    {formatPrice(
                      data.orderItems.price * data.orderItems.quantity
                    )}
                  </span>
                </div>
                <p className="mt-4 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
                  {data.orders.paymentIntent}
                </p>
              </CardContent>
            </Card>

            <Card title="Status">
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Payment</span>
                  <span>{data.orders.isPaid ? "Paid" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Update</span>
                  <span>
                    {data.orderItems.updatedAt
                      ? `${formatDistanceToNow(data.orderItems.createdAt)} ago`
                      : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="mx-auto max-w-4xl">
        <UpdateOrderItems
          id={data.orderItems.id}
          status={data.orderItems.status}
        />
      </div>
    </div>
  )
}

export default Page
