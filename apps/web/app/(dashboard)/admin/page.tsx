import { GreetingMessage } from "@/components/common/greeting-message"
import { AdminDashboardReports } from "./_components/admin-reports/admin-revenue-reports"
import { AdminReactMap } from "./_components/admin-reports/admin-react-map"
import { AdminYearlyReport } from "./_components/admin-reports/admin-yearly-report"
import { AdminDailyReport } from "./_components/admin-reports/admin-daily-report"
import { AdminPopularProducts } from "./_components/admin-reports/admin-popular-products"
import { AdminProductsCatsCount } from "./_components/admin-reports/admin-products-cats-count"

const Page = async () => {
  return (
    <div className="space-y-4">
      <GreetingMessage />
      <AdminDashboardReports />
      <AdminProductsCatsCount />
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminReactMap />
        <AdminYearlyReport />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminDailyReport />
        <AdminPopularProducts />
      </div>
    </div>
  )
}

export default Page
