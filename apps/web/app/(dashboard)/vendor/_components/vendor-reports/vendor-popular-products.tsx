"use client"

import { vendorPopularProductsAction } from "@/api/reports/vendor/vendor-report-action"
import { DataTable } from "@/components/common/data-table/data-table"
import { useQuery } from "@tanstack/react-query"
import { VendorPopularProductsColumns } from "./vendor-popular-products-columns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const VendorPopularProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-popular-products"],
    queryFn: vendorPopularProductsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  if (isLoading) {
    return (
      <p className="flex h-62 items-center justify-center text-sm text-muted-foreground">
        Loading...
      </p>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Products</CardTitle>
        <CardDescription>
          Popular products based on most sale quantities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={VendorPopularProductsColumns()}
          data={data ?? []}
          searchKey="title"
          isLoading={isLoading}
          showRowCount={false}
        />
      </CardContent>
    </Card>
  )
}
