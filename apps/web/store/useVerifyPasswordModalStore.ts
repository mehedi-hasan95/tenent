import { create } from "zustand"

type ToggleStore = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export const useIsProfileEditableStore = create<ToggleStore>((set) => ({
  isOpen: false,

  setIsOpen: (value) =>
    set({
      isOpen: value,
    }),
}))
