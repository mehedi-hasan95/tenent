"use client"

import { useQuery } from "@tanstack/react-query"
import { BuyBoostingCoin } from "./buy-boosting-coin"
import { CACHE_BUY_BOOSTING_COIN } from "@/lib/query-cache"
import { getActiveBoostingCoinAction } from "@/api/stripe/boosting-action"

export const VendorBoostingCoin = () => {
  const { data } = useQuery({
    queryKey: CACHE_BUY_BOOSTING_COIN,
    queryFn: getActiveBoostingCoinAction,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-5">
        <h2>Boost you products for get more attention</h2>
        <BuyBoostingCoin boosting={data?.coin ?? 0} />
      </div>
    </div>
  )
}
