import { create } from "zustand"

type Step = "form" | "checkout"

interface Store {
  step: Step
  setStep: (step: Step) => void
}

export const useCoinStepStore = create<Store>((set) => ({
  step: "form",
  setStep: (step) => set({ step }),
}))
