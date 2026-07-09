import { CheckCircle, HelpCircle, Timer } from "lucide-react"

export const statuses = [
  {
    value: "draft",
    label: "Draft",
    icon: HelpCircle,
  },
  {
    value: "active",
    label: "Active",
    icon: CheckCircle,
  },
  {
    value: "archived",
    label: "Archived",
    icon: Timer,
  },
]
