"use client"
import { useAddToCartStore } from "@/store/products/use-add-to-cart"
import { cn } from "@workspace/ui/lib/utils"
import { FaCartShopping } from "react-icons/fa6"

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
  quantity: number
}
export const AddToCartButton = ({
  className,
  title,
  category,
  id,
  image,
  price,
  rating,
  totalRatings,
  btnTitle,
  quantity,
}: Props) => {
  const { addItem, products } = useAddToCartStore()
  const exist = products.some((p) => p.id === id)
  return (
    <button
      type="button"
      disabled={exist}
      className={cn(
        "relative flex cursor-pointer items-center gap-5",
        exist && "cursor-not-allowed",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (exist) return

        addItem({
          title,
          category,
          id,
          image,
          price,
          rating,
          totalRatings,
          quantity,
        })
      }}
    >
      <FaCartShopping size={20} />
      {exist ? "Product in Cart" : btnTitle}
    </button>
  )
}
