import {
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  Plus,
  PlusCircle,
  ShoppingBasket,
  SquareFunction,
} from "lucide-react"

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
    icon: SquareFunction,
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
]
