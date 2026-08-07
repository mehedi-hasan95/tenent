"use client"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Eye, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  id: string
}
export const UserOrderCell = ({ id }: Props) => {
  const router = useRouter()
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
