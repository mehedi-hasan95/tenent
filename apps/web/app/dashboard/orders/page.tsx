import { GreetingMessage } from "@/components/common/greeting-message"
import { Separator } from "@workspace/ui/components/separator"
import { UserAllOrders } from "../_components/user-table/user-all-orders"

const Page = async () => {
  return (
    <div className="space-y-3">
      <GreetingMessage />
      <h2 className="text-xl font-bold md:text-2xl lg:text-3xl">My Orders</h2>
      <Separator />
      <UserAllOrders />
    </div>
  )
}

export default Page
