"use client"

import { getCoinPurchaseHistoryAction } from "@/api/boosting/boosting-action"
import { ModifyPagination } from "@/components/modify/pagination-modify"
import { CACHE_COIN_PURCHASE_HISTORY } from "@/lib/query-cache"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { format } from "date-fns"
import { useState } from "react"

export const BoostingCoinHistory = () => {
  const [page, setPage] = useState(1)
  const size = DEFAULT_SIZE
  const { data } = useQuery({
    queryKey: CACHE_COIN_PURCHASE_HISTORY({ page, size }),
    queryFn: () => getCoinPurchaseHistoryAction({ limit: size, page }),
    placeholderData: (previousData) => previousData,
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Coin purchase
          {data?.pagination?.total && data?.pagination?.total > 1
            ? ` ${data?.pagination?.total} times`
            : ` ${data?.pagination?.total} time`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {data?.pagination && (
              <ModifyPagination
                hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage}
                onPageChange={setPage}
                page={page}
                totalPages={data.pagination.totalPages}
              />
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Coin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  ****{item.id.slice(-6)}
                </TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>{format(item.createdAt, "do MMM, yyyy")}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell className="text-right">{item.coin}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-b bg-muted transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell className="font-medium">Total</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                ${data?.data.reduce((sum, item) => sum + item.price, 0)}
              </TableCell>
              <TableCell className="text-right">
                {data?.data.reduce((sum, item) => sum + item.coin, 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
