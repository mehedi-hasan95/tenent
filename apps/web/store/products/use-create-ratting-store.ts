import { create } from "zustand"

type storeType = {
  productId: string
  orderId: string
  title: string
  createdAt: Date
}

type addRating = {
  data: storeType | null
  addData: (data: storeType) => void
  clear: () => void
}

export const useCreateRatingStore = create<addRating>((set) => ({
  data: null,
  addData: (data) => set({ data }),
  clear: () => set({ data: null }),
}))
