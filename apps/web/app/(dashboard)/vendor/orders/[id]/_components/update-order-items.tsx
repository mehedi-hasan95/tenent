"use client"

import { updateOrderItemsAction } from "@/api/reports/vendor/vendor-report-action"
import { LoadingButton } from "@/components/common/loading-button"
import { ComboboxController } from "@/components/form/combobox-controller"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { FieldGroup } from "@workspace/ui/components/field"
import { ORDER_STATUS_TYPE } from "@workspace/validators/types/orders.types"
import { updateOrderItemsValidator } from "@workspace/validators/validators/order-validators"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

interface Props {
  id: string
  status: string
}
export const UpdateOrderItems = ({ id, status }: Props) => {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: updateOrderItemsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-single-order", id] })
      queryClient.invalidateQueries({ queryKey: ["vendor-all-products"] })
      toast.success("Product update successfully")
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong")
    },
  })
  const form = useForm<z.infer<typeof updateOrderItemsValidator>>({
    resolver: zodResolver(updateOrderItemsValidator),
    defaultValues: {
      id,
      status: status as ORDER_STATUS_TYPE,
    },
  })
  function onSubmit(data: z.infer<typeof updateOrderItemsValidator>) {
    mutate(data)
  }
  return (
    <div>
      <h2 className="text-2xl font-bold text-muted-foreground">
        Update delivery status
      </h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <ComboboxController
            control={form.control}
            name="status"
            options={[
              { label: "Processing", value: "PROCESSING" },
              { label: "Shipped", value: "SHIPPED" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
              { label: "Refunded", value: "REFUNDED" },
            ]}
          />
        </FieldGroup>
        {isPending ? (
          <LoadingButton />
        ) : (
          <Button className="mt-5" variant={"primary"}>
            Update
          </Button>
        )}
      </form>
    </div>
  )
}
