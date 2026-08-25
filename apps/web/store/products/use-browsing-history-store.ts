import { create } from "zustand"
import { persist } from "zustand/middleware"

type productType = {
  id: string
}
type productTypeStore = {
  products: productType[]
  addItem: (product: productType) => void
  clear: () => void
}

export const useBrowsingHistoryStore = create<productTypeStore>()(
  persist(
    (set) => ({
      products: [],

      addItem: (product) =>
        set((state) => ({
          products: [
            product,
            ...state.products.filter((p) => p.id !== product.id),
          ],
        })),

      clear: () =>
        set({
          products: [],
        }),
    }),
    {
      name: "browsingHistoryStore",
    }
  )
)
