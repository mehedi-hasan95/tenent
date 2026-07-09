"use client"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { format } from "date-fns"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { formatName, formatPrice } from "@/lib/lib"
import { VendorProductsCell } from "./vendor-products-cell"

export const VendorProductsColumns = ({
  onDelete,
}: {
  onDelete: (id: string) => void
}): ColumnDef<PRODUCT_TYPE>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.original.title

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-55 cursor-default truncate">{title}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title.length > 50 ? `${title.slice(0, 50)}...` : title}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    accessorKey: "categorySlug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const cat = row.original.categorySlug
      return <p>{formatName(cat)}</p>
    },
  },

  {
    accessorKey: "subCategorySlug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Category" />
    ),
    cell: ({ row }) => {
      const cat = row.original.subCategorySlug
      return <p>{formatName(cat)}</p>
    },
  },

  {
    accessorKey: "basePrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Base Price" />
    ),
    cell: ({ row }) => {
      const price = row.original.basePrice
      return <p>{formatPrice(price)}</p>
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Status" />
    ),
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const status = row.original.status
      return <p className="capitalize">{status}</p>
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.original.created_at

      return <span>{date ? format(date, "dd MMM yyyy") : "-"}</span>
    },
  },
  {
    accessorKey: "Action",
    cell: ({ row }) => (
      <VendorProductsCell data={row.original} onDelete={onDelete} />
    ),
  },
]
