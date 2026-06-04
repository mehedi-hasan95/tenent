import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  className?: string
  disabled?: boolean
  mode?: "single" | "multiple"
}

interface SingleProps<T extends FieldValues> extends BaseProps<T> {
  mode: "single"
  url: string | null
}

interface MultipleProps<T extends FieldValues> extends BaseProps<T> {
  mode?: "multiple"
  urls: string[] | null
}

type Props<T extends FieldValues> = SingleProps<T> | MultipleProps<T>

// ─── Component ────────────────────────────────────────────────────────────────

export const ImagePreviewController = <T extends FieldValues>({
  name,
  control,
  title,
  className,
  disabled,
  ...rest
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleRemoveSingle = () => {
          field.onChange(undefined)
        }

        const handleRemoveMultiple = (index: number) => {
          if (rest.mode === "single") return

          const updated = rest.urls?.filter((_, i) => i !== index) ?? []

          field.onChange(updated.length ? updated : undefined)
        }

        return (
          <Field data-invalid={fieldState.invalid}>
            {title && (
              <div className="flex items-center">
                <FieldLabel htmlFor={name}>{title}</FieldLabel>
              </div>
            )}

            {/* ─── Single Mode ─────────────────────────────────────────────── */}
            {rest.mode === "single" ? (
              rest.url ? (
                <div
                  className={cn(
                    "relative h-75 w-75 overflow-hidden rounded-md border",
                    className
                  )}
                >
                  <Image
                    src={rest.url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />

                  <Button
                    disabled={disabled}
                    variant="destructive"
                    type="button"
                    size="icon"
                    onClick={handleRemoveSingle}
                    className="absolute top-2 right-2 z-10"
                  >
                    ✕
                  </Button>
                </div>
              ) : null
            ) : (
              /* ─── Multiple Mode ───────────────────────────────────────── */
              <div
                className={cn(
                  "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
                  className
                )}
              >
                {rest.urls?.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="relative h-50 overflow-hidden rounded-md border"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    <Button
                      disabled={disabled}
                      variant="destructive"
                      type="button"
                      size="icon"
                      onClick={() => handleRemoveMultiple(index)}
                      className="absolute top-2 right-2 z-10"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
