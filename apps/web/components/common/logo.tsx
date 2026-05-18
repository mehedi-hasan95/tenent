import Link from "next/link"

export const Logo = () => {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent md:h-10 md:w-10">
        <span className="text-lg font-bold text-white md:text-xl">T</span>
      </div>
      <div className="hidden flex-col sm:flex">
        <span className="text-sm font-bold text-foreground md:text-base">
          Tenent
        </span>
        <span className="text-xs text-muted-foreground">Multi-Tenent</span>
      </div>
    </Link>
  )
}
