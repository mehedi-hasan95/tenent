"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@workspace/ui/components/combobox"

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  id?: string
  placeholder?: string
  className?: string
}

export const ComboboxModify = ({
  onChange,
  options,
  disabled,
  id,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const selectedOption = options.find((opt) => opt.value === value) ?? null

  return (
    <Combobox
      items={options}
      value={selectedOption}
      onValueChange={(opt) => {
        onChange?.(opt?.value ?? "")
      }}
      itemToStringValue={(opt) => opt.label}
      disabled={disabled}
    >
      <ComboboxInput id={id} placeholder={placeholder} className={className} />

      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>

        <ComboboxList>
          {(option) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
