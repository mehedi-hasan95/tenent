import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/table-core"
import { BOOSTED_PRODUCT_TYPE } from "@workspace/validators/types/boosting.types"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { format, formatDistanceToNow } from "date-fns"

export const BoostedProductsColumns = (): ColumnDef<
  BOOSTED_PRODUCT_TYPE & {
    product: PRODUCT_TYPE
  }
>[] => [
  {
    accessorKey: "title",
    accessorFn: (row) => row.product.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "endAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Boost Remaining" />
    ),
    cell: ({ row }) => {
      const date = row.original.endAt

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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Boost Created" />
    ),
    cell: ({ row }) => {
      return <span>{format(row.original.createdAt, "MMM dd, yyyy")}</span>
    },
  },
  {
    accessorKey: "coins",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Boost Coins" />
    ),
  },
]
