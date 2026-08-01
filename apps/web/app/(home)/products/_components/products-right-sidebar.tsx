"use client"

import { AddToCartButton } from "@/components/common/nav/add-to-cart-button"
import { WishlistButton } from "@/components/common/nav/wishlist-button"
import { InfinityScroll } from "@/components/common/products/infinity-scroll"
import { StarRating } from "@/components/common/products/star-rating"
import { useGetAllProducts } from "@/hooks/products/use-products"
import { formatName, formatPrice } from "@/lib/lib"
import Image from "next/image"
import Link from "next/link"

export const ProductsRightSidebar = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllProducts()
  console.log(data)
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <div
            className="group hover:border-primary-500/50 relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            key={item.products.id}
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
              <Image
                src={item.products.images[0]!}
                alt={item.products.title}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3">
                <WishlistButton className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80" />
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                <AddToCartButton
                  className="w-full justify-center rounded-xl bg-blue-500 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-blue-600"
                  title="Add to Cart"
                />
              </div>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <Link
                    href={"#"}
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
      <InfinityScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isManual
      />
    </div>
  )
}
