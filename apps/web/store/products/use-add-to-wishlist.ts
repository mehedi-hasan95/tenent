import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  productZustandType,
  zustandProductsInitialState,
} from "./products-constants"

interface WishlistStore {
  products: productZustandType[]

  addItem: (product: productZustandType) => void
  removeItem: (id: string) => void
  toggleItem: (product: productZustandType) => void
  clear: () => void
}

export const useAddToWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ...zustandProductsInitialState,

      addItem: (product) => {
        const products = get().products

        set({
          products: [product, ...products.filter((p) => p.id !== product.id)],
        })
      },

      removeItem: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id),
        })
      },

      toggleItem: (product) => {
        const products = get().products

        const exists = products.some((p) => p.id === product.id)

        set({
          products: exists
            ? products.filter((p) => p.id !== product.id)
            : [product, ...products],
        })
      },

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
