import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

interface Props {
  className?: string
}
export const Logo = ({ className }: Props) => {
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2", className)}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent md:h-10 md:w-10">
        <span className="text-lg font-bold text-white md:text-xl">T</span>
      </div>
      <div className="hidden flex-col sm:flex">
        <span className="text-sm font-bold text-foreground md:text-base">
          Tenant
        </span>
        <span className="text-xs text-muted-foreground">Multi-Tenant</span>
      </div>
    </Link>
  )
}
