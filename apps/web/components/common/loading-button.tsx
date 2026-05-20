import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { LoaderCircle } from "lucide-react"

interface Props {
  title?: string
  className?: string
}
export const LoadingButton = ({ className, title = "Loading..." }: Props) => {
  return (
    <Button variant="outline" disabled className={cn(className)}>
      <LoaderCircle data-icon="inline-start" className="animate-spin" />
      {title}
    </Button>
  )
}
