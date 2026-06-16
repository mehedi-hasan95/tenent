"use client"
import { useGetSubCategories } from "@/hooks/categories/use-subcategory"
import { AdminCategoriesTrashPage } from "./admin-categories-trash-page"
import { AdminSubCategoriesTrashPage } from "./admin-sub-categories-trash-page"
import { useGetCategories } from "@/hooks/categories/use-categories"
import { Trash } from "lucide-react"

export const AdminTrashPage = () => {
  const { data: catData } = useGetCategories("false")
  const { data } = useGetSubCategories("false")
  return (
    <>
      {!catData?.length && !data?.length ? (
        <div className="flex min-h-[90vh] flex-col items-center justify-center space-y-4">
          <Trash className="size-8 md:size-12 lg:size-16" />
          <h2 className="text-xl font-bold md:text-2xl lg:text-4xl">
            Trash is Empty
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          <AdminCategoriesTrashPage data={catData} />
          <AdminSubCategoriesTrashPage data={data} />
        </div>
      )}
    </>
  )
}
