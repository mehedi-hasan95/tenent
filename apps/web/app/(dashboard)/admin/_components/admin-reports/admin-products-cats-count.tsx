"use client"

import { adminProductsCatsCountAction } from "@/api/reports/admin/admin-report-action"
import { useQuery } from "@tanstack/react-query"
import { CountCard } from "./count-card"
import { ChartPie, Factory, ShoppingBag, Users } from "lucide-react"

export const AdminProductsCatsCount = () => {
  const { data } = useQuery({
    queryKey: ["admin-products-cats-count"],
    queryFn: adminProductsCatsCountAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <CountCard
        title="Total Products"
        total={data?.product ?? 0}
        icon={ShoppingBag}
      />
      <CountCard title="Total Users" total={data?.users ?? 0} icon={Users} />
      <CountCard
        title="Total Categories"
        total={data?.cat ?? 0}
        icon={ChartPie}
      />
      <CountCard
        title="Total Sub Categories"
        total={data?.subCat ?? 0}
        icon={Factory}
      />
    </div>
  )
}
