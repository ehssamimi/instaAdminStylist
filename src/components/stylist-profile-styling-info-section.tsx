"use client"

import { ChevronDown } from "lucide-react"
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { EachContainer } from "@/components/each-container"
import { FormItemYearsExperience } from "@/components/form-item-years-experience"
import { FormField } from "@/components/ui/form"
import { FormItemInput } from "@/components/ui/form-item-input"
import { cn } from "@/lib/utils"

const READ_ONLY_INPUT_CLASS =
  "cursor-default focus:border-gray-300 focus:ring-0 focus:shadow-form-field"

/** Shared “Styling Info” fields for stylist profile forms (dashboard + applications). */
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
  selectLike = false,
  disabled = false,
}: {
  control: Control<T>
  name: FieldPath<T>
  label: string
  selectLike?: boolean
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
          rightIcon={
            selectLike ? (
              <ChevronDown className="size-4 text-gray-500" aria-hidden />
            ) : undefined
          }
          {...field}
          disabled={disabled}
        />
      )}
    />
  )
}

export type StylistProfileStylingInfoSectionProps<
  T extends StylistProfileStylingInfoFormValues,
> = {
  control: Control<T>
  disabled: boolean
}

export function StylistProfileStylingInfoSection<
  T extends StylistProfileStylingInfoFormValues,
>({ control, disabled }: StylistProfileStylingInfoSectionProps<T>) {
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
        <StylingInfoField
          control={control}
          name={"gender" as FieldPath<T>}
          label="Gender"
          selectLike
          disabled={disabled}
        />
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
