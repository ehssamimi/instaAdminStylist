'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { BookingDetailsPageView } from '@/components/booking-details-page-view'
import { useBookingDetail } from '@/hooks/use-booking-detail'

export default function BookingDetailsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id =
    typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const fromStylist = searchParams.get('from') === 'stylist'
  const stylistId = searchParams.get('stylistId')
  const fromCustomer = searchParams.get('from') === 'customer'
  const customerId = searchParams.get('customerId')
  const backHref =
    fromCustomer && customerId
      ? `/dashboard/customers/${customerId}`
      : fromStylist && stylistId
        ? `/dashboard/stylist/${stylistId}`
        : '/dashboard/bookings'
  const backAriaLabel =
    fromCustomer && customerId
      ? 'Back to customer profile'
      : fromStylist && stylistId
        ? 'Back to stylist profile'
        : 'Back to booking history'

  const { data, loading, error } = useBookingDetail(id)

  return (
    <BookingDetailsPageView
      booking={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      backHref={backHref}
      backAriaLabel={backAriaLabel}
    />
  )
}
