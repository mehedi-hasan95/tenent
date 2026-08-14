"use client"

import { Separator } from "@workspace/ui/components/separator"
import { SortFilter } from "./filters/sort-filter"
import { CategoryFilter } from "./filters/category-filter"
import { PriceFilter } from "./filters/price-filter"
import { useProductFilters } from "@/nuqs/nuqs-client"
import { Button } from "@workspace/ui/components/button"
import { X } from "lucide-react"

export const ProductsLeftSidebar = () => {
  const [filters, setFilters] = useProductFilters()
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false
    if (Array.isArray(value)) {
      return value.length > 0
    }
    if (typeof value === "string") {
      return value !== ""
    }
    return value !== null
  })
  const clearFilter = () => {
    setFilters({
      maxPrice: null,
      minPrice: null,
      sort: null,
      cats: [],
      search: "",
    })
  }
  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between">
        <h4>Filters</h4>
        {hasAnyFilters && (
          <Button onClick={() => clearFilter()} variant={"ghost"}>
            <X />
            Reset
          </Button>
        )}
      </div>
      <Separator />
      <div className="space-y-3">
        <SortFilter />
        <PriceFilter />
        <CategoryFilter />
      </div>
    </div>
  )
}
