"use client"
import { Separator } from "@workspace/ui/components/separator"
import { CreateCategoryModal } from "./create-category-modal"
import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { useGetCategories } from "@/hooks/categories/use-categories"
import { CategoriesGrid } from "./categories-grid"

export const CategoriesPage = () => {
  const { data } = useGetCategories()
  console.log(data)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Categories ({data?.length})
          </h1>
          <p className="text-muted-foreground">
            Manage your product categories and organize your inventory
          </p>
        </div>
        <CreateCategoryModal
          trigger={
            <Button>
              <PlusCircle />
              Create Category
            </Button>
          }
        />
      </div>
      <Separator className="mt-4" />
      <CategoriesGrid categories={data ?? []} />
    </div>
  )
}
