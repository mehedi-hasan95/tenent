"use client"
import {
  createCouponAction,
  singleCouponAction,
  updateCouponAction,
} from "@/api/products/seller-products-action"
import { ComboboxController } from "@/components/form/combobox-controller"
import { DateController } from "@/components/form/date-controller"
import { InputController } from "@/components/form/input-controller"
import { SwitchController } from "@/components/form/switch-controller"
import { useGetVendorAllProducts } from "@/hooks/products/use-products"
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
import { couponValidator } from "@workspace/validators/validators/products-validators"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"
import { COUPON_TYPE } from "@workspace/validators/types/product.types"
import { toast } from "sonner"
import { LoadingButton } from "@/components/common/loading-button"
import { useEffect } from "react"

const Page = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const id = params.id
  const { data } = useGetVendorAllProducts()
  const { data: singleProduct } = useQuery({
    queryKey: ["all-coupon", id],
    queryFn: () => singleCouponAction(id),
  })

  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: createCouponAction,
    onSuccess: () => {
      router.push("/vendor/coupon")
      queryClient.invalidateQueries({ queryKey: ["all-coupon"] })
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong")
    },
  })
  const updateMutation = useMutation({
    mutationFn: updateCouponAction,
    onSuccess: () => {
      router.push("/vendor/coupon")
      queryClient.invalidateQueries({ queryKey: ["all-coupon"] })
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong")
    },
  })

  const form = useForm<z.input<typeof couponValidator>>({
    resolver: zodResolver(couponValidator),
    defaultValues: {
      code: "",
      discountPercent: undefined,
      expiresAt: undefined,
      flatDiscount: undefined,
      isActive: true,
      maxRedemptions: undefined,
      minOrderAmount: undefined,
      productId: undefined,
    },
  })

  useEffect(() => {
    if (singleProduct) {
      form.reset({
        code: singleProduct.code ?? "",
        discountPercent: singleProduct.discountPercent ?? undefined,
        expiresAt: singleProduct.expiresAt
          ? new Date(singleProduct.expiresAt)
          : undefined,
        flatDiscount: singleProduct.flatDiscount ?? undefined,
        isActive: singleProduct.isActive ?? true,
        maxRedemptions: singleProduct.maxRedemptions ?? undefined,
        minOrderAmount: singleProduct.minOrderAmount ?? undefined,
        productId: singleProduct.productId ?? undefined,
      })
    }
  }, [singleProduct, form])

  function onSubmit(data: z.input<typeof couponValidator>) {
    if (singleProduct) {
      updateMutation.mutate({ ...data, id: singleProduct.id })
    } else {
      createMutation.mutate(data)
    }
  }
  return (
    <Card className="mx-auto w-full sm:max-w-3xl">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-5 md:grid-cols-2">
              <ComboboxController
                control={form.control}
                name="productId"
                title="Select a product"
                placeholder="Select Product"
                options={
                  data?.map((item) => ({
                    label: item.title,
                    value: item.id,
                  })) ?? []
                }
              />
              <InputController
                control={form.control}
                name="code"
                title="Coupon Code"
                placeholder="e.g. FLAT10"
              />
              <InputController
                control={form.control}
                name="discountPercent"
                title="Discount Percent (%)"
                placeholder="e.g. 10"
                inputTypes="number"
              />
              <InputController
                control={form.control}
                name="flatDiscount"
                title="Flat Rate"
                placeholder="e.g. 20"
              />
              <InputController
                control={form.control}
                name="maxRedemptions"
                title="Redemptions"
                placeholder="e.g. 20"
                inputTypes="number"
              />
              <InputController
                control={form.control}
                name="minOrderAmount"
                title="Minimum order"
                placeholder="e.g. 20"
                inputTypes="number"
              />
              <SwitchController
                control={form.control}
                name="isActive"
                title="isCoupon Active?"
              />
              <DateController
                control={form.control}
                name="expiresAt"
                title="Expire At"
                disabled={{ before: new Date() }}
              />
            </div>
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
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  )
}

export default Page
