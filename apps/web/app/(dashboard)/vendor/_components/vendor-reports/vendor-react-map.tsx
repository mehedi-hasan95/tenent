"use client"

import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { useState } from "react"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

type CountryData = {
  country: string
  users: number
  sellers: number
}

const countryData: CountryData[] = [
  {
    country: "Bangladesh",
    users: 12500,
    sellers: 320,
  },
  {
    country: "India",
    users: 45200,
    sellers: 850,
  },
  {
    country: "United States of America",
    users: 78200,
    sellers: 1240,
  },
  {
    country: "United Kingdom",
    users: 18400,
    sellers: 430,
  },
  {
    country: "Canada",
    users: 12600,
    sellers: 290,
  },
  {
    country: "Australia",
    users: 9800,
    sellers: 210,
  },
  {
    country: "Germany",
    users: 22100,
    sellers: 510,
  },
  {
    country: "France",
    users: 19400,
    sellers: 450,
  },
  {
    country: "Brazil",
    users: 28600,
    sellers: 620,
  },
  {
    country: "Japan",
    users: 31200,
    sellers: 710,
  },
  {
    country: "China",
    users: 65400,
    sellers: 980,
  },
  {
    country: "United Arab Emirates",
    users: 8700,
    sellers: 180,
  },
]

const getCountryData = (countryName: string) => {
  return countryData.find(
    (item) => item.country.toLowerCase() === countryName.toLowerCase()
  )
}

export default function VendorReactMap() {
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null)

  return (
    <div className="relative w-full rounded-xl border bg-background p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Users & Sellers by Country</h2>

        <p className="text-sm text-muted-foreground">
          Geographic distribution of your marketplace
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 flex gap-6">
        <div>
          <p className="text-xs text-muted-foreground">Total Users</p>

          <p className="text-xl font-bold">
            {countryData
              .reduce((total, country) => total + country.users, 0)
              .toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Total Sellers</p>

          <p className="text-xl font-bold">
            {countryData
              .reduce((total, country) => total + country.sellers, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <ComposableMap
          projectionConfig={{
            scale: 145,
          }}
          className="h-auto w-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name
                const data = getCountryData(countryName)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setHoveredCountry(data ?? null)
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null)
                    }}
                    style={{
                      default: {
                        fill: data ? "#6366f1" : "#E5E7EB",
                        outline: "none",
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: "#4f46e5",
                        outline: "none",
                        cursor: "pointer",
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
          <div className="pointer-events-none absolute top-4 right-4 min-w-[180px] rounded-lg border bg-background p-3 shadow-lg">
            <p className="mb-2 font-semibold">{hoveredCountry.country}</p>

            <div className="flex items-center justify-between gap-6 text-sm">
              <span className="text-muted-foreground">Users</span>

              <span className="font-medium">
                {hoveredCountry.users.toLocaleString()}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between gap-6 text-sm">
              <span className="text-muted-foreground">Sellers</span>

              <span className="font-medium">
                {hoveredCountry.sellers.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Country list */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-3 lg:grid-cols-4">
        {countryData
          .sort((a, b) => b.users - a.users)
          .slice(0, 8)
          .map((country) => (
            <div key={country.country} className="rounded-lg border p-3">
              <p className="truncate text-sm font-medium">{country.country}</p>

              <div className="mt-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Users</span>

                <span>{country.users.toLocaleString()}</span>
              </div>

              <div className="mt-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Sellers</span>

                <span>{country.sellers.toLocaleString()}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
