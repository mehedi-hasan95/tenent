"use client"

import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
})

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const TextEditorController = <T extends FieldValues>({
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
          {title && <FieldLabel htmlFor={name}>{title}</FieldLabel>}

          <ReactQuill
            id={name}
            theme="snow"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            readOnly={disabled}
            placeholder={placeholder}
            className={cn(
              "[&_.ql-editor]:h-24! [&_.ql-editor]:md:h-40! [&_.ql-editor]:lg:h-64! [&_.ql-editor_p]:text-sm! [&_.ql-editor.ql-blank::before]:text-muted-foreground!",
              className
            )}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
