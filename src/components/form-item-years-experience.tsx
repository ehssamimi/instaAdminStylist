"use client"

import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  STYLIST_YEARS_EXPERIENCE_OPTIONS,
  experienceToYearsSelectValue,
} from "@/lib/stylist-years-experience-options"
import type { SimpleOption } from "@/hooks/use-onboarding-flow"

const itemClass = cn(
  "relative my-0.5 flex min-h-[46px] cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-3 text-center font-satoshi text-sm font-semibold text-gray-700 outline-none select-none",
  "[&>span:first-child]:hidden",
  "data-[highlighted]:border-brand-600/35 data-[highlighted]:bg-[#f7f4ef] data-[highlighted]:text-brown-700",
  "data-[state=checked]:border-brand-600/40 data-[state=checked]:bg-[#f7f4ef] data-[state=checked]:font-bold data-[state=checked]:text-brown-700"
)

const triggerClass = cn(
  "h-10 w-full rounded-lg border border-gray-300 bg-surface font-satoshi text-sm text-gray-600 shadow-form-field outline-none transition-[color,box-shadow,border-color]",
  "focus:border-brand focus:shadow-form-field focus:ring-2 focus:ring-brand/20",
  "disabled:cursor-not-allowed disabled:opacity-70 data-[placeholder]:text-gray-500"
)

export type FormItemYearsExperienceProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  disabled?: boolean
  placeholder?: string
  options?: SimpleOption[]
}

export function FormItemYearsExperience<T extends FieldValues>({
  control,
  name,
  label = "Years of Experience",
  disabled = false,
  placeholder = "Select years of experience",
  options,
}: FormItemYearsExperienceProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectValue = options
          ? (field.value as string) || undefined
          : experienceToYearsSelectValue(field.value) || undefined

        const items = options
          ? options.map((o) => ({ value: o.value, label: o.label }))
          : STYLIST_YEARS_EXPERIENCE_OPTIONS.map((o) => ({ value: o, label: o }))

        return (
          <FormItem className="gap-1.5">
            <FormLabel className="text-sm font-medium text-text-main">
              {label}
            </FormLabel>
            <Select
              disabled={disabled}
              value={selectValue}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-lg border-gray-200 bg-white p-2 shadow-lg">
                {items.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className={itemClass}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
