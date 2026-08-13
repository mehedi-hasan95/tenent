import { GreetingMessage } from "@/components/common/greeting-message"
import { VendorDashboardReports } from "./_components/vendor-reports/vendor-revenue-reports"
import { VendorReactMap } from "./_components/vendor-reports/vendor-react-map"
import { VendorYearlyReport } from "./_components/vendor-reports/vendor-yearly-report"

const Page = async () => {
  return (
    <div className="space-y-4">
      <GreetingMessage />
      <VendorDashboardReports />
      <div className="grid gap-5 lg:grid-cols-2">
        <VendorReactMap />
        <VendorYearlyReport />
      </div>
    </div>
  )
}

export default Page
