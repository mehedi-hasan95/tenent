"use client"

import { getArrayProductsAction } from "@/api/products/products-action"
import { AddToCartButton } from "@/components/common/nav/add-to-cart-button"
import { WishlistButton } from "@/components/common/nav/wishlist-button"
import { StarRating } from "@/components/common/products/star-rating"
import { formatName, formatPrice } from "@/lib/lib"
import { useAddToWishlistStore } from "@/store/products/use-add-to-wishlist-store"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useShallow } from "zustand/react/shallow"

export const WishListPage = () => {
  const router = useRouter()
  const { products, clear } = useAddToWishlistStore(
    useShallow((state) => ({
      products: state.products,
      clear: state.clear,
    }))
  )

  const productIds = products.map((item) => item.id)
  const { data } = useQuery({
    queryKey: ["wishlist-data", productIds],
    queryFn: () => getArrayProductsAction({ ids: productIds }),
    enabled: !!productIds,
    staleTime: 1000 * 5 * 60,
  })
  if (!products.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              My Wishlist
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Save the items you love and buy them later.
            </p>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex min-h-64 items-center justify-center text-2xl font-bold">
          No wishlist added
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            My Wishlist
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Save the items you love and buy them later.
          </p>
        </div>
        <Button
          variant={"ghost"}
          className="text-rose-400 hover:text-red-500"
          onClick={() => clear()}
        >
          <X />
          Clear Wishlist
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="grid grid-cols-4 gap-3 pt-8">
        {data?.map((item) => (
          <div
            onClick={() => router.push(`/products/${item.products.id}`)}
            className="group hover:border-primary-500/50 relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            key={item.products.id}
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
              <Image
                src={item.products.images[0] as string}
                alt={item.products.title}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3">
                <WishlistButton
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80"
                  id={item.products.id}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                <AddToCartButton
                  className="w-full justify-center rounded-xl bg-blue-500 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-blue-600"
                  btnTitle="Add to Cart"
                  id={item.products.id}
                  quantity={1}
                />
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <Link
                    href={`/products?cats=${item.products.categorySlug}`}
                    className="text-primary-600 dark:text-primary-400 mb-1 line-clamp-1 text-xs font-medium tracking-wider uppercase"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatName(item.products.categorySlug)}
                  </Link>
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 font-bold text-slate-900 transition-colors dark:text-white">
                    {item.products.title}
                  </h3>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.products.salePrice)}
                </span>
              </div>
              <StarRating
                rating={item.avgRating}
                totalRatings={item.ratingCount}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
