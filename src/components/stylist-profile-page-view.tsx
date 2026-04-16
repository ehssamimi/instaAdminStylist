'use client'

import { useEffect } from 'react'
import { useForm, type Control, type FieldPath } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'

import { EachContainer } from '@/components/each-container'
import { PageBackHeading } from '@/components/page-back-heading'
import { StylistProfilePageSkeleton } from '@/components/stylist-profile-page-skeleton'
import { StylistBookingActivityCard } from '@/components/stylist-booking-activity-card'
import { StylistProfileHeaderCard } from '@/components/stylist-profile-header-card'
import { HeaderActionButton } from '@/components/header-action-button'
import { Form, FormField } from '@/components/ui/form'
import { FormItemInput } from '@/components/ui/form-item-input'
import { cn } from '@/lib/utils'
import type { StylistDetailDto } from '@/models/stylists'

const STYLING_SPECIALITY_OPTIONS = [
  'Everyday wear',
  'High fashion/editorial',
  'Corporate/Professional Attire',
  'Special events/weddings',
  'Capsule Wardrobes',
  'Sustainable/eco-friendly fashion',
  'Size-inclusive styling',
  'Close Cleanse',
  'Seasonal Refresh',
] as const

const RECOMMENDED_SHOP_OPTIONS = [
  { id: 'macys', label: "Macy's", imageSrc: '/mock/macys.jpg' as const },
  { id: 'zara', label: 'Zara', imageSrc: '/mock/zara.jpg' as const },
] as const

type StylingInfoFormValues = {
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
  specialityTags: string[]
  otherSpecialities: string
  recommendShopIds: string[]
  otherShops: string
}

const STYLING_INFO_DEFAULTS: StylingInfoFormValues = {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  businessName: '',
  location: '',
  linkedInUrl: '',
  tiktokHandle: '',
  instagramOrFacebook: '',
  yearsExperience: '',
  website: '',
  specialityTags: [],
  otherSpecialities: '',
  recommendShopIds: [],
  otherShops: '',
}

function show(v: string | null | undefined): string {
  const s = v?.trim()
  return s ? s : '—'
}

function buildFormValues(stylist: StylistDetailDto): StylingInfoFormValues {
  return {
    fullName: `${stylist.first_name} ${stylist.last_name}`.trim() || '—',
    email: show(stylist.email),
    phone: show(stylist.phoneNumber),
    gender: show(stylist.gender),
    businessName: show(stylist.businessName),
    location: show(stylist.location),
    linkedInUrl: show(stylist.linkedInUrl),
    tiktokHandle: show(stylist.tiktokHandle),
    instagramOrFacebook: show(stylist.instagramOrFacebook),
    yearsExperience: show(stylist.experience),
    website: show(stylist.website),
    specialityTags: stylist.specialityTags ?? [],
    otherSpecialities: stylist.otherSpecialities ?? '—',
    recommendShopIds: stylist.recommendShopIds ?? [],
    otherShops: stylist.otherShops ?? '—',
  }
}

const READ_ONLY_INPUT_CLASS =
  'cursor-default focus:border-gray-300 focus:ring-0 focus:shadow-form-field'

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
                      'flex h-[54px] w-full cursor-pointer items-center justify-center rounded-lg border border-solid bg-white px-0 py-3 text-center font-satoshi font-bold shadow-form-field transition-[color,border-color] select-none',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25',
                      isOn
                        ? 'border-brand-600 text-brand-600'
                        : 'border-gray-300 text-gray-500'
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
                      'flex h-[125px] w-full cursor-pointer items-center justify-center rounded-[8px] px-4 transition-[background-color,border-color]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buffer-600/35',
                      isOn
                        ? 'border border-solid border-brand-300 bg-brand-50'
                        : 'border border-solid border-[#CECFD2] bg-white'
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

export type StylistProfilePageViewProps = {
  stylist: StylistDetailDto | null
  backHref: string
  backAriaLabel?: string
  loading?: boolean
  errorMessage?: string | null
}

export function StylistProfilePageView({
  stylist,
  backHref,
  backAriaLabel = 'Back to stylists',
  loading = false,
  errorMessage = null,
}: StylistProfilePageViewProps) {
  const form = useForm<StylingInfoFormValues>({
    defaultValues: STYLING_INFO_DEFAULTS,
  })

  useEffect(() => {
    if (stylist) {
      form.reset(buildFormValues(stylist))
    } else {
      form.reset(STYLING_INFO_DEFAULTS)
    }
  }, [stylist, form])

  const profileSrc = stylist?.profile_picture ?? undefined

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageBackHeading
          title="Stylist Profile"
          backHref={backHref}
          aria-label={backAriaLabel}
        />
        <div className="flex flex-wrap gap-3 sm:shrink-0 sm:justify-end">
          <HeaderActionButton type="button" variant="errorSoft">
            Reject Stylist
          </HeaderActionButton>
          <HeaderActionButton type="button" variant="primary">
            Approve Stylist
          </HeaderActionButton>
        </div>
      </div>

      {loading && <StylistProfilePageSkeleton />}

      {errorMessage && !loading && (
        <p className="font-satoshi text-sm text-error-600" role="alert">
          {errorMessage}
        </p>
      )}

      {!loading && !stylist && !errorMessage && (
        <p className="font-satoshi text-sm text-black-40">
          Stylist not found.
        </p>
      )}

      {stylist && (
        <>
          <StylistProfileHeaderCard
            imageUrl={profileSrc}
            stylistName={`${stylist.first_name} ${stylist.last_name}`}
            stylistEmail={stylist.email}
            activities={[
              { label: 'Completed bookings', value: String(stylist.bookings) },
              { label: 'Total Revenue', value: stylist.total_revenue },
            ]}
          />

          <StylistBookingActivityCard
            bookings={stylist.booking_history}
            stylistId={stylist.id}
          />

          <Form {...form}>
            <div className="flex flex-col gap-6">
              <EachContainer title="Styling Info">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StylingInfoField control={form.control} name="fullName" label="Full Name" />
                  <StylingInfoField control={form.control} name="email" label="Email" />
                  <StylingInfoField control={form.control} name="phone" label="Phone" />
                  <StylingInfoField control={form.control} name="gender" label="Gender" selectLike />
                  <StylingInfoField control={form.control} name="businessName" label="Business Name" />
                  <StylingInfoField control={form.control} name="location" label="Location" />
                  <StylingInfoField control={form.control} name="linkedInUrl" label="LinkedIn Url" />
                  <StylingInfoField control={form.control} name="tiktokHandle" label="Tik Tok Handle" />
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
                  <StylingInfoField control={form.control} name="website" label="Website" />
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
