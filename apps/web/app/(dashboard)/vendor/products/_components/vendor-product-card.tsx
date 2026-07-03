import { formatName, formatPrice } from "@/lib/lib"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { Pen, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Props {
  data: PRODUCT_TYPE
}
export const VendorProductCard = ({ data }: Props) => {
  console.log(data)
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <Image
        src={
          data?.images?.length
            ? (data?.images[0] as string)
            : "/placeholder.webp"
        }
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover"
        height={500}
        width={500}
      />
      <CardHeader>
        <CardAction>
          <Badge className="bg-blue-800 text-white">
            {formatName(data.categorySlug)}
          </Badge>
        </CardAction>
        <CardTitle className="line-clamp-1">{data.title}</CardTitle>
        <CardDescription>
          <p className="line-clamp-2">{data.shortDescription}</p>
          <div className="flex flex-wrap justify-between">
            <h4 className="text-md font-bold">
              Price: {formatPrice(data.salePrice)}
            </h4>
            <h4 className="text-md font-bold">
              Base Price: {formatPrice(data.basePrice)}
            </h4>
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col space-y-4">
        <Link href={"#"} className="w-full">
          <Button className="w-full bg-blue-800 text-white">
            View Details
          </Button>
        </Link>
        <div className="flex w-full gap-2">
          <Link href={`/vendor/products/${data.id}`} className="flex-1">
            <Button className="w-full">
              <Pen /> Edit
            </Button>
          </Link>

          <Button className="flex-1" variant={"destructive"}>
            <Trash2 /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
