"use client"

import { DialogModify } from "@/components/modify/dialog-modify"
import { useForm } from "react-hook-form"
import z from "zod"
import { productBoostingValidator } from "@workspace/validators/validators/boosting-validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { InputController } from "@/components/form/input-controller"
import { Button } from "@workspace/ui/components/button"
import { useGetVendorAllProducts } from "@/hooks/products/use-products"
import { Input } from "@workspace/ui/components/input"
import { SelectController } from "@/components/form/select-controller"
import { DateController } from "@/components/form/date-controller"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productBoostingAction } from "@/api/boosting/boosting-action"
import { toast } from "sonner"
import { useDialogActiveStore } from "@/store/useModalActiveStore"
import { LoadingButton } from "@/components/common/loading-button"
import { ChartSpline } from "lucide-react"
import {
  CACHE_VENDOR_AVAILABLE_BOOSTING_COIN,
  CACHE_VENDOR_BOOSTED_PRODUCTS,
} from "@/lib/query-cache"

export const BoostedProductForm = () => {
  const { onOpen } = useDialogActiveStore()
  const { data, isLoading } = useGetVendorAllProducts()
  const form = useForm<z.input<typeof productBoostingValidator>>({
    resolver: zodResolver(productBoostingValidator),
    defaultValues: {
      coins: "",
      productId: "",
      endAt: new Date(),
    },
  })

  const queryClient = useQueryClient()
  const { mutate, isPending: loading } = useMutation({
    mutationFn: productBoostingAction,
    onSuccess: () => {
      toast.success("Product boosted successfully")
      onOpen(false)
      queryClient.invalidateQueries({
        queryKey: CACHE_VENDOR_AVAILABLE_BOOSTING_COIN,
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_VENDOR_BOOSTED_PRODUCTS,
      })
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong")
    },
  })
  function onSubmit(data: z.input<typeof productBoostingValidator>) {
    mutate(data)
  }
  return (
    <DialogModify
      trigger={
        <Button variant={"primary"} className="w-full">
          Create Boosting
        </Button>
      }
    >
      <ScrollArea className="max-h-[70vh]">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {isLoading ? (
              <Input disabled />
            ) : (
              <SelectController
                control={form.control}
                name="productId"
                title="Select Product"
                placeholder="Select product"
                options={
                  data?.map((item) => ({
                    label: item.title,
                    value: item.id,
                  })) ?? []
                }
              />
            )}
            <InputController
              control={form.control}
              name="coins"
              title="Coin Spent"
              inputTypes="number"
              placeholder="20"
            />
            <DateController
              control={form.control}
              name="endAt"
              title="Select boost end date"
              disabled={{ before: new Date() }}
            />
          </FieldGroup>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            {loading ? (
              <LoadingButton />
            ) : (
              <Button type="submit" variant={"primary"}>
                <ChartSpline /> Boost
              </Button>
            )}
          </Field>
        </form>
      </ScrollArea>
    </DialogModify>
  )
}
