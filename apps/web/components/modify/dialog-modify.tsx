"use client"
import { useDialogActiveStore } from "@/store/useModalActiveStore"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { JSX } from "react"

interface Props {
  trigger?: JSX.Element
  title?: string
  children: React.ReactNode
  className?: string
}
export const DialogModify = ({
  children,
  className,
  title,
  trigger = <Button>Open</Button>,
}: Props) => {
  const { onOpen, open } = useDialogActiveStore()
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
