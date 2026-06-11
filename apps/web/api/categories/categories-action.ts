import { categoriesType } from "@workspace/validators/types/categories.types"
import { categoriesValidators } from "@workspace/validators/validators/categories-validators"
import z from "zod"

export const createCategoryAction = async (
  data: z.input<typeof categoriesValidators>
) => {
  const formData = new FormData()
  const { name, slug, image } = data
  Object.entries({ name, slug }).forEach(([k, v]) => v && formData.append(k, v))
  if (image instanceof File) formData.append("image", image)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/categories/create-category`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const updateCategoryAction = async (
  data: z.input<typeof categoriesValidators> & { id: string }
) => {
  const formData = new FormData()
  const { name, slug, image, previousImage, id } = data
  Object.entries({ name, slug, previousImage, id }).forEach(
    ([k, v]) => v && formData.append(k, v)
  )
  if (image instanceof File) formData.append("image", image)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/categories/update-category`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const getCategoriesAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/categories/get-categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: { data: categoriesType[] } = await response.json()
  return data.data
}

export const getCategoryAction = async (slug: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/categories/get-category`
  )

  url.searchParams.set("slug", slug)

  const response = await fetch(url.toString(), {
    method: "GET",
  })

  if (!response.ok) {
    throw await response.json()
  }

  const data: { data: categoriesType | undefined } = await response.json()
  return data.data
}

export const deleteCategoryAction = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/categories/delete-category`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ slug }),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}
