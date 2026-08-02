import { create } from "zustand"
import { persist } from "zustand/middleware"

type productType = {
  id: string
  image: string
  title: string
  price: number
  category: string
  rating: number
  totalRatings: number
  quantity: number
}
type zustandArray = {
  products: productType[]
}

const zustandProductsInitialState: zustandArray = {
  products: [],
}

export const addToCartStore = create<zustandArray>()(
  persist(() => zustandProductsInitialState, {
    name: "addToCartStore",
  })
)

export const useAddToCartStore = () => {
  const { products } = addToCartStore()
  return {
    products,
    addItem: (product: productType) => {
      const filteredProducts = products.filter((p) => p.id !== product.id)
      addToCartStore.setState({
        products: [product, ...filteredProducts],
      })
    },
    removeItem: (id: { id: string }) => {
      const updatedProducts = products.filter((p) => p.id !== id.id)
      addToCartStore.setState({
        products: updatedProducts,
      })
    },
    updateQuantity: (product: { id: string; quantity: number }) => {
      addToCartStore.setState({
        products: products.map((p) =>
          p.id === product.id ? { ...p, quantity: product.quantity } : p
        ),
      })
    },
    clear: () => {
      addToCartStore.setState({
        products: [],
      })
    },
  }
}
