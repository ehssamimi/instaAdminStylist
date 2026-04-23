"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm, type Control, type FieldPath } from "react-hook-form"
import { ChevronDown } from "lucide-react"

import { EachContainer } from "@/components/each-container"
import { HeaderActionButton } from "@/components/header-action-button"
import { PageBackHeading } from "@/components/page-back-heading"
import { RejectStylistModal } from "@/components/reject-stylist-modal"
import { StylistBookingActivityCard } from "@/components/stylist-booking-activity-card"
import { StylistProfileHeaderCard } from "@/components/stylist-profile-header-card"
import { StylistProfilePageSkeleton } from "@/components/stylist-profile-page-skeleton"
import { Form, FormField } from "@/components/ui/form"
import { FormItemInput } from "@/components/ui/form-item-input"
import {
  STYLIST_ONBOARDING_SCREEN,
  STYLIST_ONBOARDING_USER_TYPE,
  useOnboardingOptions,
} from "@/hooks/use-onboarding-options"
import { useStylistDetail } from "@/hooks/use-stylist-detail"
import type { BookingRow } from "@/lib/booking-schema"
import { stylistApplicationsApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { OnboardingOption } from "@/models/onboardingOptions"
import type { StylistDetailDto } from "@/models/stylists"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const READ_ONLY_INPUT_CLASS =
  "cursor-default focus:border-gray-300 focus:ring-0 focus:shadow-form-field"

const NO_ONBOARDING_OPTIONS: OnboardingOption[] = []

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

function displayNameFromDetail(stylist: StylistDetailDto): string {
  const n = [stylist.first_name, stylist.last_name].filter(Boolean).join(" ").trim()
  return n || "—"
}

function displayExperienceDetail(stylist: StylistDetailDto): string {
  const e = stylist.experience?.trim() ?? ""
  if (!e || UUID_RE.test(e)) return "—"
  return e
}

function normalizeSpecialityKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ")
}

function specialityDisplay(row: OnboardingOption): string {
  const t = row.label?.trim()
  return t || row.option
}

function messageFromApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: { message?: string } } })
      .response?.data
    if (data?.message && typeof data.message === "string") return data.message
  }
  if (error instanceof Error) return error.message
  return "Something went wrong."
}

function isInlineSpecialityOption(row: OnboardingOption): boolean {
  const m = row.meta
  if (
    m &&
    typeof m === "object" &&
    "allowsTextInput" in m &&
    m.allowsTextInput === true
  ) {
    return false
  }
  return true
}

function visibleSpecialityRows(rows: OnboardingOption[]): OnboardingOption[] {
  return rows.filter(isInlineSpecialityOption)
}

function matchSpecialityRow(
  rows: OnboardingOption[],
  item: string
): OnboardingOption | undefined {
  const t = item.trim()
  const lower = t.toLowerCase()
  const norm = normalizeSpecialityKey(t)
  const asKey = lower.replace(/\s+/g, "_")

  for (const row of rows) {
    if (row.key) {
      const k = row.key.toLowerCase()
      if (k === lower || k === asKey) return row
    }
    if (normalizeSpecialityKey(specialityDisplay(row)) === norm) return row
    if (normalizeSpecialityKey(row.option) === norm) return row
    if (row.label && normalizeSpecialityKey(row.label) === norm) return row
  }
  return undefined
}

function shopFormId(row: OnboardingOption): string {
  return row.key?.trim() ? row.key.toLowerCase() : row.id
}

function parseSpecialitySelections(
  rows: OnboardingOption[],
  rawItems: string[]
): {
  specialityTags: string[]
  otherSpecialities: string
} {
  const raw = rawItems.filter(Boolean)
  const visible = visibleSpecialityRows(rows)
  const tags: string[] = []
  const other: string[] = []

  for (const item of raw) {
    const row = matchSpecialityRow(visible, item)
    if (row) {
      const label = specialityDisplay(row)
      if (!tags.includes(label)) tags.push(label)
    } else {
      other.push(item.trim())
    }
  }

  return {
    specialityTags: tags,
    otherSpecialities: other.length ? other.join(", ") : "",
  }
}

function buildStylingInfoValues(
  stylist: StylistDetailDto,
  specialityRows: OnboardingOption[],
  _shopRows: OnboardingOption[]
): StylingInfoFormValues {
  const sp = parseSpecialitySelections(
    specialityRows,
    stylist.specialityTags ?? []
  )
  const otherSpecialityParts = [
    sp.otherSpecialities,
    stylist.otherSpecialities?.trim(),
  ].filter(Boolean)
  const otherShopParts = [stylist.otherShops?.trim()].filter(Boolean)

  return {
    fullName: displayNameFromDetail(stylist),
    email: show(stylist.email),
    gender: show(stylist.gender),
    businessName: show(stylist.businessName),
    location: show(stylist.location),
    linkedInUrl: show(stylist.linkedInUrl),
    tiktokHandle: show(stylist.tiktokHandle),
    instagramOrFacebook: show(stylist.instagramOrFacebook),
    yearsExperience: displayExperienceDetail(stylist),
    website: show(stylist.website),
    specialityTags: sp.specialityTags,
    otherSpecialities: otherSpecialityParts.length
      ? otherSpecialityParts.join(", ")
      : "—",
    recommendShopIds: stylist.recommendShopIds ?? [],
    otherShops: otherShopParts.length ? otherShopParts.join(", ") : "—",
  }
}

function StylingSpecialityTagGrid({
  control,
  options,
  disabled = false,
}: {
  control: Control<StylingInfoFormValues>
  options: OnboardingOption[]
  disabled?: boolean
}) {
  const rows = visibleSpecialityRows(options)
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
            {rows.map((row) => {
              const option = specialityDisplay(row)
              const isOn = selected.has(option)
              const tags = field.value ?? []
              return (
                <li key={row.id} className="min-w-0">
                  <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={isOn}
                    className={cn(
                      "flex  h-[54px] w-full cursor-pointer items-center justify-center rounded-lg border border-solid bg-white px-0 py-3 text-center font-satoshi  font-bold shadow-form-field transition-[color,border-color] select-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      isOn
                        ? "border-brand-600 text-brand-600"
                        : "border-gray-300 text-gray-500"
                    )}
                    onClick={() => {
                      if (disabled) return
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
  shops,
  disabled = false,
}: {
  control: Control<StylingInfoFormValues>
  shops: OnboardingOption[]
  disabled?: boolean
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
            {shops.map((shop) => {
              const id = shopFormId(shop)
              const isOn = selected.has(id)
              const label = shop.option
              return (
                <li key={shop.id} className="min-w-0">
                  <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={isOn}
                    aria-label={label}
                    className={cn(
                      "flex h-[125px] w-full cursor-pointer items-center justify-center rounded-[8px] px-4 transition-[background-color,border-color]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buffer-600/35",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      isOn
                        ? "border border-solid border-brand-300 bg-brand-50"
                        : "border border-solid border-[#CECFD2] bg-white"
                    )}
                    onClick={() => {
                      if (disabled) return
                      if (ids.includes(id)) {
                        field.onChange(ids.filter((v) => v !== id))
                      } else {
                        field.onChange([...ids, id])
                      }
                    }}
                  >
                    <span className="flex w-full max-w-[7.5rem] flex-col items-center justify-center gap-1">
                      {shop.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={shop.imageUrl}
                          alt=""
                          className="max-h-14 w-auto max-w-full object-contain"
                        />
                      ) : (
                        <span className="px-1 text-center font-satoshi text-xs font-semibold leading-tight text-gray-700">
                          {label}
                        </span>
                      )}
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
  disabled = false,
}: {
  control: Control<StylingInfoFormValues>
  name: FieldPath<StylingInfoFormValues>
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

type StylistProfileViewProps = {
  backHref: string
}

export function StylistProfileView({ backHref }: StylistProfileViewProps) {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""
  const [fallbackBookings, setFallbackBookings] = useState<BookingRow[]>([])
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [approveSubmitting, setApproveSubmitting] = useState(false)
  const [rejectSubmitting, setRejectSubmitting] = useState(false)

  const { data: stylist, loading: detailLoading, error: detailError } =
    useStylistDetail(id)

  const specialityOptionsQuery = useOnboardingOptions(
    STYLIST_ONBOARDING_SCREEN.speciality,
    STYLIST_ONBOARDING_USER_TYPE
  )
  const shopOptionsQuery = useOnboardingOptions(
    STYLIST_ONBOARDING_SCREEN.recommendedShops,
    STYLIST_ONBOARDING_USER_TYPE
  )

  const specialityRows = specialityOptionsQuery.data
  const shopRows = shopOptionsQuery.data
  const optionsLoading =
    specialityOptionsQuery.isLoading || shopOptionsQuery.isLoading

  const form = useForm<StylingInfoFormValues>({
    defaultValues: STYLING_INFO_DEFAULTS,
  })

  useEffect(() => {
    if (stylist) {
      form.reset(
        buildStylingInfoValues(
          stylist,
          specialityRows ?? NO_ONBOARDING_OPTIONS,
          shopRows ?? NO_ONBOARDING_OPTIONS
        )
      )
    } else {
      form.reset(STYLING_INFO_DEFAULTS)
    }
  }, [stylist, form, specialityRows, shopRows])

  useEffect(() => {
    if (!stylist || (stylist.booking_history?.length ?? 0) > 0) {
      setFallbackBookings([])
      return
    }

    let cancelled = false

    void (async () => {
      const { MOCK_BOOKINGS } = await import("@/lib/mock-bookings")
      if (!cancelled) {
        setFallbackBookings(MOCK_BOOKINGS)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [stylist])

  const profileSrc = stylist?.profile_picture?.trim()

  const activityBookings =
    stylist?.booking_history && stylist.booking_history.length > 0
      ? stylist.booking_history
      : fallbackBookings

  /** Styling fields are editable only after verification is `APPROVED`. */
  const stylingFormLocked = stylist
    ? stylist.verificationStatus !== "APPROVED"
    : false

  const actionsDisabled =
    !id || detailLoading || !stylist || approveSubmitting || rejectSubmitting

  async function handleApprove() {
    if (!id || approveSubmitting) return
    setApproveSubmitting(true)
    try {
      await stylistApplicationsApi.approve(id)
      toast.success("Stylist approved.")
      router.push(backHref)
    } catch (e) {
      toast.error(messageFromApiError(e))
    } finally {
      setApproveSubmitting(false)
    }
  }

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <RejectStylistModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        isSubmitting={rejectSubmitting}
        onConfirm={async ({ reason, attachment }) => {
          if (!id) return
          setRejectSubmitting(true)
          try {
            const fd = new FormData()
            fd.append("reason", reason)
            if (attachment) {
              fd.append("attachment", attachment)
            }
            await stylistApplicationsApi.reject(id, fd)
            toast.success("Application rejected.")
            setRejectModalOpen(false)
            router.push(backHref)
          } catch (e) {
            toast.error(messageFromApiError(e))
          } finally {
            setRejectSubmitting(false)
          }
        }}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageBackHeading title="Stylist Profile" backHref={backHref} />
        <div className="flex flex-wrap gap-3 sm:shrink-0 sm:justify-end">
          <HeaderActionButton
            type="button"
            variant="errorSoft"
            disabled={actionsDisabled}
            onClick={() => setRejectModalOpen(true)}
          >
            Reject Stylist
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            variant="primary"
            disabled={actionsDisabled}
            onClick={handleApprove}
          >
            {approveSubmitting ? "Approving…" : "Approve Stylist"}
          </HeaderActionButton>
        </div>
      </div>

      {detailLoading && <StylistProfilePageSkeleton />}

      {detailError && !detailLoading && (
        <p className="font-satoshi text-sm text-error-600">
          Could not load stylist profile. Check the network or sign in again.
        </p>
      )}

      {!detailLoading && !stylist && !detailError && (
        <p className="font-satoshi text-sm text-black-40">Stylist not found.</p>
      )}

      {stylist && (
        <>
          <StylistProfileHeaderCard
            imageUrl={profileSrc}
            stylistName={displayNameFromDetail(stylist)}
            stylistEmail={show(stylist.email)}
            activities={[
              { label: "Completed bookings", value: String(stylist.bookings) },
              { label: "Total Revenue", value: stylist.total_revenue },
            ]}
          />
          {/* <StylistBookingActivityCard
            bookings={activityBookings}
            stylistId={id}
          /> */}

          <Form {...form}>
            <div className="flex flex-col gap-6">
              <EachContainer title="Styling Info">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StylingInfoField
                    control={form.control}
                    name="fullName"
                    label="Full Name"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="email"
                    label="Email"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="gender"
                    label="Gender"
                    selectLike
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="businessName"
                    label="Business Name"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="location"
                    label="Location"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="linkedInUrl"
                    label="LinkedIn Url"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="tiktokHandle"
                    label="Tik Tok Handle"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="instagramOrFacebook"
                    label="Instagram or Facebook Handle"
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="yearsExperience"
                    label="Years of Experience"
                    selectLike
                    disabled={stylingFormLocked}
                  />
                  <StylingInfoField
                    control={form.control}
                    name="website"
                    label="Website"
                    disabled={stylingFormLocked}
                  />
                </div>
              </EachContainer>

              <EachContainer title="Styling Speciality">
                {specialityOptionsQuery.isError && (
                  <p className="mb-4 font-satoshi text-sm text-error-600">
                    Could not load speciality options. Check the API or sign in
                    again.
                  </p>
                )}
                {optionsLoading && !(specialityRows && specialityRows.length) && (
                  <p className="mb-4 font-satoshi text-sm text-black-40">
                    Loading speciality options…
                  </p>
                )}
                <StylingSpecialityTagGrid
                  control={form.control}
                  options={specialityRows ?? NO_ONBOARDING_OPTIONS}
                  disabled={stylingFormLocked}
                />
                {/* <StylingInfoField
                  control={form.control}
                  name="otherSpecialities"
                  label="Other Specialities"
                /> */}
              </EachContainer>

              <EachContainer title="Recommended Shops">
                {shopOptionsQuery.isError && (
                  <p className="mb-4 font-satoshi text-sm text-error-600">
                    Could not load recommended shop options.
                  </p>
                )}
                {optionsLoading && !(shopRows && shopRows.length) && (
                  <p className="mb-4 font-satoshi text-sm text-black-40">
                    Loading shop options…
                  </p>
                )}
                <RecommendedShopsGrid
                  control={form.control}
                  shops={shopRows ?? NO_ONBOARDING_OPTIONS}
                  disabled={stylingFormLocked}
                />
                {/* <StylingInfoField
                  control={form.control}
                  name="otherShops"
                  label="Other Shops"
                /> */}
              </EachContainer>
            </div>
          </Form>
        </>
      )}
    </div>
  )
}
