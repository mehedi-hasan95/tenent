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
  couponPercentage: number | null
  flatRate: number | null
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
  couponPercentage,
  flatRate,
}: Props) => {
  // Calculate base total
  const baseTotal = price * quantity

  // Determine final price based on coupon availability and validity
  let finalTotal = baseTotal
  let discountText = null

  if (usedCoupon && validCoupon) {
    if (couponPercentage !== null) {
      const discountAmount = baseTotal * (couponPercentage / 100)
      finalTotal = baseTotal - discountAmount
      discountText = `${couponPercentage}% off`
    } else if (flatRate !== null) {
      finalTotal = Math.max(0, baseTotal - flatRate)
      discountText = `${formatPrice(flatRate)} off`
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800">
      <Image
        src={image}
        alt={title}
        height={300}
        width={300}
        className="h-20 w-20 rounded-lg bg-gray-100 object-cover dark:bg-gray-700"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Pricing Display */}
        <div className="font-bold text-indigo-600 dark:text-indigo-400">
          {formatPrice(price)} x {quantity} ={" "}
          {usedCoupon && validCoupon && discountText ? (
            <span className="inline-flex items-center gap-2">
              <span className="text-gray-400 line-through">
                {formatPrice(baseTotal)}
              </span>
              <span>{formatPrice(finalTotal)}</span>
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {discountText}
              </span>
            </span>
          ) : (
            formatPrice(baseTotal)
          )}
        </div>

        {size && <p className="text-sm text-gray-500">Size = {size}</p>}

        {usedCoupon && !validCoupon && (
          <p className="mt-1 text-sm text-red-400">
            Coupon expired. Applied <strong>regular</strong> checkout process.
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
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
