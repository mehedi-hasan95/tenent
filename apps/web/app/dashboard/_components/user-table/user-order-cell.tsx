"use client"
import { useCreateRatingStore } from "@/store/products/use-create-ratting-store"
import { useDialogActiveStore } from "@/store/useModalActiveStore"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Eye, MoreHorizontal, NotebookPen } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  id: string
  orderId: string
  productId: string
  title: string
  createdAt: Date
}
export const UserOrderCell = ({
  id,
  orderId,
  productId,
  title,
  createdAt,
}: Props) => {
  const router = useRouter()
  const onModalOpen = useDialogActiveStore((state) => state.onOpen)
  const addRating = useCreateRatingStore((state) => state.addData)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Vendor Products</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/orders/${id}`)}
        >
          <Eye />
          Track Order
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            addRating({ orderId, productId, title, createdAt })
            onModalOpen(true)
          }}
        >
          <NotebookPen />
          Rating & Reviews
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
