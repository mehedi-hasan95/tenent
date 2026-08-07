"use client"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { formatPrice } from "@/lib/lib"
import { ColumnDef } from "@tanstack/react-table"
import {
  ORDER_ITEMS_TYPE,
  ORDER_TYPE,
} from "@workspace/validators/types/orders.types"
import { formatDistanceToNow } from "date-fns"
import { UserOrderCell } from "./user-order-cell"

type UserOrderRow = {
  orderItems: ORDER_ITEMS_TYPE
  orders: ORDER_TYPE
  products: { title: string; images: string[] }
}
export const UserOrdersColumns = (): ColumnDef<UserOrderRow>[] => [
  {
    accessorKey: "title",
    accessorFn: (row) => row.products.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <p>
            {row.original.products.title.length > 100
              ? row.original.products.title.slice(0, 100) + "..."
              : row.original.products.title}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "quantity",
    accessorFn: (row) => row.orderItems.quantity,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      return <div className="space-y-1">{row.original.orderItems.quantity}</div>
    },
  },
  {
    accessorKey: "price",
    accessorFn: (row) => row.orderItems.price,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          {formatPrice(row.original.orderItems.price)}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    accessorFn: (row) => row.orderItems.status,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery Status" />
    ),
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const status = row.original.orderItems.status
      return <p className="capitalize">{status}</p>
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.orderItems.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase" />
    ),
    cell: ({ row }) => {
      const date = row.original.orderItems.createdAt

      return (
        <span>
          {date
            ? formatDistanceToNow(new Date(date), { addSuffix: true })
            : "-"}
        </span>
      )
    },
  },
  {
    accessorKey: "Action",
    cell: ({ row }) => <UserOrderCell id={row.original.orderItems.id} />,
  },
]
