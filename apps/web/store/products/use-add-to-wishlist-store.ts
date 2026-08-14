import { create } from "zustand"
import { persist } from "zustand/middleware"
import { productZustandType } from "./products-constants"

interface WishlistStore {
  products: productZustandType[]

  toggleItem: (product: productZustandType) => void
  clear: () => void
}

export const useAddToWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      products: [],
      toggleItem: (product) =>
        set((state) => {
          const exists = state.products.some((p) => p.id === product.id)

          return {
            products: exists
              ? state.products.filter((p) => p.id !== product.id)
              : [product, ...state.products],
          }
        }),

      clear: () => {
        set({
          products: [],
        })
      },
    }),
    {
      name: "addToWishlistStore",
    }
  )
)
