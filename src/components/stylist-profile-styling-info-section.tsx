"use client"

import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { EachContainer } from "@/components/each-container"
import { FormItemYearsExperience } from "@/components/form-item-years-experience"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { FormItemInput } from "@/components/ui/form-item-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { SimpleOption } from "@/hooks/use-onboarding-flow"

const READ_ONLY_INPUT_CLASS =
  "cursor-default focus:border-gray-300 focus:ring-0 focus:shadow-form-field"

const selectTriggerClass = cn(
  "h-10 w-full rounded-lg border border-gray-300 bg-surface font-satoshi text-sm text-gray-600 shadow-form-field outline-none transition-[color,box-shadow,border-color]",
  "focus:border-brand focus:shadow-form-field focus:ring-2 focus:ring-brand/20",
  "disabled:cursor-not-allowed disabled:opacity-70 data-[placeholder]:text-gray-500"
)

const selectItemClass = cn(
  "relative my-0.5 flex min-h-[46px] cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-3 text-center font-satoshi text-sm font-semibold text-gray-700 outline-none select-none",
  "[&>span:first-child]:hidden",
  "data-[highlighted]:border-brand-600/35 data-[highlighted]:bg-[#f7f4ef] data-[highlighted]:text-brown-700",
  "data-[state=checked]:border-brand-600/40 data-[state=checked]:bg-[#f7f4ef] data-[state=checked]:font-bold data-[state=checked]:text-brown-700"
)

/** Shared "Styling Info" fields for stylist profile forms (dashboard + applications). */
export type StylistProfileStylingInfoFormValues = {
  fullName: string
  email: string
  phone: string
  gender: string
  businessName: string
  location: string
  linkedInUrl: string
  tiktokHandle: string
  instagramOrFacebook: string
  yearsExperience: string
  website: string
}

function StylingInfoField<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItemInput
          label={label}
          className={cn(
            READ_ONLY_INPUT_CLASS,
            disabled && "cursor-not-allowed opacity-80"
          )}
          {...field}
          disabled={disabled}
        />
      )}
    />
  )
}

function GenderSelectField<T extends FieldValues>({
  control,
  name,
  options,
  disabled = false,
}: {
  control: Control<T>
  name: FieldPath<T>
  options: SimpleOption[]
  disabled?: boolean
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1.5">
          <FormLabel className="text-sm font-medium text-text-main">
            Gender
          </FormLabel>
          <Select
            disabled={disabled}
            value={(field.value as string) || undefined}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-lg border-gray-200 bg-white p-2 shadow-lg">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className={selectItemClass}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export type StylistProfileStylingInfoSectionProps<
  T extends StylistProfileStylingInfoFormValues,
> = {
  control: Control<T>
  disabled: boolean
  genderOptions?: SimpleOption[]
  experienceOptions?: SimpleOption[]
}

export function StylistProfileStylingInfoSection<
  T extends StylistProfileStylingInfoFormValues,
>({ control, disabled, genderOptions, experienceOptions }: StylistProfileStylingInfoSectionProps<T>) {
  return (
    <EachContainer title="Styling Info">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StylingInfoField
          control={control}
          name={"fullName" as FieldPath<T>}
          label="Full Name"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"email" as FieldPath<T>}
          label="Email"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"phone" as FieldPath<T>}
          label="Phone"
          disabled={disabled}
        />
        {genderOptions && genderOptions.length > 0 ? (
          <GenderSelectField
            control={control}
            name={"gender" as FieldPath<T>}
            options={genderOptions}
            disabled={disabled}
          />
        ) : (
          <StylingInfoField
            control={control}
            name={"gender" as FieldPath<T>}
            label="Gender"
            disabled={disabled}
          />
        )}
        <StylingInfoField
          control={control}
          name={"businessName" as FieldPath<T>}
          label="Business Name"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"location" as FieldPath<T>}
          label="Location"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"linkedInUrl" as FieldPath<T>}
          label="LinkedIn Url"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"tiktokHandle" as FieldPath<T>}
          label="Tik Tok Handle"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"instagramOrFacebook" as FieldPath<T>}
          label="Instagram or Facebook Handle"
          disabled={disabled}
        />
        <FormItemYearsExperience
          control={control}
          name={"yearsExperience" as FieldPath<T>}
          disabled={disabled}
          options={experienceOptions && experienceOptions.length > 0 ? experienceOptions : undefined}
        />
        <StylingInfoField
          control={control}
          name={"website" as FieldPath<T>}
          label="Website"
          disabled={disabled}
        />
      </div>
    </EachContainer>
  )
}
