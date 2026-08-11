"use client"

import { vendorReportsAction } from "@/api/reports/vendor/vendor-report-action"
import { useQuery } from "@tanstack/react-query"
import { BaggageClaim, BrickWallFire, DollarSign, User } from "lucide-react"
import { VendorRevenueCard } from "./vendor-revenue-card"

export const VendorDashboardReports = () => {
  const { data, isPending } = useQuery({
    queryKey: ["vendor-reports"],
    queryFn: vendorReportsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  if (isPending) {
    return <>loading...</>
  }
  const isPositive =
    (data?.order.percentage ?? 0) >= 0 ||
    (data?.revenue.percentage ?? 0) >= 0 ||
    (data?.orderItem.percentage ?? 0) >= 0 ||
    (data?.uniqueUser.percentage ?? 0) >= 0
  const monthName = new Date().toLocaleString("en-US", { month: "long" })

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <VendorRevenueCard
        isPositive={isPositive}
        percentage={data?.revenue.percentage ?? 0}
        title="Total Revenue"
        total={data?.revenue.total ?? 0}
        icon={DollarSign}
        current={data?.revenue.current ?? 0}
        currentTitle={`${monthName} Revenue`}
        isRevenue={true}
      />
      <VendorRevenueCard
        isPositive={isPositive}
        percentage={data?.order.percentage ?? 0}
        title="Lifetime Order"
        total={data?.order.total ?? 0}
        icon={BaggageClaim}
        current={data?.order.current ?? 0}
        currentTitle={`${monthName} orders`}
      />
      <VendorRevenueCard
        isPositive={isPositive}
        percentage={data?.orderItem.percentage ?? 0}
        title="Total Quantities"
        total={data?.orderItem.total ?? 0}
        icon={BrickWallFire}
        current={data?.orderItem.current ?? 0}
        currentTitle={`${monthName} Quantities`}
      />
      <VendorRevenueCard
        isPositive={isPositive}
        percentage={data?.uniqueUser.percentage ?? 0}
        title="Total Users"
        total={data?.uniqueUser.total ?? 0}
        icon={User}
        current={data?.uniqueUser.current ?? 0}
        currentTitle={`${monthName} Users`}
      />
    </div>
  )
}
