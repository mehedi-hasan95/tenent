"use client"
import { allCouponAction } from "@/api/products/seller-products-action"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { format } from "date-fns"
import { PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Page = () => {
  const { data } = useQuery({
    queryKey: ["all-coupon"],
    queryFn: allCouponAction,
    staleTime: 1000 * 5 * 60,
  })
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Total Coupon ({data?.length})</h2>
        <Link href={"/vendor/coupon/new"}>
          <Button>
            <PlusCircle />
            New Coupon
          </Button>
        </Link>
      </div>
      <Separator />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.map((item) => (
          <Card className="relative mx-auto w-full max-w-sm pt-0" key={item.id}>
            <div className="absolute inset-0 z-30 aspect-video bg-black/35 dark:bg-black/10" />
            <Image
              src={item.image[0] ?? "/placeholder.webp"}
              alt={item.title}
              height={400}
              width={400}
              className="aspect-video w-full"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">
                  {item.discountPercent
                    ? `Percent: ${item.discountPercent}`
                    : `Flat: ${item.flatDiscount}`}
                </Badge>
              </CardAction>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.isActive ? "Active" : "Inactive"}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              <span className="flex items-center justify-between">
                <span>
                  CreatedAt: {format(item.createdAt, "MMM dd, yyyy,")}
                </span>
                <span>
                  UpdatedAt: {format(item.updatedAt, "MMM dd, yyyy,")}
                </span>
              </span>
              <span className="flex items-center justify-between">
                {item.maxRedemptions && (
                  <span>Max Redemptions: {item.maxRedemptions}</span>
                )}
                {item.expiresAt && (
                  <span>
                    ExpireAt: {format(item.expiresAt, "MMM dd, yyyy,")}
                  </span>
                )}
              </span>
              <span className="flex items-center justify-between">
                <span>Redeemed: {item.timesRedeemed}</span>
                {item.minOrderAmount && (
                  <span>Min Order Amount: {item.minOrderAmount}</span>
                )}
              </span>
            </CardContent>
            <CardFooter>
              <Link href={`/vendor/coupon/${item.id}`} className="w-full">
                <Button className="w-full" variant={"primary"}>
                  Edit Coupon
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
