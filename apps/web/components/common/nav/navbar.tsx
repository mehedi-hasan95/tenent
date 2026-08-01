"use client"
import { LoginButton } from "@/components/auth/login-button"
import { Logo } from "../logo"
import { useGetSession } from "@/hooks/auth/use-auth"
import { ProfileButton } from "./profile-button"
import { WishlistButton } from "./wishlist-button"
import { AddToCartButton } from "./add-to-cart-button"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { usePathname } from "next/navigation"
import { SearchFilter } from "@/app/(home)/products/_components/filters/search-filter"
import { Suspense } from "react"

interface Props {
  className?: string
}
export const NavBar = ({ className }: Props) => {
  const { user } = useGetSession()
  const pathName = usePathname()
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Logo />
      {pathName === "/products" && (
        <Suspense>
          <SearchFilter />
        </Suspense>
      )}
      <div className="flex items-center gap-5">
        <Link href={"/products"}>
          <Button variant={"link"}>Products</Button>
        </Link>
        <WishlistButton showBadge />
        <AddToCartButton showBadge />
        {user?.id ? <ProfileButton user={user} /> : <LoginButton />}
      </div>
    </div>
  )
}
