import { categoriesType } from "@workspace/validators/types/categories.types"
import { Edit2, Trash2 } from "lucide-react"
import Image from "next/image"

interface Props {
  categories: categoriesType[]
}
export const CategoriesGrid = ({ categories }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group overflow-hidden rounded-xl border border-border bg-white shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl dark:bg-slate-800"
        >
          {/* Image Container */}
          {category.image && (
            <div className="relative h-48 overflow-hidden bg-muted">
              <Image
                src={category?.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
            </div>
          )}

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
              <button
                // onClick={() => onEdit(category)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                // onClick={() => onDelete(category.id)}
                className="hover:text-destructive-foreground flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 font-medium text-destructive transition-colors hover:bg-destructive"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
