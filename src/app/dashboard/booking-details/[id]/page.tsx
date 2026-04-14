"use client"

import { useParams } from "next/navigation"
import { BookingDetailsPageView } from "@/components/booking-details-page-view"
import { useBookingDetail } from "@/hooks/use-booking-detail"

export default function BookingDetailsStandalonePage() {
  const params = useParams()
  const id =
    typeof params.id === "string" ? params.id : params.id?.[0] ?? ""
  const { data, loading, error } = useBookingDetail(id)

  return (
    <BookingDetailsPageView
      booking={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      backHref="/dashboard/bookings"
      backAriaLabel="Back to booking history"
    />
  )
}
export const runtime = 'edge';