"use client"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { differenceInDays, format } from "date-fns"
import { ProductsCell } from "./products-cell"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"

export const ProductsColumns = ({
  onDelete,
  onRestore,
}: {
  onDelete: (slug: string) => void
  onRestore: (slug: string) => void
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trashing Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.created_at

      return <span>{date ? format(date, "dd MMM yyyy") : "-"}</span>
    },
  },

  {
    accessorKey: "deleted_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delete Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.deleted_at

      return (
        <span>Delete after {differenceInDays(date ?? 0, new Date())} days</span>
      )
    },
  },

  {
    accessorKey: "Action",
    cell: ({ row }) => (
      <ProductsCell
        data={row.original}
        onDelete={onDelete}
        onRestore={onRestore}
      />
    ),
  },
]
