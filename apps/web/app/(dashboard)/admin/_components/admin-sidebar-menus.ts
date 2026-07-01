import {
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  Plus,
  PlusCircle,
  ShoppingBasket,
  Trash,
} from "lucide-react"
import { FaStripeS } from "react-icons/fa6"
import { TbCreditCardRefund } from "react-icons/tb"

export const ADMIN_OVERVIEW = [
  {
    name: "Dashboard",
    slug: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    slug: "/admin/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Stripe",
    slug: "/admin/stripe-connect",
    icon: FaStripeS,
  },
]
export const ADMIN_COMMERCE = [
  {
    name: "Orders",
    slug: "/admin/orders",
    icon: ShoppingBasket,
  },
  {
    name: "Refunds",
    slug: "/admin/refunds",
    icon: TbCreditCardRefund,
  },
  {
    name: "Payments",
    slug: "/admin/payments",
    icon: CreditCard,
  },
]

export const ADMIN_ACT = [
  {
    name: "Categories",
    slug: "/admin/categories",
    icon: Plus,
  },
  {
    name: "Sub Categories",
    slug: "/admin/sub-categories",
    icon: PlusCircle,
  },
  {
    name: "Trash",
    slug: "/admin/trash",
    icon: Trash,
  },
]
