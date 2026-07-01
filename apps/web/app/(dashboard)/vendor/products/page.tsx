"use client"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

const Page = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">Products (0)</h2>
        <Link href={"/vendor/products/create-product"}>
          <Button size={"lg"}>
            <PlusCircle /> Create Product
          </Button>
        </Link>
      </div>
      <Separator className="my-3" />
    </div>
  )
}

export default Page
