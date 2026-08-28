"use client"
import { formatPrice } from "@/lib/lib"
import { Button } from "@workspace/ui/components/button"
import { Trash } from "lucide-react"
import Image from "next/image"

interface Props {
  image: string
  price: number
  quantity: number
  title: string
  removeCart: () => void
  onUpdateQuantity: (quantity: number) => void
  size?: string | undefined
  usedCoupon: boolean
  validCoupon: boolean
}
export const CartItem = ({
  image,
  price,
  quantity,
  title,
  removeCart,
  onUpdateQuantity,
  size,
  usedCoupon,
  validCoupon,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800">
      <Image
        src={image}
        alt=""
        height={300}
        width={300}
        className="h-20 w-20 rounded-lg bg-gray-100 object-cover dark:bg-gray-700"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="font-bold text-indigo-600 dark:text-indigo-400">
          {formatPrice(price)} x {quantity} = {formatPrice(price * quantity)}
        </p>
        {size && <p>Size = {size}</p>}
        <p>{usedCoupon && "Coupon Used"}</p>
        {usedCoupon && !validCoupon && (
          <p className="text-red-300">
            Coupon expired. It will apply <strong>regular</strong> checkout
            process
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
          <Button
            variant={"outline"}
            className="flex h-8 w-8 items-center justify-center rounded-md font-bold transition-colors hover:bg-white dark:hover:bg-gray-600"
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <Button
            variant={"outline"}
            className="flex h-8 w-8 items-center justify-center rounded-md font-bold transition-colors hover:bg-white dark:hover:bg-gray-600"
            onClick={() => onUpdateQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button variant={"destructive"} onClick={removeCart}>
          <Trash />
        </Button>
      </div>
    </div>
  )
}
