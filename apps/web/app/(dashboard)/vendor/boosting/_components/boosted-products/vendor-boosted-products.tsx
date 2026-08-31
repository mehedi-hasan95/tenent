"use client"

import { vendorAllBoostedProductsAction } from "@/api/boosting/boosting-action"
import { DataTable } from "@/components/common/data-table/data-table"
import { CACHE_VENDOR_BOOSTED_PRODUCTS } from "@/lib/query-cache"
import { useQuery } from "@tanstack/react-query"
import { BoostedProductsColumns } from "./boosted-products-columns"

export const VendorBoostedProducts = () => {
  const { data } = useQuery({
    queryKey: CACHE_VENDOR_BOOSTED_PRODUCTS,
    queryFn: vendorAllBoostedProductsAction,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div>
      <DataTable
        columns={BoostedProductsColumns()}
        data={data?.data ?? []}
        searchKey="title"
        showRowCount={false}
      />
    </div>
  )
}
