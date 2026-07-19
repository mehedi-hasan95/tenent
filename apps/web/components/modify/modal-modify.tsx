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
import { cn } from "@workspace/ui/lib/utils"
import { JSX } from "react"

interface Props {
  trigger?: JSX.Element
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}
export const ModalModify = ({
  trigger = <Button variant="outline">Show Dialog</Button>,
  title,
  description,
  children,
  className,
}: Props) => {
  const { onOpen, open } = useModalActiveStore()
  return (
    <AlertDialog open={open} onOpenChange={onOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}
