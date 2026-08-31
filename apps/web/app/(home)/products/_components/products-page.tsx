"use client"

import { Suspense, useEffect, useState } from "react"
import { ProductsLeftSidebar } from "./products-left-sidebar"
import { ProductsRightSidebar } from "./products-right-sidebar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Menu } from "lucide-react"

export const ProductsPage = () => {
  const [top, setTop] = useState(80)

  useEffect(() => {
    const handleScroll = () => {
      setTop(window.scrollY >= 70 ? 10 : 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-4">
      <div className="sticky top-2 z-30 flex items-center justify-end bg-background/95 py-2 backdrop-blur lg:hidden">
        {/* <span className="text-sm font-semibold">Filters</span> */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Suspense>
              <ProductsLeftSidebar />
            </Suspense>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block">
        <div
          className="fixed transition-all duration-300 ease-in-out"
          style={{
            top: `${top}px`,
            width: "calc(25% - 12px)",
          }}
        >
          <Suspense>
            <ProductsLeftSidebar />
          </Suspense>
        </div>
      </div>

      <div className="lg:col-span-3">
        <Suspense>
          <ProductsRightSidebar />
        </Suspense>
      </div>
    </div>
  )
}
