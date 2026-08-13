"use client"

import { useMemo, useState } from "react"
import { vendorYearlyReportsAction } from "@/api/reports/vendor/vendor-report-action"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"

import { MonthRangePicker } from "../../../../../components/common/month-picker"

export const description = "An area chart with a legend"

const formatMonthParam = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")

  return `${year}-${month}-01`
}

export const VendorYearlyReport = () => {
  const [startMonth, setStartMonth] = useState<Date | undefined>()
  const [endMonth, setEndMonth] = useState<Date | undefined>()

  const startMonthParam = useMemo(() => {
    return startMonth ? formatMonthParam(startMonth) : undefined
  }, [startMonth])

  const endMonthParam = useMemo(() => {
    return endMonth ? formatMonthParam(endMonth) : undefined
  }, [endMonth])

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["vendor-yearly-report", startMonthParam, endMonthParam],

    queryFn: async () => {
      return vendorYearlyReportsAction({
        startMonth: startMonthParam,
        endMonth: endMonthParam,
      })
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const chartData = useMemo(() => {
    if (!data) {
      return []
    }

    return data.map((item) => ({
      month: new Date(item.month).toLocaleString("en-US", {
        month: "short",
      }),
      quantity: item.quantity,
      totalSale: item.totalSale,
    }))
  }, [data])

  const chartConfig = {
    quantity: {
      label: "Quantity",
      color: "#39d",
    },

    totalSale: {
      label: "Total Sale",
      color: "#3b82f6",
    },
  } satisfies ChartConfig

  const hasRange = Boolean(startMonth && endMonth)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Vendor Yearly Report</CardTitle>

          <CardDescription>
            {hasRange
              ? "Showing quantity and total sales for the selected range"
              : "Showing the default vendor report"}
          </CardDescription>
        </div>

        <MonthRangePicker
          startMonth={startMonth}
          endMonth={endMonth}
          onStartMonthChange={setStartMonth}
          onEndMonthChange={setEndMonth}
        />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-62 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : isError ? (
          <div className="flex h-62 items-center justify-center text-sm text-destructive">
            Failed to load vendor report.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-62 items-center justify-center text-sm text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Area
                dataKey="totalSale"
                type="natural"
                fill="var(--color-totalSale)"
                fillOpacity={0.4}
                stroke="var(--color-totalSale)"
                stackId="a"
              />

              <Area
                dataKey="quantity"
                type="natural"
                fill="var(--color-quantity)"
                fillOpacity={0.4}
                stroke="var(--color-quantity)"
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}

        {isFetching && !isLoading && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Updating report...
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Yearly vendor report
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
