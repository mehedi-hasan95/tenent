"use client"

import { useState } from "react"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"

interface ColorSelectorProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  title?: string
}

const defaultColors = [
  "#FFFFFF",
  "#000000",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#22D3EE",
]

const isValidHex = (hex: string) => /^[0-9A-F]{6}$/.test(hex)

export function ColorController<T extends FieldValues>({
  name,
  control,
  title,
}: ColorSelectorProps<T>) {
  const [newColor, setNewColor] = useState("#FFFFFF")
  const [hexInput, setHexInput] = useState("FFFFFF")
  const [customColors, setCustomColors] = useState<string[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: () =>
          hexInput.length === 0 || isValidHex(hexInput)
            ? true
            : "Hex color must be exactly 6 characters",
      }}
      render={({ field, fieldState }) => {
        const selectedColors = (field.value ?? []) as string[]

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`create-product-${name}`}>{title}</FieldLabel>

            <div className="flex flex-wrap items-center gap-3">
              {[...defaultColors, ...customColors].map((color) => {
                const isSelected = selectedColors.includes(color)
                const isLightColor = color === "#FFFFFF"

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        field.onChange(
                          selectedColors.filter((c) => c !== color)
                        )
                      } else {
                        field.onChange([...selectedColors, color])
                      }
                    }}
                    className={cn(
                      "size-7 cursor-pointer rounded-md border-2 transition",
                      isSelected
                        ? "scale-110 border-primary"
                        : "border-transparent",
                      isLightColor && "border-gray-400"
                    )}
                    style={{ backgroundColor: color }}
                  />
                )
              })}

              <button
                type="button"
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-2"
                onClick={() => setShowColorPicker((v) => !v)}
              >
                <Plus size={16} />
              </button>

              {showColorPicker && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setNewColor(value)
                      setHexInput(value.replace("#", ""))
                    }}
                    className="size-10 cursor-pointer border-none p-0"
                  />

                  <input
                    type="text"
                    placeholder="FFFFFF"
                    value={hexInput}
                    onChange={(e) => {
                      const value = e.target.value
                        .toUpperCase()
                        .replace(/[^0-9A-F]/g, "")

                      if (value.length > 6) return

                      setHexInput(value)

                      if (value.length === 6) {
                        setNewColor(`#${value}`)
                      }
                    }}
                    className="w-24 rounded border px-2 py-1 text-sm"
                  />

                  <Button
                    type="button"
                    disabled={!isValidHex(hexInput)}
                    onClick={() => {
                      const colorToAdd = `#${hexInput}`

                      setCustomColors((prev) =>
                        prev.includes(colorToAdd) ? prev : [...prev, colorToAdd]
                      )

                      if (!selectedColors.includes(colorToAdd)) {
                        field.onChange([...selectedColors, colorToAdd])
                      }

                      setNewColor("#FFFFFF")
                      setHexInput("FFFFFF")
                      setShowColorPicker(false)
                    }}
                    className="cursor-pointer px-3 py-1 text-sm"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
