import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"
import { Switch } from "@workspace/ui/components/switch"

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  description?: string
  className?: string
  disabled?: boolean
}

export const SwitchController = <T extends FieldValues>({
  name,
  control,
  title,
  description,
  className,
  disabled,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldLabel htmlFor={name}>
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldTitle>{title}</FieldTitle>
              <FieldDescription>{description}</FieldDescription>
            </FieldContent>
            <Switch
              {...field}
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(className)}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        </FieldLabel>
      )}
    />
  )
}
