"use client"

import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { formatPrice } from "@/lib/lib"
import { ColumnDef } from "@tanstack/table-core"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  ORDER_ITEMS_TYPE,
  ORDER_STATUS_TYPE,
  ORDER_TYPE,
} from "@workspace/validators/types/orders.types"
import { formatDistanceToNow } from "date-fns"
import {
  CheckCircle2,
  Clock,
  Eye,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react"
import Link from "next/link"

type VendorOrderRow = {
  orderItems: ORDER_ITEMS_TYPE
  orders: ORDER_TYPE
  products: { title: string; images: string[] }
}
export const VendorOrdersColumns = (): ColumnDef<VendorOrderRow>[] => [
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
      const status = row.original.orderItems.status as ORDER_STATUS_TYPE
      const statusConfig: Record<
        ORDER_STATUS_TYPE,
        { label: string; icon: React.ElementType; className: string }
      > = {
        PROCESSING: {
          label: "Processing",
          icon: Clock,
          className: "bg-amber-400",
        },
        SHIPPED: {
          label: "Shipped",
          icon: Truck,
          className: "bg-blue-500",
        },
        DELIVERED: {
          label: "Delivered",
          icon: CheckCircle2,
          className: "bg-green-400 text-black!",
        },
        CANCELLED: {
          label: "Cancelled",
          icon: XCircle,
          className: "bg-red-500",
        },
        REFUNDED: {
          label: "Refunded",
          icon: RotateCcw,
          className: "bg-purple-500",
        },
      }

      const config = statusConfig[status]

      if (!config) {
        return <p className="capitalize">{status}</p>
      }

      const Icon = config.icon

      return (
        <Badge
          variant="outline"
          className={`flex w-fit items-center gap-1.5 font-medium ${config.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      )
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
    accessorKey: "updatedAt",
    accessorFn: (row) => row.orderItems.updatedAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Update" />
    ),
    cell: ({ row }) => {
      const date = row.original.orderItems.updatedAt

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
    cell: ({ row }) => {
      return (
        <Link href={`/vendor/orders/${row.original.orderItems.id}`}>
          <Button variant={"link"}>
            <Eye /> Details
          </Button>
        </Link>
      )
    },
  },
]
