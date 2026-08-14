"use client"

import { createRatingAction } from "@/api/reports/user/user-report-action"
import { DialogModify } from "@/components/modify/dialog-modify"
import { useCreateRatingStore } from "@/store/products/use-create-ratting-store"
import { useDialogActiveStore } from "@/store/useModalActiveStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { ratingsValidator } from "@workspace/validators/validators/order-validators"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { useShallow } from "zustand/react/shallow"
import { TextareaController } from "@/components/form/textarea-controller"
import { Button } from "@workspace/ui/components/button"
import { useEffect } from "react"
import { LoadingButton } from "@/components/common/loading-button"
import { StarRatingForm } from "./star-rating-form"

export const ProductRatingModal = () => {
  const { onOpen, open } = useDialogActiveStore(
    useShallow((state) => ({
      open: state.open,
      onOpen: state.onOpen,
    }))
  )
  const { clear, data: getRating } = useCreateRatingStore(
    useShallow((state) => ({ clear: state.clear, data: state.data }))
  )
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: createRatingAction,
    onSuccess: () => {
      toast.success("Rating and reviews add successfully")
      onOpen(false)
      clear()
      queryClient.invalidateQueries({ queryKey: ["user-ratings"] })
    },
    onError: (error) => {
      toast.error(error.message)
      onOpen(false)
      clear()
    },
  })

  const form = useForm<z.input<typeof ratingsValidator>>({
    resolver: zodResolver(ratingsValidator),
    defaultValues: {
      orderId: "",
      productId: "",
      rating: undefined,
      reviews: "",
    },
  })
  useEffect(() => {
    if (getRating) {
      form.reset({
        orderId: getRating.orderId,
        productId: getRating.productId,
        rating: undefined,
        reviews: "",
      })
    }
  }, [getRating, form])
  function onSubmit(data: z.input<typeof ratingsValidator>) {
    mutate(data)
  }
  return (
    <>
      {open && (
        <DialogModify
          title="Write your Review"
          trigger={<div />}
          description={getRating?.title}
        >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="rating"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rating">Rating</FieldLabel>
                    <StarRatingForm
                      rating={field.value as number}
                      onRatingChange={field.onChange}
                      disabled={isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <TextareaController
                control={form.control}
                name="reviews"
                disabled={isPending}
                title="Write your review"
                placeholder="Your review...."
              />
            </FieldGroup>
            <Field orientation="horizontal" className="mt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              {isPending ? (
                <LoadingButton />
              ) : (
                <Button type="submit" variant={"primary"}>
                  Submit
                </Button>
              )}
            </Field>
          </form>
        </DialogModify>
      )}
    </>
  )
}
