import {
  DEFAULT_SIZE,
  PAGINATION_TYPES,
} from "@workspace/validators/types/constants.types"
import {
  ORDER_ITEMS_TYPE,
  ORDER_TYPE,
  RATING_TYPE,
} from "@workspace/validators/types/orders.types"
import { ratingsValidator } from "@workspace/validators/validators/order-validators"
import z from "zod"

export const allOrdersAction = async ({
  limit = DEFAULT_SIZE,
  page = 1,
}: {
  limit: number
  page: number
}) => {
  const params = new URLSearchParams()

  //   ?? only works this sort hand for string, number, boolean
  Object.entries({ limit, page }).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/user/reports/user-all-orders?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!response.ok) {
    throw await response.json()
  }

  const data: {
    data: {
      orderItems: ORDER_ITEMS_TYPE
      orders: ORDER_TYPE
      products: { title: string; images: string[] }
    }[]
    pagination: PAGINATION_TYPES
  } = await response.json()
  return data
}

export const singleOrderAction = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/user/reports/orders/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data:
      | {
          orderItems: ORDER_ITEMS_TYPE
          orders: ORDER_TYPE
          products: { title: string; images: string[] }
        }
      | undefined
  } = await response.json()
  return data.data
}

export const createRatingAction = async (
  data: z.input<typeof ratingsValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/user/reports/add-rating`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const userAllRatingsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/user/reports/all-ratings`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: {
      ratings: RATING_TYPE
      product: {
        title: string
        image: string[]
      }
    }[]
  } = await response.json()
  return data.data
}
