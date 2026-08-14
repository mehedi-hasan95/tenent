// price-filter.tsx
"use client"

import { useEffect, useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { X } from "lucide-react"
import { useProductFilters } from "@/nuqs/nuqs-client"
import { useDebounce } from "@/hooks/use-debounce"

interface PriceFilterProps {
  /** Optional ceiling for max price, e.g. from product catalog stats */
  maxAllowed?: number
}

export function PriceFilter({ maxAllowed }: PriceFilterProps) {
  const [{ minPrice, maxPrice }, setFilters] = useProductFilters()

  const [localMin, setLocalMin] = useState(minPrice?.toString() ?? "")
  const [localMax, setLocalMax] = useState(maxPrice?.toString() ?? "")
  const [error, setError] = useState<string | null>(null)

  const debouncedMin = useDebounce(localMin, 400)
  const debouncedMax = useDebounce(localMax, 400)

  // Sync local state if filters change externally (e.g. reset elsewhere)
  useEffect(() => {
    setLocalMin(minPrice?.toString() ?? "")
    setLocalMax(maxPrice?.toString() ?? "")
  }, [minPrice, maxPrice])

  // Validate + push debounced values to the URL — only if the requirement matches
  useEffect(() => {
    const parsedMin = debouncedMin === "" ? null : Number(debouncedMin)
    const parsedMax = debouncedMax === "" ? null : Number(debouncedMax)

    if (
      (parsedMin !== null && Number.isNaN(parsedMin)) ||
      (parsedMax !== null && Number.isNaN(parsedMax))
    ) {
      return // don't touch the URL on garbage input
    }

    if (maxAllowed !== undefined) {
      if (parsedMin !== null && parsedMin > maxAllowed) {
        setError(`Min can't exceed ${maxAllowed}`)
        return
      }
      if (parsedMax !== null && parsedMax > maxAllowed) {
        setError(`Max can't exceed ${maxAllowed}`)
        return
      }
    }

    if (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax) {
      setError("Min can't be greater than max")
      return
    }

    setError(null)

    if (parsedMin !== minPrice || parsedMax !== maxPrice) {
      setFilters({ minPrice: parsedMin, maxPrice: parsedMax })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax, maxAllowed])

  const hasFilters = minPrice !== null || maxPrice !== null

  const handleReset = () => {
    setLocalMin("")
    setLocalMax("")
    setError(null)
    setFilters({ minPrice: null, maxPrice: null })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Price</Label>
        {hasFilters && (
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

      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Min"
          min={0}
          max={maxAllowed}
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="h-9"
          aria-invalid={!!error}
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Max"
          min={0}
          max={maxAllowed}
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="h-9"
          aria-invalid={!!error}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
