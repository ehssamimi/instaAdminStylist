"use client"

import { useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { useForm, type Control, type FieldPath } from "react-hook-form"
import { ChevronDown } from "lucide-react"

import { EachContainer } from "@/components/each-container"
import { PageBackHeading } from "@/components/page-back-heading"
import { StylistBookingActivityCard } from "@/components/stylist-booking-activity-card"
import { StylistProfileHeaderCard } from "@/components/stylist-profile-header-card"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { FormItemInput } from "@/components/ui/form-item-input"
import { usePendingStylistApplications } from "@/hooks/use-stylist-applications"
import { MOCK_BOOKINGS } from "@/lib/mock-bookings"
import { cn } from "@/lib/utils"
import type { PendingStylistApplication } from "@/models/stylistApplication"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const READ_ONLY_INPUT_CLASS =
  "cursor-default focus:border-gray-300 focus:ring-0 focus:shadow-form-field"

const STYLING_SPECIALITY_OPTIONS = [
  "Everyday wear",
  "High fashion/editorial",
  "Corporate/Professional Attire",
  "Special events/weddings",
  "Capsule Wardrobes",
  "Sustainable/eco-friendly fashion",
  "Size-inclusive styling",
  "Close Cleanse",
  "Seasonal Refresh",
] as const

const RECOMMENDED_SHOP_OPTIONS = [
  {
    id: "macys",
    label: "Macy's",
    imageSrc: "/mock/macys.jpg" as const,
  },
  {
    id: "zara",
    label: "Zara",
    imageSrc: "/mock/zara.jpg" as const,
  },
] as const

type StylingInfoFormValues = {
  fullName: string
  email: string
  gender: string
  businessName: string
  location: string
  linkedInUrl: string
  tiktokHandle: string
  instagramOrFacebook: string
  yearsExperience: string
  website: string
  specialityTags: string[]
  otherSpecialities: string
  recommendShopIds: string[]
  otherShops: string
}

const STYLING_INFO_DEFAULTS: StylingInfoFormValues = {
  fullName: "",
  email: "",
  gender: "",
  businessName: "",
  location: "",
  linkedInUrl: "",
  tiktokHandle: "",
  instagramOrFacebook: "",
  yearsExperience: "",
  website: "",
  specialityTags: [],
  otherSpecialities: "",
  recommendShopIds: [],
  otherShops: "",
}

function show(v: string | null | undefined): string {
  const s = v?.trim()
  return s ? s : "—"
}

function displayName(app: PendingStylistApplication): string {
  const f = app.firstName ?? app.user?.firstName
  const l = app.lastName ?? app.user?.lastName
  const n = [f, l].filter(Boolean).join(" ").trim()
  return n || "—"
}

function displayEmail(app: PendingStylistApplication): string {
  return show(app.email ?? app.user?.email)
}

function displayExperience(app: PendingStylistApplication): string {
  const e = app.experience?.trim() ?? ""
  if (!e || UUID_RE.test(e)) return "—"
  return e
}

function instagramOrFacebook(app: PendingStylistApplication): string {
  const ig = app.instagramHandle?.trim()
  const fb = app.facebookHandle?.trim()
  if (ig && fb) return `${ig} · ${fb}`
  return show(ig || fb)
}

function normalizeSpecialityKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ")
}

function parseApplicationSpecialities(app: PendingStylistApplication): {
  specialityTags: string[]
  otherSpecialities: string
} {
  const raw = app.speciality?.filter(Boolean) ?? []
  const tags: string[] = []
  const other: string[] = []
  const optionByKey = new Map(
    STYLING_SPECIALITY_OPTIONS.map((o) => [normalizeSpecialityKey(o), o])
  )

  for (const item of raw) {
    const canonical = optionByKey.get(normalizeSpecialityKey(item))
    if (canonical) {
      if (!tags.includes(canonical)) tags.push(canonical)
    } else {
      other.push(item.trim())
    }
  }

  return {
    specialityTags: tags,
    otherSpecialities: other.length ? other.join(", ") : "",
  }
}

function parseRecommendShops(app: PendingStylistApplication): {
  recommendShopIds: string[]
  otherShops: string
} {
  const raw = app.recommendShops?.filter(Boolean) ?? []
  const selected: string[] = []
  const other: string[] = []

  for (const item of raw) {
    const key = item.trim().toLowerCase()
    const shop = RECOMMENDED_SHOP_OPTIONS.find(
      (s) =>
        s.id === key ||
        key.includes(s.id) ||
        s.label.toLowerCase().replace(/'/g, "") === key.replace(/'/g, "")
    )
    if (shop) {
      if (!selected.includes(shop.id)) selected.push(shop.id)
    } else {
      other.push(item.trim())
    }
  }

  return {
    recommendShopIds: selected,
    otherShops: other.length ? other.join(", ") : "",
  }
}

function buildStylingInfoValues(
  app: PendingStylistApplication
): StylingInfoFormValues {
  const sp = parseApplicationSpecialities(app)
  const shops = parseRecommendShops(app)
  return {
    fullName: displayName(app),
    email: displayEmail(app),
    gender: show(app.gender),
    businessName: show(app.businessName),
    location: show(app.location),
    linkedInUrl: show(app.linkedInUrl),
    tiktokHandle: show(app.tiktokHandle),
    instagramOrFacebook: instagramOrFacebook(app),
    yearsExperience: displayExperience(app),
    website: "—",
    specialityTags: sp.specialityTags,
    otherSpecialities: sp.otherSpecialities || "—",
    recommendShopIds: shops.recommendShopIds,
    otherShops: shops.otherShops || "—",
  }
}

function ActivityPlaceholder({
  label = "No activity yet",
  value = "—",
}: {
  label?: string
  value?: string
}) {
  return (
    <div className="flex min-h-[112px] min-w-[140px] flex-1 flex-col rounded-xl border border-gray-100 bg-white p-3">
      <p className="font-satoshi text-sm text-gray-900">{label}</p>
      <p className="mt-auto flex flex-1 items-end justify-strat font-satoshi text-xl font-normal text-balack">
        {value}
      </p>
    </div>
  )
}

function StylingSpecialityTagGrid({
  control,
}: {
  control: Control<StylingInfoFormValues>
}) {
  return (
    <FormField
      control={control}
      name="specialityTags"
      render={({ field }) => {
        const selected = new Set(field.value ?? [])
        return (
          <ul
            className="mb-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Styling speciality selections"
          >
            {STYLING_SPECIALITY_OPTIONS.map((option) => {
              const isOn = selected.has(option)
              const tags = field.value ?? []
              return (
                <li key={option} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={isOn}
                    className={cn(
                      "flex  h-[54px] w-full cursor-pointer items-center justify-center rounded-lg border border-solid bg-white px-0 py-3 text-center font-satoshi  font-bold shadow-form-field transition-[color,border-color] select-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25",
                      isOn
                        ? "border-brand-600 text-brand-600"
                        : "border-gray-300 text-gray-500"
                    )}
                    onClick={() => {
                      if (tags.includes(option)) {
                        field.onChange(tags.filter((t) => t !== option))
                      } else {
                        field.onChange([...tags, option])
                      }
                    }}
                  >
                    {option}
                  </button>
                </li>
              )
            })}
          </ul>
        )
      }}
    />
  )
}

function RecommendedShopsGrid({
  control,
}: {
  control: Control<StylingInfoFormValues>
}) {
  return (
    <FormField
      control={control}
      name="recommendShopIds"
      render={({ field }) => {
        const selected = new Set(field.value ?? [])
        const ids = field.value ?? []
        return (
          <ul
            className="mb-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-7"
            aria-label="Recommended shops"
          >
            {RECOMMENDED_SHOP_OPTIONS.map((shop) => {
              const isOn = selected.has(shop.id)
              return (
                <li key={shop.id} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={isOn}
                    aria-label={shop.label}
                    className={cn(
                      "flex h-[125px] w-full cursor-pointer items-center justify-center rounded-[8px] px-4 transition-[background-color,border-color]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buffer-600/35",
                      isOn
                        ? "border border-solid border-brand-300 bg-brand-50"
                        : "border border-solid border-[#CECFD2] bg-white"
                    )}
                    onClick={() => {
                      if (ids.includes(shop.id)) {
                        field.onChange(ids.filter((id) => id !== shop.id))
                      } else {
                        field.onChange([...ids, shop.id])
                      }
                    }}
                  >
                    <span className="flex w-full max-w-[7.5rem] items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={shop.imageSrc}
                        alt=""
                        className="max-h-14 w-auto max-w-full object-contain"
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )
      }}
    />
  )
}

function StylingInfoField({
  control,
  name,
  label,
  selectLike = false,
}: {
  control: Control<StylingInfoFormValues>
  name: FieldPath<StylingInfoFormValues>
  label: string
  selectLike?: boolean
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItemInput
          label={label}
          className={READ_ONLY_INPUT_CLASS}
          rightIcon={
            selectLike ? (
              <ChevronDown className="size-4 text-gray-500" aria-hidden />
            ) : undefined
          }
          {...field}
        />
      )}
    />
  )
}

type StylistProfileViewProps = {
  backHref: string
}

export function StylistProfileView({ backHref }: StylistProfileViewProps) {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""

  const { data: pendingList, isLoading, isError } = usePendingStylistApplications()

  const application = useMemo(
    () => pendingList?.find((a) => a.id === id),
    [pendingList, id]
  )

  const form = useForm<StylingInfoFormValues>({
    defaultValues: STYLING_INFO_DEFAULTS,
  })

  useEffect(() => {
    if (application) {
      form.reset(buildStylingInfoValues(application))
    } else {
      form.reset(STYLING_INFO_DEFAULTS)
    }
  }, [application, form])

  const profileSrc = application?.imageUrl?.trim()

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageBackHeading title="Stylist Profile" backHref={backHref} />
        <div className="flex flex-wrap gap-3 sm:shrink-0 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="font-satoshi rounded-lg border-error-300 bg-white text-error-600 hover:bg-error-50 hover:text-error-600"
          >
            Reject Stylist
          </Button>
          <Button
            type="button"
            className="font-satoshi rounded-lg bg-black-100 text-white hover:bg-neutral-black_02 hover:text-white"
          >
            Approve Stylist
          </Button>
        </div>
      </div>

      {isLoading && (
        <p className="font-satoshi text-sm text-black-40">Loading profile…</p>
      )}

      {isError && !isLoading && (
        <p className="font-satoshi text-sm text-error-600">
          Could not load applications list.
        </p>
      )}

      {!isLoading && !application && !isError && (
        <p className="font-satoshi text-sm text-black-40">
          This application was not found in the pending list. Open it from
          Applications or refresh the list.
        </p>
      )}

      {application && (
        <>
          <StylistProfileHeaderCard
            imageUrl={profileSrc}
            stylistName={displayName(application)}
            stylistEmail={displayEmail(application)}
          />
          <StylistBookingActivityCard bookings={MOCK_BOOKINGS} stylistId={id} />

          <Form {...form}>
            <div className="flex flex-col gap-6">
              <EachContainer title="Styling Info">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StylingInfoField
                    control={form.control}
                    name="fullName"
                    label="Full Name"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="email"
                    label="Email"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="gender"
                    label="Gender"
                    selectLike
                  />
                  <StylingInfoField
                    control={form.control}
                    name="businessName"
                    label="Business Name"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="location"
                    label="Location"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="linkedInUrl"
                    label="LinkedIn Url"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="tiktokHandle"
                    label="Tik Tok Handle"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="instagramOrFacebook"
                    label="Instagram or Facebook Handle"
                  />
                  <StylingInfoField
                    control={form.control}
                    name="yearsExperience"
                    label="Years of Experience"
                    selectLike
                  />
                  <StylingInfoField
                    control={form.control}
                    name="website"
                    label="Website"
                  />
                </div>
              </EachContainer>

              <EachContainer title="Styling Speciality">
                <StylingSpecialityTagGrid control={form.control} />
                <StylingInfoField
                  control={form.control}
                  name="otherSpecialities"
                  label="Other Specialities"
                />
              </EachContainer>

              <EachContainer title="Recommended Shops">
                <RecommendedShopsGrid control={form.control} />
                <StylingInfoField
                  control={form.control}
                  name="otherShops"
                  label="Other Shops"
                />
              </EachContainer>
            </div>
          </Form>
        </>
      )}
    </div>
  )
}
