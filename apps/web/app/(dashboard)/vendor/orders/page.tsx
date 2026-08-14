"use client"
import { vendorAllOrdersAction } from "@/api/reports/vendor/vendor-report-action"
import { DataTable } from "@/components/common/data-table/data-table"
import { useQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/table-core"
import { useState } from "react"
import { VendorOrdersColumns } from "./_components/vendor-order-columns"
import { DataTableFilter } from "@/components/common/data-table/data-table-filter"
import { productShipping } from "@/app/dashboard/_components/user-table/product-delivery-helper"

const Page = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-all-products", pagination],
    queryFn: () =>
      vendorAllOrdersAction({
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
      columns={VendorOrdersColumns()}
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
