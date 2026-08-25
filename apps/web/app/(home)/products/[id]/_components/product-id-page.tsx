"use client"

import { AddToCartButton } from "@/components/common/nav/add-to-cart-button"
import { WishlistButton } from "@/components/common/nav/wishlist-button"
import { HtmlParser } from "@/components/common/products/html-parser"
import { ProductGallery } from "@/components/common/products/product-gallery"
import { StarRating } from "@/components/common/products/star-rating"
import { useGetSingleProduct } from "@/hooks/products/use-products"
import { formatName, formatPrice } from "@/lib/lib"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { FaGifts } from "react-icons/fa6"
import { cn } from "@workspace/ui/lib/utils"
import { useShallow } from "zustand/react/shallow"

import { relatedProductAction } from "@/api/products/products-action"
import { useAddToCartStore } from "@/store/products/use-add-to-cart-store"

import { SpecificationTable } from "./specification-table"
import ReviewsSection from "./review-section"

interface Props {
  id: string
}

export const ProductIdPage = ({ id }: Props) => {
  const { products, updateQuantity: updateCart } = useAddToCartStore(
    useShallow((state) => ({
      products: state.products,
      updateQuantity: state.updateQuantity,
    }))
  )

  const { data } = useGetSingleProduct({ id })

  const getQuantity = products.find((item) => item.id === id)

  const [quantity, setQuantity] = useState<number>(getQuantity?.quantity ?? 1)

  const [size, setSize] = useState<string | undefined>(undefined)

  const [isColor, setIsColor] = useState<string | undefined>(undefined)

  const [couponInput, setCouponInput] = useState("")
  const [isCouponUsed, setIsCouponUsed] = useState<string | undefined>(
    undefined
  )

  const [couponError, setCouponError] = useState("")

  useEffect(() => {
    setQuantity(getQuantity?.quantity ?? 1)
  }, [getQuantity?.quantity])

  useEffect(() => {
    if (!data?.products) return

    setSize((current) => current ?? data.products.sizes?.at(-1))
    setIsColor((current) => current ?? data.products.color?.at(-1))
  }, [data])

  /**
   * Update cart store.
   */
  const updateCartState = ({
    id,
    quantity,
    color,
    size,
    usedCoupon,
  }: {
    id: string
    quantity?: number
    color?: string
    size?: string
    usedCoupon?: string
  }) => {
    updateCart(id, quantity, color, size, usedCoupon)
  }

  /**
   * Related products / ratings / reviews.
   */
  const { data: ratingsAndReviews } = useQuery({
    queryKey: ["related-products-and-others", id],
    queryFn: () => relatedProductAction({ id }),
    retry: 1,
    staleTime: 60 * 1000 * 5,
    enabled: !!id,
  })

  /**
   * Apply coupon.
   */
  const handleApplyCoupon = () => {
    setCouponError("")

    const enteredCoupon = couponInput.trim()

    if (!enteredCoupon) {
      setCouponError("Please enter a coupon code.")
      return false
    }

    const productCoupon = data?.coupons.code?.trim()

    if (
      productCoupon &&
      enteredCoupon.toLowerCase() === productCoupon.toLowerCase()
    ) {
      setIsCouponUsed(enteredCoupon)

      updateCartState({
        id: data?.products.id as string,
        usedCoupon: enteredCoupon,
      })

      return true
    }

    setIsCouponUsed(undefined)
    setCouponError("Invalid coupon code.")

    return false
  }

  /**
   * Decrease quantity.
   */
  const handleDecreaseQuantity = () => {
    if (!data?.products) return

    const newQuantity = Math.max(1, quantity - 1)

    setQuantity(newQuantity)

    updateCartState({
      id: data.products.id,
      quantity: newQuantity,
    })
  }

  /**
   * Increase quantity.
   */
  const handleIncreaseQuantity = () => {
    if (!data?.products) return

    const newQuantity = Math.min(data.products.stock ?? 1000, quantity + 1)

    setQuantity(newQuantity)

    updateCartState({
      id: data.products.id,
      quantity: newQuantity,
    })
  }

  if (!data) {
    return null
  }

  const product = data.products

  const specifications = (product.specification ?? []) as {
    key: string
    value: string
  }[]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Gallery */}
        <ProductGallery images={product.images ?? []} />

        {/* Product Information */}
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="mb-2 flex gap-2">
              <Badge className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                {formatName(product.categorySlug)}
              </Badge>

              <Badge className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                {formatName(product.subCategorySlug)}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold text-accent-foreground/90 sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <StarRating
                rating={data.avgRating}
                totalRatings={data.ratingCount}
                iconClassName="size-4"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">
              {formatPrice(product.salePrice)}
            </span>

            <span className="text-xl text-gray-400 line-through">
              {formatPrice(product.basePrice)}
            </span>

            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-600">
              SAVE {formatPrice(product.basePrice - product.salePrice)}
            </span>
          </div>

          {/* Short Description */}
          <p className="mb-8 line-clamp-3 text-lg leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>

          <div className="mb-8 space-y-6">
            {/* Colors */}
            {product.color && product.color.length > 0 && (
              <div>
                <span className="mb-3 block text-sm font-semibold text-muted-foreground">
                  Available Colors
                </span>

                <div className="flex gap-3">
                  {product.color.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      title={color}
                      onClick={() => {
                        setIsColor(color)

                        updateCartState({
                          id: product.id,
                          color,
                        })
                      }}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 border-border shadow-sm ring-muted-foreground hover:ring-2",
                        isColor === color && "ring-2 ring-muted-foreground"
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="mb-3 flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Select Size
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setSize(s)

                        updateCartState({
                          id: product.id,
                          size: s,
                        })
                      }}
                      className={
                        size === s
                          ? "border border-indigo-600! text-indigo-600"
                          : "border-gray-200 transition hover:border-indigo-600 hover:text-indigo-600"
                      }
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon */}
            {data.coupons &&
              data.coupons.isActive &&
              (!data.coupons.expiresAt ||
                new Date(data.coupons.expiresAt) >= new Date()) && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:bg-card">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                      <FaGifts />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
                        Available Coupon
                      </p>

                      {isCouponUsed ? (
                        <div className="mt-1">
                          <p className="text-sm font-bold text-green-600">
                            Coupon applied successfully!
                          </p>

                          <span className="mt-1 inline-block rounded border border-green-200 bg-white px-2 py-0.5 text-sm font-semibold text-green-600">
                            {isCouponUsed}
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className="mt-1 text-sm text-indigo-500">
                            Use code{" "}
                            <span className="rounded border border-indigo-200 bg-white px-2 py-0.5 font-bold">
                              {data.coupons.code}
                            </span>{" "}
                            {data.coupons.discountPercent ? (
                              <span className="font-extrabold">
                                {data.coupons.discountPercent}%
                              </span>
                            ) : (
                              formatPrice(data.coupons.flatDiscount ?? 0)
                            )}{" "}
                            for more off!
                          </p>

                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value)
                                setCouponError("")
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyCoupon()
                                }
                              }}
                              placeholder="Enter coupon code"
                              className="min-w-0 flex-1 rounded-lg border px-4"
                            />

                            <Button
                              type="button"
                              onClick={handleApplyCoupon}
                              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                              Apply
                            </Button>
                          </div>

                          {couponError && (
                            <p className="mt-2 text-xs font-medium text-red-500">
                              {couponError}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Quantity / Cart / Wishlist */}
          <div className="mb-12 flex gap-4">
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleDecreaseQuantity}
                className="flex h-9 w-9 items-center justify-center text-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                disabled={quantity <= 1}
              >
                −
              </Button>

              <span className="flex h-9 min-w-10 items-center justify-center border-border text-sm font-medium">
                {quantity}
              </span>

              <Button
                type="button"
                variant="outline"
                disabled={quantity >= (product.stock ?? 100)}
                onClick={handleIncreaseQuantity}
                className="flex h-9 w-9 items-center justify-center text-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                +
              </Button>
            </div>

            <AddToCartButton
              btnTitle="Add to Cart"
              className="flex-1 cursor-pointer items-center justify-center rounded-xl border-2 bg-card py-2 hover:bg-card/10"
              id={product.id}
              quantity={quantity}
              color={isColor}
              size={size}
              usedCoupon={isCouponUsed}
            />

            <WishlistButton id={product.id} />
          </div>

          {/* Stock */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span>
              In stock:{" "}
              <strong className="text-muted-foreground">
                {product.stock ? product.stock - product.totalSale : `♾️`} units
                available
              </strong>
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description / Specifications */}
      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-gray-200 pt-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-6 text-2xl font-bold">Product Description</h3>

          <HtmlParser html={product.description} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Specs</CardTitle>
          </CardHeader>

          <CardContent>
            {specifications.length > 0 && (
              <SpecificationTable specifications={specifications} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <ReviewsSection
        avgRating={data.avgRating}
        total={data.ratingCount}
        rating={ratingsAndReviews?.rating ?? []}
        review={ratingsAndReviews?.review ?? []}
      />
    </section>
  )
}
