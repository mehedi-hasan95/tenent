import { subCategoriesType } from "@workspace/validators/types/categories.types"
import { subCategoriesValidators } from "@workspace/validators/validators/categories-validators"
import z from "zod"

export const createSubCategoryAction = async (
  data: z.input<typeof subCategoriesValidators>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/create-sub-category`,
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

export const updateSubCategoryAction = async (
  data: z.input<typeof subCategoriesValidators> & { id: string }
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/update-sub-category`,
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

export const getSubCategoriesAction = async (type?: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/get-sub-categories`
  )

  if (type) {
    url.searchParams.set("type", type)
  }

  const response = await fetch(url.toString(), {
    method: "GET",
  })

  if (!response.ok) {
    throw await response.json()
  }

  const data: { data: subCategoriesType[] } = await response.json()
  return data.data
}

export const getSubCategoryAction = async (slug: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/get-sub-category`
  )

  url.searchParams.set("slug", slug)

  const response = await fetch(url.toString(), {
    method: "GET",
  })

  if (!response.ok) {
    throw await response.json()
  }

  const data: { data: subCategoriesType | undefined } = await response.json()
  return data.data
}

export const trashingSubCategoryAction = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/trash-sub-category`,
    {
      method: "PATCH",
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

export const restoreSubCategoryAction = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/restore-sub-category`,
    {
      method: "PATCH",
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

export const deleteSubCategoryAction = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/sub-categories/delete-sub-category`,
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
