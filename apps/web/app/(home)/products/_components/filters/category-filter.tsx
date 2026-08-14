"use client"

import { useCallback } from "react"

import { useGetCategories } from "@/hooks/categories/use-categories"
import { useProductFilters } from "@/nuqs/nuqs-client"

import { Label } from "@workspace/ui/components/label"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Button } from "@workspace/ui/components/button"
import { X } from "lucide-react"

export const CategoryFilter = () => {
  const { data } = useGetCategories("true")
  const [filters, setFilters] = useProductFilters()

  const selectedCategories = filters.cats ?? []

  const onCatsChange = useCallback(
    (value: string[]) => {
      setFilters((prev) => ({
        ...prev,
        cats: value,
      }))
    },
    [setFilters]
  )

  const handleCheckedChange = (slug: string, checked: boolean) => {
    if (checked) {
      onCatsChange([...selectedCategories, slug])
    } else {
      onCatsChange(selectedCategories.filter((v) => v !== slug))
    }
  }

  const hasFilters = filters.cats.length
  const handleReset = () => {
    setFilters({ cats: [] })
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Category</Label>
        {Boolean(hasFilters) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground"
            onClick={handleReset}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {data?.map((item) => {
          const checked = selectedCategories.includes(item.slug)

          return (
            <Field orientation="horizontal" key={item.id}>
              <Checkbox
                id={item.slug}
                name={item.slug}
                checked={checked}
                onCheckedChange={(checked) =>
                  handleCheckedChange(item.slug, Boolean(checked))
                }
              />
              <FieldLabel htmlFor={item.slug} className="cursor-pointer">
                {item.name}
              </FieldLabel>
            </Field>
          )
        })}
      </div>
    </div>
  )
}
