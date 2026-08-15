"use client"
import { DataTable } from "@/components/common/data-table/data-table"
import { useQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/table-core"
import { useState } from "react"
import { OrdersColumns } from "@/components/common/dashboard/order-columns"
import { DataTableFilter } from "@/components/common/data-table/data-table-filter"
import { productShipping } from "@/app/dashboard/_components/user-table/product-delivery-helper"
import { adminAllOrdersAction } from "@/api/reports/admin/admin-report-action"

const Page = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-orders", pagination],
    queryFn: () =>
      adminAllOrdersAction({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1, // 0-based → 1-based
      }),
    placeholderData: (prev) => prev,
  })
  if (isLoading) {
    return <p>load</p>
  }
  return (
    <DataTable
      columns={OrdersColumns({ url: "admin" })}
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
  )
}

export default Page
