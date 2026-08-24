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
import { FaGifts } from "react-icons/fa6"
import { SpecificationTable } from "./specification-table"
import { useQuery } from "@tanstack/react-query"
import { relatedProductAction } from "@/api/products/products-action"
import ReviewsSection from "./review-section"
interface Props {
  id: string
}
export const ProductIdPage = ({ id }: Props) => {
  const { data } = useGetSingleProduct({ id })
  const { data: ratingsAndReviews } = useQuery({
    queryKey: ["related-products-and-others", id],
    queryFn: () => relatedProductAction({ id }),
    retry: 1,
    staleTime: 60 * 1000 * 5,
    enabled: !!id,
  })
  if (!data) {
    return
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={data?.products.images ?? []} />
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="mb-2 flex gap-2">
              <Badge className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                {formatName(data?.products.categorySlug)}
              </Badge>
              <Badge className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                {formatName(data?.products.subCategorySlug)}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-accent-foreground/90 sm:text-4xl">
              {data.products.title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <StarRating
                rating={data.avgRating}
                totalRatings={data.ratingCount}
                iconClassName="size-4"
              />
            </div>
          </div>

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">
              {formatPrice(data.products.salePrice)}
            </span>
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(data.products.basePrice)}
            </span>
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-600">
              SAVE{" "}
              {formatPrice(data.products.basePrice - data.products.salePrice)}
            </span>
          </div>

          <p className="mb-8 line-clamp-3 text-lg leading-relaxed text-muted-foreground">
            {data.products.shortDescription}
          </p>

          <div className="mb-8 space-y-6">
            <div>
              <span className="mb-3 block text-sm font-semibold text-muted-foreground">
                Available Colors
              </span>
              <div className="flex gap-3">todo: color</div>
            </div>

            <div>
              <div className="mb-3 flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Select Size
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {data.products.sizes?.map((s) => (
                  <Button
                    key={s}
                    variant={"outline"}
                    size={"lg"}
                    className="border-gray-200 transition hover:border-indigo-600 hover:text-indigo-600"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {data.products.coupon && (
              <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:bg-card">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                    <FaGifts />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-indigo-400 uppercase">
                      Available Coupon
                    </p>
                    <p className="text-sm font-bold text-indigo-500">
                      Use code{" "}
                      <span className="rounded border border-indigo-200 bg-white px-2 py-0.5">
                        {data.products.coupon}
                      </span>{" "}
                      for more off!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-12 flex gap-4">
            <AddToCartButton
              btnTitle="Add to Cart"
              className="flex-1 cursor-pointer items-center justify-center rounded-xl border-2 bg-card py-2 hover:bg-card/10"
              category={data.products.categorySlug}
              id={data.products.id}
              image={data.products.images[0]!}
              price={data.products.basePrice}
              rating={data.avgRating}
              totalRatings={data.ratingCount}
              title={data.products.title}
              quantity={1}
              usedCoupon={false}
            />
            <WishlistButton
              category={data.products.categorySlug}
              id={data.products.id}
              image={data.products.images[0]!}
              price={data.products.basePrice}
              rating={data.avgRating}
              totalRatings={data.ratingCount}
              title={data.products.title}
            />
          </div>

          {/* <!-- Stock status --> */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>
              In stock:{" "}
              <strong className="text-muted-foreground">
                {data.products.stock} units available
              </strong>
            </span>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-gray-200 pt-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-6 text-2xl font-bold">Product Description</h3>
          <div className="">
            <HtmlParser html={data.products.description} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Quick Specs</CardTitle>
          </CardHeader>
          <CardContent>
            {Boolean((data?.products?.specification as []).length) && (
              <SpecificationTable
                specifications={
                  (data.products.specification ?? []) as {
                    key: string
                    value: string
                  }[]
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ReviewsSection
        avgRating={data.avgRating}
        total={data.ratingCount}
        rating={ratingsAndReviews?.rating ?? []}
        review={ratingsAndReviews?.review ?? []}
      />
    </section>
  )
}
