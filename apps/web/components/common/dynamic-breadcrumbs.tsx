"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

export function DynamicBreadcrumbs() {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter((segment) => segment !== "")

  const formatSegment = (segment: string) => {
    return decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formatSegment(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
