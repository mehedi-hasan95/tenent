import { useDeleteModalStore } from "@/store/useDeleteStore"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { JSX } from "react"

interface Props {
  title?: string
  description?: string
  trigger?: JSX.Element
  onDelete: () => void
}
export const DeleteModal = ({
  description = "This action cannot be undone. This will permanently delete your data from our servers.",
  title = "Are you absolutely sure?",
  trigger = <Button variant="outline">Show Dialog</Button>,
  onDelete,
}: Props) => {
  const { onOpen, open } = useDeleteModalStore()
  return (
    <AlertDialog open={open} onOpenChange={onOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onDelete}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
