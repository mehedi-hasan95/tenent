import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  productZustandType,
  zustandProductsArray,
  zustandProductsInitialState,
} from "./products-constants"

export const browsingHistoryStore = create<zustandProductsArray>()(
  persist(() => zustandProductsInitialState, {
    name: "browsingHistoryStore",
  })
)

export default function useBrowsingHistory() {
  const { products } = browsingHistoryStore()
  return {
    products,
    addItem: (product: productZustandType) => {
      const exists = products.some((p) => p.id === product.id)
      if (exists) return
      const updatedProducts = [product, ...products].slice(0, 10)
      browsingHistoryStore.setState({
        products: updatedProducts,
      })
    },

    clear: () => {
      browsingHistoryStore.setState({
        products: [],
      })
    },
  }
}
