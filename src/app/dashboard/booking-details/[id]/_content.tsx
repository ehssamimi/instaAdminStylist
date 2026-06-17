'use client'

import { useParams } from 'next/navigation'
import { BookingDetailsPageView } from '@/components/booking-details-page-view'
import { useBookingDetail } from '@/hooks/use-booking-detail'
import { getApiErrorMessage } from '@/lib/api'

export default function BookingDetailsStandaloneContent() {
  const params = useParams()
  const id =
    typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''
  const { data, loading, error } = useBookingDetail(id)

  return (
    <BookingDetailsPageView
      booking={data}
      loading={loading}
      errorMessage={error ? getApiErrorMessage(error) : null}
      backHref="/dashboard/bookings"
      backAriaLabel="Back to booking history"
    />
  )
}
