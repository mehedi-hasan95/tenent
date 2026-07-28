"use client"

import { type Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface Props<TData> {
  table: Table<TData>
  column: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFilter<TData>({
  table,
  column,
  options,
  title,
}: Props<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div>
      {table.getColumn(column) && (
        <DataTableFacetedFilter
          column={table.getColumn(column)}
          title={title}
          options={options}
        />
      )}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          Reset
          <X />
        </Button>
      )}
    </div>
  )
}
