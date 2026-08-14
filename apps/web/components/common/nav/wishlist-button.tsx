"use client"

import { useAddToWishlistStore } from "@/store/products/use-add-to-wishlist-store"
import { cn } from "@workspace/ui/lib/utils"
import { Heart } from "lucide-react"
import { useShallow } from "zustand/react/shallow"

interface Props {
  title: string
  className?: string
  category: string
  id: string
  image: string
  price: number
  rating: number
  totalRatings: number
  btnTitle?: string
}

export const WishlistButton = ({
  className,
  title,
  category,
  id,
  image,
  price,
  rating,
  totalRatings,
  btnTitle,
}: Props) => {
  const { products, toggleItem } = useAddToWishlistStore(
    useShallow((state) => ({
      products: state.products,
      toggleItem: state.toggleItem,
    }))
  )

  const exist = products.some((p) => p.id === id)

  const product = {
    title,
    category,
    id,
    image,
    price,
    rating,
    totalRatings,
  }

  return (
    <button
      type="button"
      className={cn("relative flex items-center gap-5", className)}
      onClick={(e) => {
        e.stopPropagation()
        toggleItem(product)
      }}
    >
      <Heart
        className={cn(
          "cursor-pointer text-red-500 transition-transform duration-200 hover:scale-120",
          exist && "fill-red-500"
        )}
      />
      {btnTitle}
    </button>
  )
}
