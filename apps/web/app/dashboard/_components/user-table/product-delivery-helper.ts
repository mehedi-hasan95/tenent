import { CheckCircle, CircleOff, HelpCircle, Timer, Truck } from "lucide-react"

export const productShipping = [
  {
    value: "PROCESSING",
    label: "Processing",
    icon: Timer,
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    icon: Truck,
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: CircleOff,
  },
  {
    value: "REFUNDED",
    label: "Refunded",
    icon: HelpCircle,
  },
]
