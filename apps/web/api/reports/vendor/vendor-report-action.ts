import {
  DEFAULT_SIZE,
  PAGINATION_TYPES,
} from "@workspace/validators/types/constants.types"
import {
  ORDER_ITEMS_TYPE,
  ORDER_TYPE,
  POPULAR_PRODUCTS_TYPE,
  VENDER_REPORT_TYPE,
} from "@workspace/validators/types/orders.types"
import {
  updateOrderItemsValidator,
  yearlyReportsValidator,
} from "@workspace/validators/validators/order-validators"
import z from "zod"

export const vendorReportsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/total-revenue`,
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
    revenue: VENDER_REPORT_TYPE
    order: VENDER_REPORT_TYPE
    orderItem: VENDER_REPORT_TYPE
    uniqueUser: VENDER_REPORT_TYPE
  } = await response.json()
  return data
}

export const vendorAllOrdersAction = async ({
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
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/all-orders?${params.toString()}`,
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

export const vendorSingleOrderAction = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/single-order/${id}`,
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

export const updateOrderItemsAction = async (
  data: z.input<typeof updateOrderItemsValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/update-order`,
    {
      method: "PATCH",
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

export const vendorCountryBasedReportAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/country-based`,
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
      country: string | null
      quantity: number
      price: number
    }[]
  } = await response.json()
  return data.data
}

export const vendorYearlyReportsAction = async (
  param: z.input<typeof yearlyReportsValidator>
) => {
  const params = new URLSearchParams()

  Object.entries(param).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/previous-year-reports?${params.toString()}`,
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
    data: { month: string; quantity: number; totalSale: number }[]
  } = await response.json()
  return data.data
}

export const vendorDailyReportsAction = async (
  param: z.input<typeof yearlyReportsValidator>
) => {
  const params = new URLSearchParams()

  Object.entries(param).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/daily-reports?${params.toString()}`,
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
    data: { month: string; quantity: number; totalSale: number }[]
  } = await response.json()
  return data.data
}

export const vendorPopularProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/vendor/reports/popular-products`,
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
    data: POPULAR_PRODUCTS_TYPE[]
  } = await response.json()
  return data.data
}
