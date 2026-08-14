import { Badge } from "@workspace/ui/components/badge"
import { ORDER_STATUS_TYPE } from "@workspace/validators/types/orders.types"

interface OrderStatusBadgeProps {
  status: ORDER_STATUS_TYPE
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = (status: ORDER_STATUS_TYPE) => {
    switch (status) {
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "REFUNDED":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: ORDER_STATUS_TYPE) => {
    switch (status) {
      case "PROCESSING":
        return "⏳"
      case "SHIPPED":
        return "🚚"
      case "DELIVERED":
        return "✓"
      case "CANCELLED":
        return "✕"
      case "REFUNDED":
        return "↩"
      default:
        return "•"
    }
  }

  return (
    <Badge className={getStatusColor(status)}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {status}
    </Badge>
  )
}
