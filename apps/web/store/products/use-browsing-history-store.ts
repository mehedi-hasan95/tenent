import { create } from "zustand"
import { productZustandType } from "./products-constants"
import { persist } from "zustand/middleware"

type productType = {
  products: productZustandType[]
  addItem: (product: productZustandType) => void
  clear: () => void
}

export const useBrowsingHistoryStore = create<productType>()(
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
