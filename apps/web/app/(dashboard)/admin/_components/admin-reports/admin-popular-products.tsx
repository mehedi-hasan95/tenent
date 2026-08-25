"use client"

import { adminPopularProductsAction } from "@/api/reports/admin/admin-report-action"
import { DataTable } from "@/components/common/data-table/data-table"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { AdminPopularProductsColumns } from "./admin-popular-products-columns"

export const AdminPopularProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-popular-products"],
    queryFn: adminPopularProductsAction,
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
          columns={AdminPopularProductsColumns()}
          data={data ?? []}
          searchKey="title"
          isLoading={isLoading}
          showRowCount={false}
        />
      </CardContent>
    </Card>
  )
}
