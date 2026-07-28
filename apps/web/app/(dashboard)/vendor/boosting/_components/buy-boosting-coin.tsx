import { InputController } from "@/components/form/input-controller"
import { ModalModify } from "@/components/modify/modal-modify"
import { useModalActiveStore } from "@/store/useModalActiveStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { FieldGroup } from "@workspace/ui/components/field"
import { boostingCoin } from "@workspace/validators/validators/boosting-validators"
import { Bitcoin, DollarSign } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { BuyBoostingCoinStripe } from "./buy-boosting-coin-stripe"
import { useCoinStepStore } from "@/store/stripe-store/useCoinStepStore"

interface Props {
  boosting: number
}
export const BuyBoostingCoin = ({ boosting }: Props) => {
  const step = useCoinStepStore((state) => state.step)
  const setStep = useCoinStepStore((state) => state.setStep)
  const { onOpen } = useModalActiveStore()
  const form = useForm<z.input<typeof boostingCoin>>({
    resolver: zodResolver(boostingCoin),
    defaultValues: {
      coin: 1,
    },
  })
  const totalCoin =
    (useWatch({
      control: form.control,
      name: "coin",
    }) as number) ?? 0
  function onSubmit() {
    setStep("checkout")
  }
  return (
    <ModalModify
      title="Buy boost coins"
      trigger={
        <Button variant={"primary"}>
          <Bitcoin />
          Buy Coin
        </Button>
      }
      className="max-w-2xl!"
    >
      {step === "form" ? (
        <>
          <div className="border-b border-slate-800 p-6">
            <p className="mt-2 text-sm text-slate-400">
              Exchange Rate:
              <span className="ml-2 rounded bg-indigo-500/20 px-2 py-1 text-indigo-300">
                {boosting} Coins = $1
              </span>
            </p>
          </div>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <InputController
                control={form.control}
                name="coin"
                inputTypes="number"
                placeholder="10"
                title="Boosting Price"
              />
            </FieldGroup>
            <div className="mt-5 flex items-center gap-3">
              <Button
                type="reset"
                onClick={() => {
                  setStep("form")
                  onOpen(false)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button variant={"primary"} type="submit" className="flex-1">
                Buy Coin
              </Button>
            </div>
          </form>

          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-400">You Receive</span>

              <span className="flex items-center gap-2">
                <span className="flex items-center text-base font-semibold text-white">
                  <Bitcoin size={16} />
                  {boosting} x <DollarSign size={16} />
                  {totalCoin}
                </span>
                =
                <span className="flex items-center text-2xl font-bold text-indigo-400">
                  <Bitcoin size={24} />
                  {boosting * totalCoin}
                </span>
              </span>
            </div>
          </div>
        </>
      ) : (
        <BuyBoostingCoinStripe coin={totalCoin} />
      )}
    </ModalModify>
  )
}
