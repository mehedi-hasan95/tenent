"use client"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { CategoryCell } from "./category-cell"
import { differenceInDays, format } from "date-fns"
import { subCategoriesType } from "@workspace/validators/types/categories.types"

export const SubCategoriesColumns = ({
  onDelete,
  onRestore,
}: {
  onDelete: (slug: string) => void
  onRestore: (slug: string) => void
}): ColumnDef<subCategoriesType>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trashing Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt

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
      <CategoryCell
        data={row.original}
        onDelete={onDelete}
        onRestore={onRestore}
      />
    ),
  },
]
