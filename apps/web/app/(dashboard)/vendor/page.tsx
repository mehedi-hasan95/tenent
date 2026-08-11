import { GreetingMessage } from "@/components/common/greeting-message"
import { VendorDashboardReports } from "./_components/vendor-reports/vendor-revenue-reports"

const Page = async () => {
  return (
    <div className="space-y-4">
      <GreetingMessage />
      <VendorDashboardReports />
    </div>
  )
}

export default Page
