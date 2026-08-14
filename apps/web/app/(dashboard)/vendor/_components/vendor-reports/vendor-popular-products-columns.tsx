"use client"

import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { formatPrice } from "@/lib/lib"
import { ColumnDef } from "@tanstack/table-core"
import { POPULAR_PRODUCTS_TYPE } from "@workspace/validators/types/orders.types"

export const VendorPopularProductsColumns =
  (): ColumnDef<POPULAR_PRODUCTS_TYPE>[] => [
    {
      accessorKey: "id",
      accessorFn: (row) => row.productId,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Id" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.productId.slice(-6)}</div>
      },
    },
    {
      accessorKey: "title",
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <p>
              {row.original.title.length > 100
                ? row.original.title.slice(0, 100) + "..."
                : row.original.title}
            </p>
          </div>
        )
      },
    },

    {
      accessorKey: "totalPrice",
      accessorFn: (row) => row.totalPrice,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Price" />
      ),
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            {formatPrice(row.original.totalPrice)}
          </div>
        )
      },
    },
    {
      accessorKey: "totalQuantity",
      accessorFn: (row) => row.totalQuantity,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantities" />
      ),
      cell: ({ row }) => {
        return <div className="space-y-1">{row.original.totalQuantity}</div>
      },
    },
  ]
