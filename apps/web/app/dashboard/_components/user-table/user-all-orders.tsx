"use client"

import { allOrdersAction } from "@/api/reports/user/user-report-action"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/common/data-table/data-table"
import { UserOrdersColumns } from "./user-order-columns"
import { DataTableFilter } from "@/components/common/data-table/data-table-filter"
import { productShipping } from "./product-delivery-helper"
import { ProductRatingModal } from "../product-rating-modal"

export const UserAllOrders = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["orders", pagination], // also rename key while you're at it, "test" won't scale
    queryFn: () =>
      allOrdersAction({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1, // 0-based → 1-based
      }),
    placeholderData: (prev) => prev,
  })
  if (isLoading) {
    return <p>load</p>
  }
  return (
    <div>
      <DataTable
        columns={UserOrdersColumns()}
        data={data?.data ?? []}
        searchKey="title"
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={data?.pagination.totalPages ?? 0}
        manualPagination={true}
        showRowCount={false}
        toolbar={(table) => (
          <DataTableFilter
            table={table}
            column="status"
            options={productShipping}
            title="Delivery Status"
          />
        )}
      />
      <ProductRatingModal />
    </div>
  )
}
