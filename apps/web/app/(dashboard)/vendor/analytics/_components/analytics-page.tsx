"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { useQuery } from "@tanstack/react-query"
import {
  individualProductsSaleAction,
  vendorDailyReportsAction,
} from "@/api/reports/vendor/vendor-report-action"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import { Calendar1 } from "lucide-react"
import { formatDateParam } from "@/lib/lib"
import { cn } from "@workspace/ui/lib/utils"
import { useGetVendorAllProducts } from "@/hooks/products/use-products"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@workspace/ui/components/combobox"

export const description = "An interactive bar chart"

export const AnalyticsPage = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [productId, setProductId] = useState<string | undefined>(undefined)
  const { data: vendorProducts } = useGetVendorAllProducts()

  const startDate = useMemo(() => {
    return fromDate ? formatDateParam(fromDate) : undefined
  }, [fromDate])

  const endDate = useMemo(() => {
    return toDate ? formatDateParam(toDate) : undefined
  }, [toDate])

  const isSelect = Boolean(startDate || endDate)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "vendor-individual-products-report",
      startDate,
      endDate,
      productId,
    ],
    queryFn: () =>
      individualProductsSaleAction({
        startDate: startDate,
        endDate: endDate,
        productId: productId,
      }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  const chartConfig = {
    quantity: {
      label: "Units_Sold",
      color: "var(--chart-2)",
    },
    totalSale: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Vendor Daily Reports</CardTitle>
          <CardDescription>
            {isSelect ? "Showing selected reports" : "Showing default reports"}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Combobox items={vendorProducts}>
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item.id}
                    value={item.title}
                    onClick={() => setProductId(item.id)}
                  >
                    {item.title}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {/* FROM DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar1
                  className={cn(!fromDate && "text-muted-foreground")}
                />
                {fromDate ? (
                  fromDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                ) : (
                  <span className="text-muted-foreground">Start Date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                disabled={(date) => (toDate ? date > toDate : false)}
                className="rounded-lg border"
              />
            </PopoverContent>
          </Popover>

          <span>to</span>

          {/* TO DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar1 className={cn(!toDate && "text-muted-foreground")} />
                {toDate ? (
                  toDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                ) : (
                  <span className="text-muted-foreground">End Date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                disabled={(date) => (fromDate ? date < fromDate : false)}
                className="rounded-lg border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading || isFetching ? (
          <p className="flex h-62 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value)

                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dashed"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />

              <Bar
                dataKey="units_sold"
                fill="var(--color-quantity)"
                radius={4}
              />

              <Bar dataKey="revenue" fill="var(--color-totalSale)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
