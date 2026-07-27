"use client"

import {
  allBoostingCoinAction,
  createBoostingCoinAction,
  setActiveBoostingCoinAction,
} from "@/api/boosting-coin/boosting-coin-action"
import { InputController } from "@/components/form/input-controller"
import { ModalModify } from "@/components/modify/modal-modify"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { boostingCoin } from "@workspace/validators/validators/boosting-validators"
import { FieldGroup } from "@workspace/ui/components/field"
import { useForm } from "react-hook-form"
import z from "zod"
import { AlertDialogCancel } from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { CACHE_BOOSTING_COIN_KEYS } from "@/lib/query-cache"
import { BOOSTING_COIN_TYPE } from "@workspace/validators/types/boosting.types"
import { useModalActiveStore } from "@/store/useModalActiveStore"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"
import { Separator } from "@workspace/ui/components/separator"

// Adjust this to match your actual item shape from allBoostingCoinAction
// type BoostingCoinItem = {
//   id: string
//   coin: number
//   is_active: boolean
// }

const Page = () => {
  const { onOpen } = useModalActiveStore()
  const { data } = useQuery({
    queryKey: CACHE_BOOSTING_COIN_KEYS,
    queryFn: allBoostingCoinAction,
  })

  const form = useForm<z.input<typeof boostingCoin>>({
    resolver: zodResolver(boostingCoin),
    defaultValues: {
      coin: undefined,
    },
  })

  const queryClient = useQueryClient()

  // ---- CREATE (optimistic insert) ----
  const createMutation = useMutation({
    mutationFn: createBoostingCoinAction,
    onMutate: async (newCoin: number) => {
      await queryClient.cancelQueries({ queryKey: CACHE_BOOSTING_COIN_KEYS })

      const previousData = queryClient.getQueryData<BOOSTING_COIN_TYPE[]>(
        CACHE_BOOSTING_COIN_KEYS
      )

      const optimisticItem: BOOSTING_COIN_TYPE = {
        id: `optimistic-${Date.now()}`,
        coin: newCoin,
        is_active: false,
        createdAt: new Date(),
      }

      queryClient.setQueryData<BOOSTING_COIN_TYPE[]>(
        CACHE_BOOSTING_COIN_KEYS,
        (old) => (old ? [...old, optimisticItem] : [optimisticItem])
      )

      form.reset()
      onOpen(false)
      toast.success("Boosting coin created 😊😊😊")
      return { previousData }
    },
    onError: (error, _newCoin, context) => {
      console.log("error: ", error)
      if (context?.previousData) {
        queryClient.setQueryData(CACHE_BOOSTING_COIN_KEYS, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_BOOSTING_COIN_KEYS })
    },
  })

  function onSubmit(data: z.input<typeof boostingCoin>) {
    createMutation.mutate(data.coin as number)
  }

  // ---- SET ACTIVE (optimistic toggle) ----
  const setActiveMutation = useMutation({
    mutationFn: setActiveBoostingCoinAction,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: CACHE_BOOSTING_COIN_KEYS })

      const previousData = queryClient.getQueryData<BOOSTING_COIN_TYPE[]>(
        CACHE_BOOSTING_COIN_KEYS
      )

      queryClient.setQueryData<BOOSTING_COIN_TYPE[]>(
        CACHE_BOOSTING_COIN_KEYS,
        (old) =>
          old?.map((item) => ({
            ...item,
            is_active: item.id === id,
          }))
      )

      toast.success("Coin activated successfully 😊😊😊")
      return { previousData }
    },
    onError: (error, _id, context) => {
      console.log("error: ", error)
      if (context?.previousData) {
        queryClient.setQueryData(CACHE_BOOSTING_COIN_KEYS, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_BOOSTING_COIN_KEYS })
    },
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2>Total Boosting ({data?.length ?? 0})</h2>
        <ModalModify
          trigger={
            <Button variant={"primary"} className="text-white">
              Create Coin
            </Button>
          }
          title="🚀 Boost Coin"
          description="Unlock premium visibility for your content."
        >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <InputController
                control={form.control}
                title="Boosting Coin"
                name="coin"
                placeholder="10"
                inputTypes="number"
              />
            </FieldGroup>
            <div className="-mx-4 mt-5 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </ModalModify>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.map((item) => (
          <Card
            key={item.id}
            onClick={() => setActiveMutation.mutate(item.id)}
            className={cn(
              "flex cursor-pointer items-center border border-muted-foreground bg-transparent",
              item.is_active && "border-orange-500"
            )}
          >
            <CardContent className="flex w-full items-center justify-center gap-2 px-16 py-10 text-2xl font-bold">
              {item.coin}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
