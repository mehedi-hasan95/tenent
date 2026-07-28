"use client"

import { getVendorCoinAction } from "@/api/boosting/boosting-action"
import { CACHE_VENDOR_AVAILABLE_BOOSTING_COIN } from "@/lib/query-cache"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { format } from "date-fns"
import { BoostedProductForm } from "./boosted-product-form"

export const AvailableCoin = () => {
  const { data: vendorAvailableCoin } = useQuery({
    queryKey: CACHE_VENDOR_AVAILABLE_BOOSTING_COIN,
    queryFn: getVendorCoinAction,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  console.log(vendorAvailableCoin)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Coin ({vendorAvailableCoin?.coin})</CardTitle>
        <CardDescription>
          Increase your visibility and reach more customers by boosting your
          product&apos;s ranking in our marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Last Update :{" "}
        {vendorAvailableCoin?.updatedAt || vendorAvailableCoin?.createdAt
          ? format(
              vendorAvailableCoin.updatedAt ?? vendorAvailableCoin.createdAt!,
              "yyyy-MM-dd 'at' hh:mm a"
            )
          : "-"}
      </CardContent>
      <CardFooter>
        <BoostedProductForm />
      </CardFooter>
    </Card>
  )
}
