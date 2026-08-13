"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

interface MonthPickerProps {
  value: Date | undefined
  onChange: (date: Date) => void
  disabled?: (date: Date) => boolean
  placeholder?: string
  className?: string
}

export function MonthPicker({
  value,
  onChange,
  disabled,
  placeholder = "Pick a month",
  className,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false)
  // Fall back to current year for the popover grid when nothing's selected yet
  const [displayYear, setDisplayYear] = React.useState(
    () => value?.getFullYear() ?? new Date().getFullYear()
  )

  React.useEffect(() => {
    if (open) setDisplayYear(value?.getFullYear() ?? new Date().getFullYear())
  }, [open, value])

  const handleSelect = (monthIndex: number) => {
    onChange(new Date(displayYear, monthIndex, 1))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-40 justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value
            ? value.toLocaleString("en-US", { month: "short", year: "numeric" })
            : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-3" align="start">
        <div className="mb-2 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setDisplayYear((y) => y - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{displayYear}</div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setDisplayYear((y) => y + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => {
            const monthDate = new Date(displayYear, index, 1)
            const isSelected =
              value !== undefined &&
              value.getFullYear() === displayYear &&
              value.getMonth() === index
            const isDisabled = disabled?.(monthDate) ?? false

            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                disabled={isDisabled}
                className="h-8"
                onClick={() => handleSelect(index)}
              >
                {month}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface MonthRangePickerProps {
  startMonth: Date | undefined
  endMonth: Date | undefined
  onStartMonthChange: (date: Date) => void
  onEndMonthChange: (date: Date) => void
  /** Optional cap, defaults to the current month */
  maxDate?: Date
}

export function MonthRangePicker({
  startMonth,
  endMonth,
  onStartMonthChange,
  onEndMonthChange,
  maxDate = new Date(),
}: MonthRangePickerProps) {
  const cappedMax = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)

  return (
    <div className="flex items-center gap-2">
      <MonthPicker
        value={startMonth}
        placeholder="Start month"
        onChange={(date) => {
          onStartMonthChange(date)
          // Keep end >= start (only clamp once end is actually set)
          if (endMonth && date > endMonth) onEndMonthChange(date)
        }}
        disabled={(date) =>
          (endMonth ? date > endMonth : false) || date > cappedMax
        }
      />
      <span className="text-sm text-muted-foreground">to</span>
      <MonthPicker
        value={endMonth}
        placeholder="End month"
        onChange={onEndMonthChange}
        disabled={(date) =>
          (startMonth ? date < startMonth : false) || date > cappedMax
        }
      />
    </div>
  )
}
