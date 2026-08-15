"use client"

import { adminAllUsersAction } from "@/api/reports/admin/admin-report-action"
import { DataTable } from "@/components/common/data-table/data-table"
import { useQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/table-core"
import { useState } from "react"
import { UsersColumns } from "./users-columns"

const Page = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data } = useQuery({
    queryKey: ["admin-all-orders", pagination],
    queryFn: () =>
      adminAllUsersAction({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1, // 0-based → 1-based
      }),
    placeholderData: (prev) => prev,
  })
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">All Users</h2>
      <DataTable
        columns={UsersColumns()}
        data={data?.data ?? []}
        searchKey="email"
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={data?.pagination.totalPages ?? 0}
        manualPagination={true}
        showRowCount={false}
      />
    </div>
  )
}

export default Page
