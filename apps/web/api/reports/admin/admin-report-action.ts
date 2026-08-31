import { getUserType } from "@workspace/validators/types/auth.types"
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
  startEndDateValidator,
} from "@workspace/validators/validators/order-validators"
import z from "zod"

export const adminReportsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/total-revenue`,
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

export const adminAllOrdersAction = async ({
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
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/all-orders?${params.toString()}`,
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

export const adminSingleOrderAction = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/single-order/${id}`,
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

export const adminCountryBasedReportAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/country-based`,
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

export const adminYearlyReportsAction = async (
  param: z.input<typeof startEndDateValidator>
) => {
  const params = new URLSearchParams()

  Object.entries(param).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/previous-year-reports?${params.toString()}`,
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

export const adminDailyReportsAction = async (
  param: z.input<typeof startEndDateValidator>
) => {
  const params = new URLSearchParams()

  Object.entries(param).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/daily-reports?${params.toString()}`,
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

export const adminPopularProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/popular-products`,
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

export const adminProductsCatsCountAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/count-constants`,
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
    product: number
    cat: number
    subCat: number
    users: number
  } = await response.json()
  return data
}

export const adminAllUsersAction = async ({
  limit = DEFAULT_SIZE,
  page = 1,
}: {
  limit: number
  page: number
}) => {
  const params = new URLSearchParams()

  Object.entries({ limit, page }).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/reports/all-users?${params.toString()}`,
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
    data: getUserType[]
    pagination: PAGINATION_TYPES
  } = await response.json()
  return data
}
