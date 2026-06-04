import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  description?: string
  label?: string
  disabled?: boolean
}

export const CheckboxController = <T extends FieldValues>({
  name,
  control,
  title,
  description,
  label = "Accept terms and conditions",
  disabled,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          {title ||
            (description && (
              <FieldContent>
                <FieldLabel htmlFor={name}>{title}</FieldLabel>
                <FieldDescription>{description}</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            ))}
          <Checkbox
            id={name}
            name={field.name}
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
          />
          <Label htmlFor={name}>{label}</Label>
        </Field>
      )}
    />
  )
}
