"use client"

import { getSubCategoriesAction } from "@/api/categories/subcategories-action"
import { ComboboxController } from "@/components/form/combobox-controller"
import { ImageUploadController } from "@/components/form/image-upload-controller"
import { InputController } from "@/components/form/input-controller"
import { TagsController } from "@/components/form/tags-controller"
import { TextareaController } from "@/components/form/textarea-controller"
import { useGetCategories } from "@/hooks/categories/use-categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { productValidator } from "@workspace/validators/validators/products-validators"
import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { ColorController } from "../../../../../../components/form/color-controller"
import { SizeController } from "../../../../../../components/form/size-controller"
import { TextEditorController } from "@/components/form/text-editor-controller"
import { SwitchController } from "@/components/form/switch-controller"
import { SelectController } from "@/components/form/select-controller"
import {
  DELIVERY_ENUM,
  STATUS_ENUM,
} from "@workspace/validators/types/constants.types"
import { ImagePreviewController } from "@/components/form/image-preview-controller"
import { SpecificationController } from "@/components/form/specification-controller"

export const CreateProductForm = () => {
  const { data } = useGetCategories("true")

  const form = useForm<z.input<typeof productValidator>>({
    resolver: zodResolver(productValidator),
    mode: "onChange",
    defaultValues: {
      title: "",
      images: [],
      previousImage: [],
      categorySlug: "",
      subCategorySlug: "",
      shortDescription: "",
      basePrice: undefined,
      salePrice: undefined,
      stock: undefined,
      weight: undefined,
      tags: [],
      color: [],
      specification: [],
      description: "",
      cashOnDelivery: false,
      coupon: "",
      type: "physical",
      status: "draft",
      sizes: [],
    },
  })
  const selectedCat = useWatch({
    control: form.control,
    name: "categorySlug",
  })
  const prevImg = useWatch({
    control: form.control,
    name: "previousImage",
  })
  const prevCategory = useRef(selectedCat)

  useEffect(() => {
    if (prevCategory.current && prevCategory.current !== selectedCat) {
      form.setValue("subCategorySlug", "")
    }
    prevCategory.current = selectedCat
  }, [selectedCat, form])
  const { data: subCat } = useQuery({
    queryKey: ["sub-categories", "false", selectedCat],
    queryFn: () => getSubCategoriesAction("false", selectedCat),
    enabled: !!selectedCat,
  })
  function onSubmit(data: z.input<typeof productValidator>) {
    console.log(data)
  }
  return (
    <Card className="w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-rhf-demo"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <InputController
              control={form.control}
              name="title"
              title="Product Title"
              placeholder="e.g. Leather Bag"
            />
            <TextareaController
              control={form.control}
              name="shortDescription"
              title="Product Bio"
              placeholder="e.g. Leather Bag"
            />
            <TextEditorController
              control={form.control}
              name="description"
              title="Description"
              placeholder="Write something..."
            />
          </FieldGroup>

          <FieldGroup>
            {Boolean(form.getValues("previousImage")?.length) && (
              <ImagePreviewController
                mode="multiple"
                control={form.control}
                name="previousImage"
                title="Profile Image"
                urls={prevImg ?? []}
              />
            )}
            <ImageUploadController
              control={form.control}
              mode="multiple"
              name="images"
              maxFiles={5}
              title="Product Image"
              placeholder="Add Image"
            />
          </FieldGroup>
          <FieldGroup>
            <div className="grid gap-3 md:grid-cols-2">
              <ComboboxController
                control={form.control}
                name="categorySlug"
                options={
                  data?.map((item) => ({
                    label: item.name,
                    value: item.slug,
                  })) ?? []
                }
                title="Select a category"
              />
              <ComboboxController
                control={form.control}
                name="subCategorySlug"
                options={
                  subCat?.map((item) => ({
                    label: item.name,
                    value: item.slug,
                  })) ?? []
                }
                title="Select a Sub Category"
              />
            </div>
          </FieldGroup>
          <FieldGroup>
            <div className="grid gap-3 md:grid-cols-2">
              <InputController
                control={form.control}
                name="basePrice"
                title="Initial Price"
                placeholder="$10"
                inputTypes="number"
              />
              <InputController
                control={form.control}
                name="salePrice"
                title="Sale Price"
                placeholder="$8"
                inputTypes="number"
              />
              <InputController
                control={form.control}
                name="coupon"
                title="Coupon Code"
                placeholder="FLAT_10"
              />
              <InputController
                control={form.control}
                name="stock"
                title="Product Stoke"
                placeholder="500"
                inputTypes="number"
              />
              <InputController
                control={form.control}
                name="weight"
                title="Product Weight"
                placeholder="0.6 Pound"
                inputTypes="number"
              />
              <SelectController
                control={form.control}
                name="type"
                options={DELIVERY_ENUM.map((item) => ({
                  label: item,
                  value: item,
                }))}
                title="Delivery type"
              />
              <SwitchController
                control={form.control}
                name="cashOnDelivery"
                title="Cash on Delivery"
              />

              <TagsController
                control={form.control}
                name="tags"
                title="Tags"
                placeholder="e.g. Organic"
              />

              <ColorController
                control={form.control}
                name="color"
                title="Select Colors"
              />
              <SizeController
                control={form.control}
                name="sizes"
                title="Select Sizes"
              />
            </div>
          </FieldGroup>
          <FieldGroup>
            <SpecificationController
              control={form.control}
              name="specification"
              title="Specification"
            />
            <ComboboxController
              control={form.control}
              name="status"
              options={STATUS_ENUM.map((item) => ({
                label: item,
                value: item,
              }))}
              title="Product Status"
              placeholder="Select Status"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
