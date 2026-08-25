import {
  couponValidator,
  productValidator,
} from "@workspace/validators/validators/products-validators"
import z from "zod"
import {
  PRODUCT_TYPE,
  COUPON_TYPE,
} from "@workspace/validators/types/product.types"

export const createProductAction = async (
  data: z.input<typeof productValidator>
) => {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === "images") {
      ;(value as File[]).forEach((file) => fd.append("images", file))
    } else if (key === "specification") {
      fd.append(key, JSON.stringify(value))
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)))
    } else {
      fd.append(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/create-product`,
    {
      method: "POST",

      body: fd,
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const updateProductAction = async (
  data: z.input<typeof productValidator> & { id: string }
) => {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === "images") {
      ;(value as File[]).forEach((file) => fd.append("images", file))
    } else if (key === "specification") {
      fd.append(key, JSON.stringify(value))
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)))
    } else {
      fd.append(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/update-product`,
    {
      method: "PATCH",

      body: fd,
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const trashedProductAction = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/trash-product`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const allTrashedProductAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/all-trashed-products`,
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
  const data: { data: PRODUCT_TYPE[] } = await response.json()
  return data.data
}

export const restoreProductAction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/restore-products`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const deleteSelectedProductsAction = async (id: string[]) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/delete-many-products`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const deleteAllProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/delete-trashed-products`,
    {
      method: "DELETE",
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
  return response.json()
}

export const deleteSingleProductsAction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/delete-single-product`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const sellerAllProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/seller-all-product`,
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
  const data: { data: PRODUCT_TYPE[] } = await response.json()
  return data.data
}

/**
 * Coupon part start here
 */
export const createCouponAction = async (
  data: z.input<typeof couponValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/create-coupon`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const updateCouponAction = async (
  data: z.input<typeof couponValidator> & { id: string }
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/update-coupon`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const allCouponAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/get-all-coupon`,
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
    data: (COUPON_TYPE & {
      title: string
      image: string[]
    })[]
  } = await response.json()
  return data.data
}

export const singleCouponAction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/get-coupon/${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: COUPON_TYPE | undefined
  } = await response.json()
  return data.data
}
