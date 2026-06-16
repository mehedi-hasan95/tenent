"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { DeleteModal } from "@/components/common/delete-modal"

interface Props {
  title: string
  description?: string
  children: React.ReactNode
  onDelete: () => void
  deleteBtn?: string
  disabled?: boolean
}
export const TrashList = ({
  children,
  onDelete,
  title,
  description,
  deleteBtn = "Delete All",
  disabled,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {disabled && (
        <CardFooter>
          <DeleteModal
            trigger={<Button variant={"destructive"}>{deleteBtn}</Button>}
            onDelete={onDelete}
          />
        </CardFooter>
      )}
    </Card>
  )
}
