"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { LoadingButton } from "./loading-button"

interface Props {
  open: boolean
  onOpenChange: () => void
  onSubmit: () => void
  title?: string
  description?: string
  loading?: boolean
}
export const TrashedModal = ({
  onOpenChange,
  onSubmit,
  open,
  title = "Do you want to delete this category?",
  description = "If you delete this category will be store in trash for 30 days",
  loading,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {loading ? (
            <LoadingButton />
          ) : (
            <Button onClick={onSubmit}>Continue</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
