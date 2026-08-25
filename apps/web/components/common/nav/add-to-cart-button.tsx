"use client"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"
import { cn } from "@workspace/ui/lib/utils"
import { FaCartShopping } from "react-icons/fa6"
import { useShallow } from "zustand/react/shallow"

interface Props {
  className?: string
  id: string
  btnTitle?: string
  quantity: number
  usedCoupon?: string | undefined
  size?: string | undefined
  color?: string | undefined
}
export const AddToCartButton = ({
  className,
  id,
  btnTitle,
  quantity,
  usedCoupon,
  size,
  color,
}: Props) => {
  const { addItem, products } = useAddToCartStore(
    useShallow((state) => ({
      products: state.products,
      addItem: state.addItem,
    }))
  )
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
          id,
          quantity,
          usedCoupon,
          size,
          color,
        })
      }}
    >
      <FaCartShopping size={20} />
      {exist ? "Product in Cart" : btnTitle}
    </button>
  )
}
