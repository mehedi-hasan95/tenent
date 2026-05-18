import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { JSX } from "react"

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  placeholder?: string
  inputTypes?: "text" | "password" | "email" | "number"
  className?: string
  otherLink?: JSX.Element
}

export const InputController = <T extends FieldValues>({
  name,
  control,
  title,
  placeholder,
  inputTypes = "text",
  className,
  otherLink,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center">
            <FieldLabel htmlFor={name}>{title}</FieldLabel>
            {otherLink}
          </div>
          <Input
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            type={inputTypes}
            className={cn("", className)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
