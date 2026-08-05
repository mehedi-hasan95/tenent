"use client"
import { LoginButton } from "@/components/auth/login-button"
import { Logo } from "../logo"
import { useGetSession } from "@/hooks/auth/use-auth"
import { ProfileButton } from "./profile-button"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { usePathname } from "next/navigation"
import { SearchFilter } from "@/app/(home)/products/_components/filters/search-filter"
import { Suspense } from "react"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"
import { FaCartShopping } from "react-icons/fa6"
import { Badge } from "@workspace/ui/components/badge"
import { Heart } from "lucide-react"
import { useAddToWishlistStore } from "@/store/products/use-add-to-wishlist"

interface Props {
  className?: string
}
export const NavBar = ({ className }: Props) => {
  const { user } = useGetSession()
  const pathName = usePathname()
  const { products } = useAddToCartStore()
  const { products: wishlist } = useAddToWishlistStore()
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
        <Link href={"/wishlist"} className="relative flex items-center gap-5">
          <Heart size={20} />
          <Badge className="absolute -top-3 -right-4">{wishlist.length}</Badge>
        </Link>
        <Link
          href={"/add-to-cart"}
          className="relative flex items-center gap-5"
        >
          <FaCartShopping size={20} />
          <Badge className="absolute -top-3 -right-4">{products.length}</Badge>
        </Link>
        {user?.id ? <ProfileButton user={user} /> : <LoginButton />}
      </div>
    </div>
  )
}
