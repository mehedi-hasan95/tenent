"use client"

import { getVendorCoinAction } from "@/api/boosting/boosting-action"
import { CACHE_VENDOR_AVAILABLE_BOOSTING_COIN } from "@/lib/query-cache"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { format } from "date-fns"

export const AvailableCoin = () => {
  const { data: vendorAvailableCoin } = useQuery({
    queryKey: CACHE_VENDOR_AVAILABLE_BOOSTING_COIN,
    queryFn: getVendorCoinAction,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })
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
        {/* Last Purchase : {format("2026-07-19T07:12:12.307Z", "")} */}
        Last Purchase :{" "}
        {vendorAvailableCoin?.updated_at || vendorAvailableCoin?.created_at
          ? format(
              vendorAvailableCoin.updated_at ?? vendorAvailableCoin.created_at!,
              "yyyy-MM-dd 'at' hh:mm a"
            )
          : "-"}
      </CardContent>
    </Card>
  )
}
