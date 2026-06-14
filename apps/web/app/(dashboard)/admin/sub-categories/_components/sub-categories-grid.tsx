"use client"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { subCategoriesType } from "@workspace/validators/types/categories.types"
import { Edit2, Trash2 } from "lucide-react"

interface Props {
  subCategories: subCategoriesType[]
  onEdit: (category: subCategoriesType) => void
  onDelete: (slug: string) => void
}
export const SubCategoriesGrid = ({
  subCategories,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {subCategories.map((cat) => (
        <Card key={cat.id}>
          <CardHeader>
            <CardTitle>Title: {cat.name}</CardTitle>
            <CardDescription>Slug: {cat.slug}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Category: {cat.categorySlug}</p>
          </CardContent>
          <CardFooter>
            <div className="flex gap-3">
              <Button onClick={() => onEdit(cat)} className="flex-1">
                <Edit2 size={16} />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(cat.slug)}
                variant={"destructive"}
                className="flex-1"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
