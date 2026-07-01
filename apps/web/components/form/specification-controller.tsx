"use client"

import {
  ArrayPath,
  Control,
  Controller,
  FieldValues,
  Path,
  useFieldArray,
} from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Button } from "@workspace/ui/components/button"
import { PlusCircle, XIcon } from "lucide-react"

interface Props<T extends FieldValues> {
  name: ArrayPath<T>
  control: Control<T>
  title?: string
  keyPlaceholder?: string
  valuePlaceholder?: string
  maxFields?: number
}

export const SpecificationController = <T extends FieldValues>({
  name,
  control,
  title = "Custom Specification (optional)",
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  maxFields = 5,
}: Props<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <FieldSet className="gap-4">
      <FieldLegend variant="label">{title}</FieldLegend>
      <FieldGroup className="gap-4">
        {fields.map((field, index) => (
          <div className="flex gap-2" key={field.id}>
            <Controller
              name={`${name}.${index}.key` as Path<T>}
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        {...controllerField}
                        id={`${name}-key-${index}`}
                        aria-invalid={fieldState.invalid}
                        placeholder={keyPlaceholder}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name={`${name}.${index}.value` as Path<T>}
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        {...controllerField}
                        id={`${name}-value-${index}`}
                        aria-invalid={fieldState.invalid}
                        placeholder={valuePlaceholder}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            {fields.length > 1 && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => remove(index)}
                  aria-label={`Remove specification ${index + 1}`}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ key: "", value: "" } as never)}
          disabled={fields.length >= maxFields}
        >
          <PlusCircle /> Add Specification
        </Button>
      </FieldGroup>
    </FieldSet>
  )
}
