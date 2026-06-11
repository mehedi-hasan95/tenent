"use client"
import { Separator } from "@workspace/ui/components/separator"
import { CreateCategoryModal } from "./create-category-modal"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useGetCategories } from "@/hooks/categories/use-categories"
import { CategoriesGrid } from "./categories-grid"
import { useState } from "react"
import { categoriesType } from "@workspace/validators/types/categories.types"

export const CategoriesPage = () => {
  const { data } = useGetCategories()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<categoriesType | null>(
    null
  )

  const handleOpenModal = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }
  const handleEditCategory = (category: categoriesType) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }
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
        <Button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 hover:shadow-xl"
        >
          <Plus size={20} />
          Create Category
        </Button>
      </div>
      <Separator className="mt-4" />
      <CategoriesGrid categories={data ?? []} onEdit={handleEditCategory} />
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </div>
  )
}
