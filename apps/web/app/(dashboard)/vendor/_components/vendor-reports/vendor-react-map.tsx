"use client"

import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { vendorCountryBasedReportAction } from "@/api/reports/vendor/vendor-report-action"
import countries from "@/lib/country.json"
import { formatPrice } from "@/lib/lib"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

type CountryData = {
  country: string
  price: number
  quantity: number
}

// ISO country code -> country name
const countryCodeToName: Record<string, string> = Object.fromEntries(
  countries.map(({ code, name }) => [code.toLowerCase(), name])
)

export const VendorReactMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null)

  // Mouse position for tooltip
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["country-order"],
    queryFn: vendorCountryBasedReportAction,
  })

  // Convert API response into map-friendly data
  const countryData: CountryData[] = (data ?? [])
    .filter((item) => item.country !== null)
    .map((item) => ({
      country: countryCodeToName[item.country!.toLowerCase()] ?? item.country!,
      price: item.price,
      quantity: item.quantity,
    }))

  const getCountryData = (countryName: string) => {
    return countryData.find(
      (item) => item.country.toLowerCase() === countryName.toLowerCase()
    )
  }

  return (
    <div className="relative w-full rounded-xl px-4 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Country Based Report</h2>

        <p className="text-sm text-muted-foreground">
          Geographic distribution of your marketplace
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-75 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex h-75 items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load country report.
          </p>
        </div>
      )}

      {/* Map */}
      {!isLoading && !isError && (
        <div className="relative">
          <ComposableMap
            projectionConfig={{
              scale: 145,
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name

                  const country = getCountryData(countryName)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(event) => {
                        if (!country) {
                          setHoveredCountry(null)
                          return
                        }

                        const mapContainer =
                          event.currentTarget.closest(".relative")

                        if (!mapContainer) return

                        const rect = mapContainer.getBoundingClientRect()

                        setHoveredCountry(country)

                        setTooltipPosition({
                          x: event.clientX - rect.left,
                          y: event.clientY - rect.top,
                        })
                      }}
                      onMouseMove={(event) => {
                        if (!country) return

                        const mapContainer =
                          event.currentTarget.closest(".relative")

                        if (!mapContainer) return

                        const rect = mapContainer.getBoundingClientRect()

                        setTooltipPosition({
                          x: event.clientX - rect.left,
                          y: event.clientY - rect.top,
                        })
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null)
                      }}
                      style={{
                        default: {
                          fill: country ? "#6366f1" : "#E5E7EB",
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                        },

                        hover: {
                          fill: country ? "#4f46e5" : "#D1D5DB",
                          outline: "none",
                          cursor: country ? "pointer" : "default",
                        },

                        pressed: {
                          fill: "#4338ca",
                          outline: "none",
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Tooltip */}
          {hoveredCountry && (
            <div
              className="pointer-events-none absolute z-50 min-w-50 -translate-x-1/2 -translate-y-full rounded-lg border bg-background p-3 shadow-lg"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y - 10,
              }}
            >
              <p className="mb-2 font-semibold">{hoveredCountry.country}</p>

              <div className="flex items-center justify-between gap-6 text-sm">
                <span className="text-muted-foreground">Quantity</span>

                <span className="font-medium">
                  {hoveredCountry.quantity.toLocaleString()}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between gap-6 text-sm">
                <span className="text-muted-foreground">Revenue</span>

                <span className="font-medium">
                  {formatPrice(hoveredCountry.price)}
                </span>
              </div>

              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b bg-background" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
