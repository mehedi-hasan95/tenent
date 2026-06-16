import { create } from "zustand"

interface Props {
  open: boolean
  onOpen: (open: boolean) => void
}

export const useDeleteModalStore = create<Props>((set) => ({
  open: false,
  onOpen: (open) => set({ open }),
}))
