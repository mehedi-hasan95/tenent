"use client"

import { type Table } from "@tanstack/react-table"
import { Trash } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onDelete?: (slug: string[]) => void
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <Button
          size={"sm"}
          variant={"outline"}
          className="ml-auto text-sm font-normal"
          onClick={() => {
            const selectedIds = table
              .getSelectedRowModel()
              .rows.map((row) => (row.original as { id: string })?.id)

            console.log(selectedIds)
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      )}
    </div>
  )
}
