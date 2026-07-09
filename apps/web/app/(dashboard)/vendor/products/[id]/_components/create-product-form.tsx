"use client"

import { getSubCategoriesAction } from "@/api/categories/subcategories-action"
import { ComboboxController } from "@/components/form/combobox-controller"
import { ImageUploadController } from "@/components/form/image-upload-controller"
import { InputController } from "@/components/form/input-controller"
import { TagsController } from "@/components/form/tags-controller"
import { TextareaController } from "@/components/form/textarea-controller"
import { useGetCategories } from "@/hooks/categories/use-categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
import { ArrayPath, useForm, useWatch } from "react-hook-form"
import z from "zod"
import { ColorController } from "@/components/form/color-controller"
import { SizeController } from "@/components/form/size-controller"
import { TextEditorController } from "@/components/form/text-editor-controller"
import { SwitchController } from "@/components/form/switch-controller"
import { SelectController } from "@/components/form/select-controller"
import {
  DELIVERY_ENUM,
  PRODUCTS_STATUS_ENUM,
} from "@workspace/validators/types/constants.types"
import { ImagePreviewController } from "@/components/form/image-preview-controller"
import {
  createProductAction,
  updateProductAction,
} from "@/api/products/seller-products-action"
import { SpecificationController } from "@/components/form/specification-controller"
import { useGetSingleProduct } from "@/hooks/products/use-products"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoadingButton } from "@/components/common/loading-button"
import {
  CACHE_ALL_PRODUCTS_KEYS,
  CACHE_SELLER_PRODUCTS_KEYS,
} from "@/lib/query-cache"

interface Props {
  id: string
}
export const CreateProductForm = ({ id }: Props) => {
  const { data } = useGetCategories("true")
  const { data: initialData } = useGetSingleProduct({ id })
  const router = useRouter()
  const form = useForm<z.input<typeof productValidator>>({
    resolver: zodResolver(productValidator),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      images: [],
      previousImage: initialData?.images || [],
      categorySlug: initialData?.categorySlug || "",
      subCategorySlug: initialData?.subCategorySlug || "",
      shortDescription: initialData?.shortDescription || "",
      basePrice: initialData?.basePrice || undefined,
      salePrice: initialData?.salePrice || undefined,
      stock: initialData?.stock || undefined,
      weight: initialData?.weight || undefined,
      tags: initialData?.tags || [],
      color: initialData?.color || [],
      specification: initialData?.specification || [],
      description: initialData?.description || "",
      cashOnDelivery: initialData?.cashOnDelivery || false,
      coupon: initialData?.coupon || "",
      type: initialData?.type || "physical",
      status: initialData?.status || "draft",
      sizes: initialData?.sizes || [],
    },
  })
  const selectedCat = useWatch({
    control: form.control,
    name: "categorySlug",
  })
  const prevImg = useWatch({
    control: form.control,
    name: "previousImage",
  }) as string[] | undefined
  const prevCategory = useRef(selectedCat)

  useEffect(() => {
    if (prevCategory.current && prevCategory.current !== selectedCat) {
      form.setValue("subCategorySlug", "")
    }
    prevCategory.current = selectedCat
  }, [selectedCat, form])
  const { data: subCat } = useQuery({
    queryKey: ["sub-categories", "true", selectedCat],
    queryFn: () => getSubCategoriesAction("true", selectedCat),
    enabled: !!selectedCat,
  })

  const createMutation = useMutation({
    mutationFn: createProductAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_ALL_PRODUCTS_KEYS() })
      queryClient.invalidateQueries({ queryKey: CACHE_SELLER_PRODUCTS_KEYS })
      toast.success("Product create successfully")
      router.push("/vendor/products/")
    },
    onError: (error) => {
      toast.error(error?.message ?? "Something went wrong")
    },
  })

  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: updateProductAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_ALL_PRODUCTS_KEYS() })
      queryClient.invalidateQueries({ queryKey: ["products", initialData?.id] })
      queryClient.invalidateQueries({ queryKey: CACHE_SELLER_PRODUCTS_KEYS })
      toast.success("Product create successfully")
      router.push("/vendor/products/")
    },
    onError: (error) => {
      toast.error(error?.message ?? "Something went wrong")
    },
  })
  function onSubmit(data: z.input<typeof productValidator>) {
    if (initialData) {
      updateMutation.mutate({ ...data, id })
    } else {
      createMutation.mutate(data)
    }
  }

  const title = initialData ? "Update Product" : "Create Product"
  const desc = initialData
    ? "Add a new product to the catalog by entering relevant information."
    : "Modify the existing product's  to keep it accurate and up to date."
  const btnText = initialData ? "Update Product" : "Create Product"
  return (
    <Card className="w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-product-form"
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
            {Boolean(form.getValues("previousImage")) && (
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
              name={
                "specification" as unknown as ArrayPath<
                  z.input<typeof productValidator>
                >
              }
              title="Specification"
            />
            <ComboboxController
              control={form.control}
              name="status"
              options={PRODUCTS_STATUS_ENUM.map((item) => ({
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
          {createMutation.isPending || updateMutation.isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit" form="create-product-form">
              {btnText}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  )
}
