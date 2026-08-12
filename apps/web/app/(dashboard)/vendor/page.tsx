import { GreetingMessage } from "@/components/common/greeting-message"
import { VendorDashboardReports } from "./_components/vendor-reports/vendor-revenue-reports"
import VendorReactMap from "./_components/vendor-reports/vendor-react-map"

const Page = async () => {
  return (
    <div className="space-y-4">
      <GreetingMessage />
      <VendorDashboardReports />
      <VendorReactMap />
    </div>
  )
}

export default Page
