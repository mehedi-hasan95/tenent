import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ProductType = {
  id: string
  quantity: number
  usedCoupon?: string
  size?: string
  color?: string
}

type AddToCartStore = {
  products: ProductType[]

  addItem: (product: ProductType) => void
  removeItem: (id: string) => void
  updateQuantity: (
    id: string,
    quantity?: number,
    color?: string,
    size?: string,
    usedCoupon?: string
  ) => void
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

      updateQuantity: (id, quantity, color, size, usedCoupon) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...(quantity !== undefined && { quantity }),
                  ...(color !== undefined && { color }),
                  ...(size !== undefined && { size }),
                  ...(usedCoupon !== undefined && { usedCoupon }),
                }
              : p
          ),
        })),

      clear: () => set({ products: [] }),
    }),
    {
      name: "addToCartStore",
    }
  )
)
