import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { FaCartShopping } from "react-icons/fa6"

interface Props {
  title?: string
  showBadge?: boolean
  className?: string
}
export const AddToCartButton = ({
  className,
  title,
  showBadge = false,
}: Props) => {
  return (
    <div className={cn("relative flex items-center gap-5", className)}>
      <FaCartShopping size={20} />
      {title}
      {showBadge && <Badge className="absolute -top-3 -right-4">0</Badge>}
    </div>
  )
}
