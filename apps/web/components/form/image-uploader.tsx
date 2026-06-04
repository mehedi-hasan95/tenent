"use client"

import React, { useRef, useState, useCallback, useEffect, useMemo } from "react"
import Image from "next/image"
import { CloudUpload, X, Image as Placeholder, AlertCircle } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "single" | "multiple"

// Overloaded prop types so TypeScript enforces the correct onChange signature
// depending on mode.

interface SingleModeProps {
  mode: "single"
  value: File | null | undefined
  onChange: (file: File | null) => void
  onBlur?: () => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

interface MultipleModeProps {
  mode?: "multiple"
  value: File | File[] | null | undefined
  onChange: (files: File[]) => void
  onBlur?: () => void
  disabled?: boolean
  maxFiles?: number
  placeholder?: string
  className?: string
}

type ImageUploadProps = SingleModeProps | MultipleModeProps

// ─── Component ────────────────────────────────────────────────────────────────

export const ImageUploader = (props: ImageUploadProps) => {
  const {
    value: valueProp,
    onChange,
    onBlur,
    disabled,
    placeholder,
    className,
  } = props

  const mode: Mode = props.mode ?? "multiple"
  const maxFiles =
    mode === "single" ? 1 : ((props as MultipleModeProps).maxFiles ?? 10)

  const resolvedPlaceholder =
    placeholder ??
    (mode === "single"
      ? "PNG, JPG, GIF, WEBP — single image only"
      : `PNG, JPG, GIF, WEBP (max ${maxFiles})`)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [limitError, setLimitError] = useState<string | null>(null)

  // Normalise value → always File[]
  const value = useMemo<File[]>(() => {
    if (!valueProp) return []
    if (Array.isArray(valueProp)) return valueProp
    if (valueProp instanceof File) return [valueProp]
    return []
  }, [valueProp])

  const isAtLimit = value.length >= maxFiles
  const fillPct = Math.round((value.length / maxFiles) * 100)

  // ── emit helpers ──────────────────────────────────────────────────────────

  const emit = useCallback(
    (next: File[]) => {
      if (mode === "single") {
        ;(onChange as SingleModeProps["onChange"])(next[0] ?? null)
      } else {
        ;(onChange as MultipleModeProps["onChange"])(next)
      }
    },
    [mode, onChange]
  )

  // ── file handling ─────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files || disabled) return

      setLimitError(null)

      const images = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      )

      const remaining = maxFiles - value.length

      if (remaining <= 0) {
        setLimitError(
          mode === "single"
            ? "Only one image allowed. Remove it to upload a new one."
            : `Limit of ${maxFiles} images reached. Remove some to add more.`
        )
        return
      }

      const skipped = images.length - remaining

      if (skipped > 0) {
        setLimitError(
          `Only ${remaining} spot${remaining !== 1 ? "s" : ""} left — ${skipped} image${
            skipped !== 1 ? "s" : ""
          } not added.`
        )
      }

      const next = [...value, ...images].slice(0, maxFiles)

      emit(next)

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [disabled, emit, maxFiles, mode, value]
  )

  const removeImage = useCallback(
    (index: number) => {
      const next = value.filter((_, i) => i !== index)
      if (limitError) setLimitError(null)
      emit(next)
    },
    [emit, limitError, value]
  )

  // ── auto-dismiss error ────────────────────────────────────────────────────

  useEffect(() => {
    if (!limitError) return
    const t = setTimeout(() => setLimitError(null), 4000)
    return () => clearTimeout(t)
  }, [limitError])

  // ── drag events ───────────────────────────────────────────────────────────

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isAtLimit) setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    if (!dropRef.current?.contains(e.relatedTarget as Node))
      setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* Drop Zone */}
      <div
        ref={dropRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          if (!isAtLimit && !disabled) inputRef.current?.click()
        }}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          isDragging && "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
          !isDragging &&
            !isAtLimit &&
            !disabled &&
            "cursor-pointer border-sidebar-accent bg-sidebar hover:bg-sidebar/70",
          (isAtLimit || disabled) &&
            "cursor-not-allowed border-sidebar-accent bg-sidebar opacity-50",
          className
        )}
      >
        {isDragging ? (
          <>
            <CloudUpload className="mb-3 h-10 w-10 text-blue-400" />
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Release to add {mode === "single" ? "image" : "images"}
            </p>
          </>
        ) : isAtLimit ? (
          <>
            <Placeholder className="mb-3 h-10 w-10 text-gray-400" />
            <p className="text-sm font-semibold text-gray-500">
              {mode === "single" ? "Image selected" : "Limit reached"}
            </p>
            <p className="text-xs text-gray-400">
              {mode === "single"
                ? "Remove it to upload a different one"
                : "Remove an image to upload more"}
            </p>
          </>
        ) : (
          <>
            <CloudUpload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Drag & drop</span> or{" "}
              <span className="font-semibold text-blue-500">browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">{resolvedPlaceholder}</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          // single mode: no `multiple` attribute so the OS picker enforces one file
          multiple={mode === "multiple"}
          accept="image/*"
          disabled={disabled || isAtLimit}
          className="hidden"
          onChange={(e) => handleFiles(e.currentTarget.files)}
          onBlur={onBlur}
        />
      </div>

      {/* Error Message */}
      {limitError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {limitError}
        </div>
      )}

      {/* Progress — only shown in multiple mode */}
      {mode === "multiple" && value.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {value.length} / {maxFiles} images selected
            </span>
            {isAtLimit ? (
              <span className="font-semibold text-amber-600">
                Limit reached
              </span>
            ) : (
              <span>{maxFiles - value.length} remaining</span>
            )}
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isAtLimit ? "bg-amber-400" : "bg-blue-400"
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {value.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            mode === "single"
              ? "grid-cols-1"
              : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
          )}
        >
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-sidebar",
                mode === "single"
                  ? "aspect-video w-full"
                  : index === 0
                    ? "col-span-2 row-span-2 aspect-square"
                    : "aspect-square"
              )}
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="object-cover"
              />

              {/* Cover Badge — only in multiple mode */}
              {mode === "multiple" && index === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}

              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                disabled={disabled}
                onClick={() => removeImage(index)}
                className={cn(
                  "absolute top-1.5 right-1.5 h-6 w-6 p-0 transition-opacity",
                  mode === "single" || index === 0
                    ? "opacity-80 hover:opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
              >
                <X size={13} />
              </Button>

              {/* Filename Tooltip */}
              <div className="absolute right-0 bottom-0 left-0 translate-y-full bg-black/60 px-1.5 py-1 text-[10px] text-white transition-transform group-hover:translate-y-0">
                <p className="truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-sidebar py-10 text-gray-400">
          <Placeholder size={32} className="mb-2 opacity-50" />
          <p className="text-sm">
            No image{mode === "multiple" ? "s" : ""} added yet
          </p>
        </div>
      )}
    </div>
  )
}
