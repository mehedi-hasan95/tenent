import { create } from "zustand"

type Step = "list" | "cart"

const initialState = {
  step: "list" as Step,
}

interface Store {
  step: Step
  setStep: (step: Step) => void
  reset: () => void
}

export const useCheckoutStore = create<Store>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  reset: () => set(initialState),
}))
