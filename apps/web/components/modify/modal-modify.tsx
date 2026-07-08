"use client"
import { useModalActiveStore } from "@/store/useModalActiveStore"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { JSX } from "react"

interface Props {
  trigger?: JSX.Element
  title: string
  description?: string
  children: React.ReactNode
}
export const ModalModify = ({
  trigger = <Button variant="outline">Show Dialog</Button>,
  title,
  description,
  children,
}: Props) => {
  const { onOpen, open } = useModalActiveStore()
  return (
    <AlertDialog open={open} onOpenChange={onOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}
