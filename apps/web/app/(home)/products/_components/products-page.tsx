"use client"

import { Suspense, useEffect, useState } from "react"
import { ProductsLeftSidebar } from "./products-left-sidebar"
import { ProductsRightSidebar } from "./products-right-sidebar"

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
    <div className="grid gap-3 lg:grid-cols-4">
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
