import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ProductType = {
  id: string
  image: string
  title: string
  price: number
  category: string
  rating: number
  totalRatings: number
  quantity: number
  usedCoupon: boolean
  size: string | null
  color: string | null
}

type AddToCartStore = {
  products: ProductType[]

  addItem: (product: ProductType) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
}

export const useAddToCartStore = create<AddToCartStore>()(
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

      removeItem: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, quantity } : p
          ),
        })),

      clear: () =>
        set({
          products: [],
        }),
    }),
    {
      name: "addToCartStore",
    }
  )
)
