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
import { MonthRangePicker } from "@/components/common/month-picker"
import { formatDateParam } from "@/lib/lib"

export const description = "An area chart with a legend"

export const VendorYearlyReport = () => {
  const [startMonth, setStartMonth] = useState<Date | undefined>()
  const [endMonth, setEndMonth] = useState<Date | undefined>()

  const startMonthParam = useMemo(() => {
    return startMonth ? formatDateParam(startMonth) : undefined
  }, [startMonth])

  const endMonthParam = useMemo(() => {
    return endMonth ? formatDateParam(endMonth) : undefined
  }, [endMonth])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["vendor-yearly-report", startMonthParam, endMonthParam],

    queryFn: async () => {
      return vendorYearlyReportsAction({
        startDate: startMonthParam,
        endDate: endMonthParam,
      })
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

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
          <p className="flex h-62 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
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
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  })
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    }}
                  />
                }
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
