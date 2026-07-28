"use client"

import { boostedProductsAction } from "@/api/products/products-action"
import { AddToCartButton } from "@/components/common/nav/add-to-cart-button"
import { WishlistButton } from "@/components/common/nav/wishlist-button"
import { formatName, formatPrice } from "@/lib/lib"
import { useQuery } from "@tanstack/react-query"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const FeaturedProducts = () => {
  const { data } = useQuery({
    queryKey: ["boosted-products"],
    queryFn: boostedProductsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  const router = useRouter()
  return (
    <section id="shop" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
            Featured Products
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Carefully selected top-rated items from our diverse network of
            verified tenants.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-1">
            {data?.map((item) => (
              <CarouselItem
                key={item.id}
                className="md:basic-1/2 basis-1/1 pl-3 lg:basis-1/3 xl:basis-1/4"
              >
                <div
                  onClick={() => router.push(`/products/${item.product.id}`)}
                  className="group hover:border-primary-500/50 relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <Image
                      src={item.product.images[0]!}
                      alt={item.product.title}
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
                          {formatName(item.product.categorySlug)}
                        </Link>
                        <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 font-bold text-slate-900 transition-colors dark:text-white">
                          {item.product.title}
                        </h3>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatPrice(item.product.salePrice)}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center gap-1 text-xs text-amber-500">
                      {/* todo: implement ratings */}
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} />
                      ))}
                      <span className="ml-1 text-slate-400 dark:text-slate-500">
                        (124)
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"></div>
      </div>
    </section>
  )
}
