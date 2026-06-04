import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { ImageUploader } from "./image-uploader"

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface SingleProps<T extends FieldValues> extends BaseProps<T> {
  mode: "single"
}

interface MultipleProps<T extends FieldValues> extends BaseProps<T> {
  mode?: "multiple"
  maxFiles?: number
}

type Props<T extends FieldValues> = SingleProps<T> | MultipleProps<T>

// ─── Component ────────────────────────────────────────────────────────────────

export const ImageUploadController = <T extends FieldValues>({
  name,
  control,
  title,
  placeholder,
  className,
  disabled,
  ...rest
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {title && (
            <div className="flex items-center">
              <FieldLabel htmlFor={name}>{title}</FieldLabel>
            </div>
          )}

          {rest.mode === "single" ? (
            <ImageUploader
              mode="single"
              value={field.value as File | null}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={className}
              disabled={disabled}
            />
          ) : (
            <ImageUploader
              mode="multiple"
              maxFiles={(rest as MultipleProps<T>).maxFiles}
              value={field.value as File[]}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={className}
              disabled={disabled}
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
