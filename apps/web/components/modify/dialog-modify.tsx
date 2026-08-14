"use client"
import { useDialogActiveStore } from "@/store/useModalActiveStore"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { JSX } from "react"
import { useShallow } from "zustand/react/shallow"

interface Props {
  trigger?: JSX.Element
  title?: string
  children: React.ReactNode
  className?: string
  description?: string
}
export const DialogModify = ({
  children,
  className,
  title,
  trigger = <Button>Open</Button>,
  description,
}: Props) => {
  const { onOpen, open } = useDialogActiveStore(
    useShallow((state) => ({
      open: state.open,
      onOpen: state.onOpen,
    }))
  )
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
