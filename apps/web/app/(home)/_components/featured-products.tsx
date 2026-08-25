"use client"

import { AddToCartButton } from "@/components/common/nav/add-to-cart-button"
import { WishlistButton } from "@/components/common/nav/wishlist-button"
import { StarRating } from "@/components/common/products/star-rating"
import { useGetBoostedProducts } from "@/hooks/products/use-products"
import { formatName, formatPrice } from "@/lib/lib"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const FeaturedProducts = () => {
  const { data } = useGetBoostedProducts()
  const router = useRouter()
  return (
    <>
      {Boolean(
        data.length && (
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
                      key={item.productBoost.id}
                      className="md:basic-1/2 basis-1/1 pl-3 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div
                        onClick={() =>
                          router.push(`/products/${item.products.id}`)
                        }
                        className="group hover:border-primary-500/50 relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                          <Image
                            src={item.products.images[0]!}
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </section>
        )
      )}
    </>
  )
}
