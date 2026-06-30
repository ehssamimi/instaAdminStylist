"use client"

import { useEffect, useState } from "react"
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form"

import { EachContainer } from "@/components/each-container"
import { FormItemYearsExperience } from "@/components/form-item-years-experience"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { FormItemInput } from "@/components/ui/form-item-input"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { SimpleOption } from "@/hooks/use-onboarding-flow"
import {
  locationsApi,
  type LocationCity,
  type LocationCountry,
  type LocationState,
} from "@/lib/api"

// Temporary: country is fixed to US until multi-country support is added
const US_COUNTRY_ID = "6c959176-b60c-4e11-bbc1-8d679c4becd8"
const US_COUNTRY: LocationCountry = { id: US_COUNTRY_ID, name: "United States", code: "US" }

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

const COUNTRY_CODES: { value: string; label: string }[] = [
  { value: "+1",    label: "US +1" },
  { value: "+1CA",  label: "CA +1" },
  { value: "+52",   label: "MX +52" },
  { value: "+54",   label: "AR +54" },
  { value: "+55",   label: "BR +55" },
  { value: "+56",   label: "CL +56" },
  { value: "+57",   label: "CO +57" },
  { value: "+51",   label: "PE +51" },
  { value: "+44",   label: "GB +44" },
  { value: "+49",   label: "DE +49" },
  { value: "+33",   label: "FR +33" },
  { value: "+39",   label: "IT +39" },
  { value: "+34",   label: "ES +34" },
  { value: "+31",   label: "NL +31" },
  { value: "+32",   label: "BE +32" },
  { value: "+41",   label: "CH +41" },
  { value: "+43",   label: "AT +43" },
  { value: "+46",   label: "SE +46" },
  { value: "+47",   label: "NO +47" },
  { value: "+45",   label: "DK +45" },
  { value: "+358",  label: "FI +358" },
  { value: "+353",  label: "IE +353" },
  { value: "+351",  label: "PT +351" },
  { value: "+30",   label: "GR +30" },
  { value: "+48",   label: "PL +48" },
  { value: "+61",   label: "AU +61" },
  { value: "+64",   label: "NZ +64" },
  { value: "+81",   label: "JP +81" },
  { value: "+82",   label: "KR +82" },
  { value: "+86",   label: "CN +86" },
  { value: "+91",   label: "IN +91" },
  { value: "+65",   label: "SG +65" },
  { value: "+852",  label: "HK +852" },
  { value: "+886",  label: "TW +886" },
  { value: "+66",   label: "TH +66" },
  { value: "+60",   label: "MY +60" },
  { value: "+62",   label: "ID +62" },
  { value: "+63",   label: "PH +63" },
  { value: "+84",   label: "VN +84" },
  { value: "+27",   label: "ZA +27" },
  { value: "+234",  label: "NG +234" },
  { value: "+20",   label: "EG +20" },
  { value: "+971",  label: "AE +971" },
  { value: "+966",  label: "SA +966" },
  { value: "+972",  label: "IL +972" },
  { value: "+90",   label: "TR +90" },
  { value: "+7",    label: "RU +7" },
]

/** Strip the CA suffix used to deduplicate Canada from the stored value before submitting. */
export function normaliseCountryCode(v: string): string {
  return v === "+1CA" ? "+1" : v
}

/** Shared "Styling Info" fields for stylist profile forms (dashboard + applications). */
export type StylistProfileStylingInfoFormValues = {
  fullName: string
  email: string
  countryCode: string
  phoneNumber: string
  gender: string
  businessName: string
  location: string
  locationCountryId: string
  locationStateId: string
  locationCityId: string
  linkedInUrl: string
  tiktokHandle: string
  instagramHandle: string
  facebookHandle: string
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

function PhoneField<T extends FieldValues>({
  control,
  countryCodeName,
  phoneNumberName,
  disabled = false,
}: {
  control: Control<T>
  countryCodeName: FieldPath<T>
  phoneNumberName: FieldPath<T>
  disabled?: boolean
}) {
  return (
    <FormField
      control={control}
      name={phoneNumberName}
      render={({ field, fieldState }) => (
        <FormItem className="gap-1.5">
          <FormLabel className="text-sm font-medium text-text-main">
            Phone number
          </FormLabel>
          <div
            className={cn(
              "flex h-10 overflow-hidden rounded-lg border bg-surface shadow-form-field",
              "transition-[color,box-shadow,border-color]",
              fieldState.error ? "border-destructive" : "border-gray-300",
              !disabled &&
                "focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
              disabled && "opacity-70"
            )}
          >
            {/* Country code dropdown */}
            <FormField
              control={control}
              name={countryCodeName}
              render={({ field: ccField }) => (
                <Select
                  disabled={disabled}
                  value={(ccField.value as string) || "+1"}
                  onValueChange={ccField.onChange}
                >
                  <SelectTrigger className="!h-full w-auto min-w-[80px] shrink-0 rounded-none border-0 border-r border-gray-200 bg-transparent px-3 text-sm shadow-none focus:ring-0 focus-visible:ring-0 font-satoshi text-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[148px] rounded-lg border-gray-200 bg-white p-1 shadow-lg">
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="cursor-pointer rounded-md py-1.5 text-sm font-satoshi"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {/* Phone number input */}
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                placeholder="(555) 000-0000"
                className={cn(
                  "h-full flex-1 rounded-none border-0 bg-transparent shadow-none",
                  "focus-visible:ring-0 focus-visible:border-0",
                  "font-satoshi text-sm text-gray-700 placeholder:text-gray-400",
                  disabled && "cursor-not-allowed"
                )}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
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

function LocationDropdownFields<T extends StylistProfileStylingInfoFormValues>({
  control,
  disabled,
}: {
  control: Control<T>
  disabled: boolean
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setValue } = useFormContext<any>()

  const stateId = (useWatch({ control, name: "locationStateId" as FieldPath<T> }) as string) ?? ""

  const [states, setStates] = useState<LocationState[]>([])
  const [cities, setCities] = useState<LocationCity[]>([])
  const [statesLoading, setStatesLoading] = useState(false)
  const [citiesLoading, setCitiesLoading] = useState(false)

  // Country is fixed to US — ensure the form value is always set to US
  useEffect(() => {
    setValue("locationCountryId", US_COUNTRY_ID)
  }, [setValue])

  // Fetch US states on mount
  useEffect(() => {
    setStatesLoading(true)
    locationsApi.getStatesByCountry(US_COUNTRY_ID)
      .then(setStates)
      .catch(() => {})
      .finally(() => setStatesLoading(false))
  }, [])

  // Fetch cities whenever stateId changes
  useEffect(() => {
    setCities([])
    if (!stateId) return
    setCitiesLoading(true)
    locationsApi.getCitiesByState(stateId)
      .then(setCities)
      .catch(() => {})
      .finally(() => setCitiesLoading(false))
  }, [stateId])

  return (
    <>
      {/* Country — read-only, fixed to United States */}
      <FormItem className="gap-1.5">
        <FormLabel className="text-sm font-medium text-text-main">Country</FormLabel>
        <Select disabled value={US_COUNTRY_ID}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 bg-white p-2 shadow-lg">
            <SelectItem key={US_COUNTRY.id} value={US_COUNTRY.id} className={selectItemClass}>
              {US_COUNTRY.name}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      {/* State */}
      <FormField
        control={control}
        name={"locationStateId" as FieldPath<T>}
        render={({ field }) => (
          <FormItem className="gap-1.5">
            <FormLabel className="text-sm font-medium text-text-main">State</FormLabel>
            <Select
              disabled={disabled || statesLoading}
              value={(field.value as string) || ""}
              onValueChange={(v) => {
                field.onChange(v)
                setValue("locationCityId", "")
              }}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue
                    placeholder={statesLoading ? "Loading…" : "Select state"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60 rounded-lg border-gray-200 bg-white p-2 shadow-lg">
                {states.map((s) => (
                  <SelectItem key={s.id} value={s.id} className={selectItemClass}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={control}
        name={"locationCityId" as FieldPath<T>}
        render={({ field }) => (
          <FormItem className="gap-1.5">
            <FormLabel className="text-sm font-medium text-text-main">City</FormLabel>
            <Select
              disabled={disabled || !stateId || citiesLoading}
              value={(field.value as string) || ""}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue
                    placeholder={
                      citiesLoading ? "Loading…" :
                      !stateId ? "Select state first" :
                      "Select city"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60 rounded-lg border-gray-200 bg-white p-2 shadow-lg">
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.id} className={selectItemClass}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
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
        <PhoneField
          control={control}
          countryCodeName={"countryCode" as FieldPath<T>}
          phoneNumberName={"phoneNumber" as FieldPath<T>}
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
          disabled={true}
        />
        <LocationDropdownFields control={control} disabled={disabled} />
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
          name={"instagramHandle" as FieldPath<T>}
          label="Instagram Handle"
          disabled={disabled}
        />
        <StylingInfoField
          control={control}
          name={"facebookHandle" as FieldPath<T>}
          label="Facebook Handle"
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
