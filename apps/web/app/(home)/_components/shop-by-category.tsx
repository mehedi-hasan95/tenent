"use client"

import { useGetCategories } from "@/hooks/categories/use-categories"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import Image from "next/image"
import Link from "next/link"

export const ShopByCategory = () => {
  const { data } = useGetCategories("true")
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Discover premium products across various niches
            </p>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-1">
            {data?.map((cat) => (
              <CarouselItem
                key={cat.id}
                className="md:basic-1/2 basis-1/1 pl-3 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/products?cats=${cat.slug}`}>
                  <div className="group hover:border-primary-500 dark:hover:border-primary-400 relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/50 dark:text-indigo-400">
                      {cat.image && (
                        <Image src={cat.image} alt="" height={40} width={40} />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
