"use client"

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { ComboboxModify } from "../modify/combobox-modify"

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  placeholder?: string
  className?: string
  options: { label: string; value: string }[]
  disabled?: boolean
}
export const ComboboxController = <T extends FieldValues>({
  options,
  name,
  control,
  title,
  placeholder,
  className,
  disabled,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{title}</FieldLabel>
          <ComboboxModify
            options={options}
            placeholder={placeholder}
            value={field.value}
            onChange={field.onChange}
            className={className}
            disabled={disabled}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
