'use client'

import { PageBackHeading } from '@/components/page-back-heading'
import { ProfileHeaderCard } from '@/components/profile-header-card'
import { BookingActivitySection } from '@/components/booking-activity-section'
import { Skeleton } from '@/components/ui/skeleton'
import type { CustomerDetailDto } from '@/models/customer'

export type CustomerProfilePageViewProps = {
  customer: CustomerDetailDto | null
  backHref: string
  backAriaLabel?: string
  loading?: boolean
  errorMessage?: string | null
}

function CustomerProfileSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <section className="mb-6 admin-panel-surface">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex gap-6 sm:items-center">
            <Skeleton className="size-24 shrink-0 rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-5 w-48 rounded-md" />
            </div>
          </div>
          <div className="flex flex-1 gap-3">
            <Skeleton className="h-[112px] flex-1 rounded-xl" />
            <Skeleton className="h-[112px] flex-1 rounded-xl" />
          </div>
        </div>
      </section>
      <section className="admin-panel-surface">
        <Skeleton className="h-10 w-full max-w-md rounded-md" />
        <Skeleton className="mt-4 h-48 w-full rounded-md" />
      </section>
    </div>
  )
}

export function CustomerProfilePageView({
  customer,
  backHref,
  backAriaLabel = 'Back to customers',
  loading = false,
  errorMessage = null,
}: CustomerProfilePageViewProps) {
  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <div className="mb-6">
        <PageBackHeading
          title="Customer Profile"
          backHref={backHref}
          aria-label={backAriaLabel}
        />
      </div>

      {loading && <CustomerProfileSkeleton />}

      {errorMessage && !loading && (
        <p className="font-satoshi text-sm text-error-600" role="alert">
          {errorMessage}
        </p>
      )}

      {!loading && !customer && !errorMessage && (
        <p className="font-satoshi text-sm text-black-40">Customer not found.</p>
      )}

      {customer && !loading && (
        <>
          <ProfileHeaderCard
            imageUrl={customer.profile_picture}
            displayName={customer.name}
            email={customer.email}
            nameFieldLabel="Customer Name"
            emailFieldLabel="Customer Email"
            activities={[
              { label: 'Total Bookings', value: String(customer.total_bookings) },
              { label: 'Total Spend', value: customer.total_spend },
            ]}
          />

          <BookingActivitySection
            bookings={customer.booking_history}
            title="Booking Activity"
            exportFileNamePrefix="customer_booking_activity"
            counterpartColumn="stylist"
            costColumnHeader="Cost"
            rowClickContext={{
              kind: 'customer',
              customerId: customer.id,
            }}
          />
        </>
      )}
    </div>
  )
}
