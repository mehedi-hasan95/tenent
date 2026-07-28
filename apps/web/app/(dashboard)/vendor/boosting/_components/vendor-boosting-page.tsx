"use client"

import { useQuery } from "@tanstack/react-query"
import { BuyBoostingCoin } from "./buy-boosting-coin"
import { CACHE_BUY_BOOSTING_COIN } from "@/lib/query-cache"
import { getActiveBoostingCoinAction } from "@/api/stripe/boosting-action"
import { Separator } from "@workspace/ui/components/separator"
import { AvailableCoin } from "./available-coin"
import { BoostingCoinHistory } from "./boosting-coin-history"
import { VendorBoostedProducts } from "./boosted-products/vendor-boosted-products"

export const VendorBoostingCoin = () => {
  const { data } = useQuery({
    queryKey: CACHE_BUY_BOOSTING_COIN,
    queryFn: getActiveBoostingCoinAction,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h2>Boost you products for get more attention</h2>
        <BuyBoostingCoin boosting={data?.coin ?? 0} />
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-full md:col-span-2">
          <BoostingCoinHistory />
        </div>
        <div className="col-span-full md:col-span-1">
          <AvailableCoin />
        </div>
      </div>
      <Separator className="my-3" />
      <VendorBoostedProducts />
    </div>
  )
}
