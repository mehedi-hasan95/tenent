import { create } from "zustand"

interface Props {
  open: boolean
  onOpen: (open: boolean) => void
}

export const useModalActiveStore = create<Props>((set) => ({
  open: false,
  onOpen: (open) => set({ open }),
}))
