import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"

interface Props {
  title?: string
  className?: string
}
export const LoadingButton = ({ title = "Loading...", className }: Props) => {
  return (
    <Button disabled className={cn(className)}>
      <Spinner data-icon="inline-start" />
      {title}
    </Button>
  )
}
