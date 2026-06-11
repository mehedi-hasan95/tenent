import { Button } from "@workspace/ui/components/button"
import { categoriesType } from "@workspace/validators/types/categories.types"
import { Edit2, Trash2 } from "lucide-react"
import Image from "next/image"

interface Props {
  categories: categoriesType[]
  onEdit: (category: categoriesType) => void
  onDelete: (slug: string) => void
}
export const CategoriesGrid = ({ categories, onEdit, onDelete }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group overflow-hidden rounded-xl border border-border bg-white shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl dark:bg-slate-800"
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-muted">
            <Image
              src={category?.image || "/placeholder.webp"}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={500}
              width={500}
              sizes=""
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
          </div>

          {/* Content Container */}
          <div className="p-6">
            <h3 className="mb-2 line-clamp-1 text-xl font-bold text-foreground">
              {category.name}
            </h3>

            {/* Count Badge */}
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {20} items
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={() => onEdit(category)} className="flex-1">
                <Edit2 size={16} />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(category.slug)}
                variant={"destructive"}
                className="flex-1"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
