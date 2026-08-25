import {
  ChartNoAxesCombined,
  LayoutDashboard,
  Puzzle,
  ShoppingBasket,
  Trash2,
  TrendingUp,
} from "lucide-react"
import { AiFillProduct } from "react-icons/ai"
import { FaStripeS } from "react-icons/fa6"
import { TbCreditCardRefund } from "react-icons/tb"

export const VENDOR_OVERVIEW = [
  {
    name: "Dashboard",
    slug: "/vendor",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    slug: "/vendor/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Stripe",
    slug: "/vendor/stripe-connect",
    icon: FaStripeS,
  },
]

export const VENDOR_ACT = [
  { name: "Products", slug: "/vendor/products", icon: AiFillProduct },
  { name: "Boosting", slug: "/vendor/boosting", icon: TrendingUp },
  { name: "Trash", slug: "/vendor/trash", icon: Trash2 },
  { name: "Coupon", slug: "/vendor/coupon", icon: Puzzle },
]

export const VENDOR_COMMERCE = [
  {
    name: "Orders",
    slug: "/vendor/orders",
    icon: ShoppingBasket,
  },
  {
    name: "Refunds",
    slug: "/vendor/refunds",
    icon: TbCreditCardRefund,
  },
]
