import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { Heart } from "lucide-react"

interface Props {
  title?: string
  showBadge?: boolean
  className?: string
}
export const WishlistButton = ({
  className,
  title,
  showBadge = false,
}: Props) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "relative flex cursor-pointer items-center gap-5",
        className
      )}
    >
      <Heart className="text-red-500 hover:fill-red-500" />
      {title}
      {showBadge && <Badge className="absolute -top-3 -right-4">0</Badge>}
    </div>
  )
}
