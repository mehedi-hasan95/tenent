"use client"

import { HtmlParser } from "@/components/common/products/html-parser"
import { useGetBoostedProducts } from "@/hooks/products/use-products"
import { formatName } from "@/lib/lib"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { cn } from "@workspace/ui/lib/utils"
import { CircleChevronLeft, CircleChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export const BoostedProductsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeDetails, setActiveDetails] = useState(false)

  const { data } = useGetBoostedProducts()

  const hasData = data?.length ? data.length : 0
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % hasData)
  }, [hasData])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + hasData) % hasData)
  }

  const handleActive = () => {
    setActiveDetails((prev) => !prev)
  }

  useEffect(() => {
    if (activeDetails) return

    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [activeDetails, currentIndex, handleNext])

  const getPosition = (index: number) => {
    const diff = (index - currentIndex + hasData) % hasData

    if (diff === 0) return "item-2"
    if (diff === 1) return `item-3 ${activeDetails && "hidden"}`
    if (diff === 2) return `item-4 ${activeDetails && "hidden"}`
    if (diff === hasData - 1) return "item-1"
    if (diff === hasData - 2) return "item-5"

    return "hidden-item"
  }
  if (!data?.length) {
    return
  }
  return (
    <section>
      <div className="carousel relative h-200 overflow-hidden">
        <div className="list absolute top-0 left-1/2 h-[80%] w-350 max-w-[90%] -translate-x-1/2">
          {data?.map((item, idx) => (
            <div
              key={item.productBoost.id}
              className={`absolute right-0 left-0 h-full w-full transition-all duration-500 ease-in-out lg:w-[80%] ${getPosition(
                idx
              )}`}
            >
              {/* IMAGE */}
              <Image
                src={item?.products?.images[0] as string}
                alt={item.products.title}
                width={500}
                height={500}
                className={cn(
                  "absolute top-1/2 right-0 z-10 w-[50%] -translate-y-1/2 duration-500",
                  activeDetails &&
                    idx === currentIndex &&
                    "right-1/2 transition-[right] duration-500"
                )}
                priority={idx === currentIndex}
              />

              {/* CONTENT */}
              <div
                className={cn(
                  "pointer-events-none absolute top-1/2 z-20 w-100 -translate-y-1/2 opacity-0 transition-opacity duration-500",
                  idx === currentIndex && "pointer-events-auto opacity-100",
                  activeDetails && "hidden"
                )}
              >
                <div className="title text-2xl font-bold">
                  {item.products.title}
                </div>
                <div className="topic text-xl">
                  {formatName(item.products.categorySlug)}
                </div>
                <div className="des">{item.products.shortDescription}</div>

                <Button
                  variant={"primary"}
                  className="mt-4 cursor-pointer rounded px-4 py-2 text-white"
                  onClick={handleActive}
                >
                  See More
                </Button>
              </div>

              {/* DETAILS */}
              <div
                className={cn(
                  "pointer-events-none opacity-0",
                  activeDetails &&
                    "pointer-events-auto absolute top-1/2 right-0 w-1/2 -translate-y-1/2 space-y-5 text-right opacity-100"
                )}
              >
                <h2 className="text-2xl font-bold">{item.products.title}</h2>
                <ScrollArea className="hidden md:block md:h-75 lg:h-100">
                  <div className="pr-4">
                    <HtmlParser html={item.products.description} />
                  </div>
                </ScrollArea>
                <Link
                  href={`/products/${item.productBoost.productId}`}
                  className="underline underline-offset-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATION */}
        <div className="absolute bottom-10 left-1/2 z-30 flex w-285 max-w-[90%] -translate-x-1/2 justify-between gap-4">
          <CircleChevronLeft
            onClick={handlePrev}
            className={cn(
              "size-8 cursor-pointer",
              activeDetails && "pointer-events-none opacity-0"
            )}
          />

          <Button
            variant={"outline"}
            className={cn(
              "pointer-events-none opacity-0",
              activeDetails && "pointer-events-auto cursor-pointer opacity-100"
            )}
            onClick={handleActive}
          >
            Go Back
          </Button>

          <CircleChevronRight
            onClick={handleNext}
            className={cn(
              "size-8 cursor-pointer",
              activeDetails && "pointer-events-none opacity-0"
            )}
          />
        </div>
      </div>
    </section>
  )
}
