export type productZustandType = {
  id: string
  image: string
  title: string
  price: number
  category: string
  rating: number
  totalRatings: number
}
export type zustandProductsArray = {
  products: productZustandType[]
}

export const zustandProductsInitialState: zustandProductsArray = {
  products: [],
}
