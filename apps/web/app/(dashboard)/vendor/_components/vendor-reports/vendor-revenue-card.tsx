import { formatPrice } from "@/lib/lib"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { TrendingDown, TrendingUp } from "lucide-react"

interface Props {
  title: string
  total: number
  currentTitle: string
  current: number
  percentage: number
  isPositive: boolean
  icon?: React.ElementType
  isRevenue?: boolean
}
export const VendorRevenueCard = ({
  isPositive,
  percentage,
  title,
  currentTitle,
  current,
  total,
  icon: Icon,
  isRevenue = false,
}: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-1 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            {Icon && <Icon size="20" />}
            {title}
          </span>
          <span className="flex items-center gap-1">
            {Icon && <Icon size="20" />}
            {currentTitle}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xl font-bold">
        <div className="flex items-center justify-between text-2xl font-bold">
          <span>{isRevenue ? formatPrice(total) : total}</span>
          <span>{isRevenue ? formatPrice(current) : current}</span>
        </div>
      </CardContent>
      <div className="mt-1 flex items-center gap-1 px-4 text-xs text-muted-foreground">
        <Badge variant={isPositive ? "primary" : "destructive"}>
          {isPositive ? <TrendingUp /> : <TrendingDown />}
          {percentage}%
        </Badge>
        <span>from previous month</span>
      </div>
    </Card>
  )
}
