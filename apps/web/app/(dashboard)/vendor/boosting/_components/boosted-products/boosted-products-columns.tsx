import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/table-core"
import { VENDOR_BOOSTED_PRODUCT_TYPE } from "@workspace/validators/types/boosting.types"

export const BoostedProductsColumns =
  (): ColumnDef<VENDOR_BOOSTED_PRODUCT_TYPE>[] => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
  ]
