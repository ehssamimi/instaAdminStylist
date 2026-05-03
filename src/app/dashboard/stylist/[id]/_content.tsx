'use client'

import { useCallback, useState } from 'react'
import { useParams } from 'next/navigation'
import { StylistProfileScreen } from '@/components/stylist-profile-screen'
import { useStylistDetail } from '@/hooks/use-stylist-detail'
import { useStylistBookings } from '@/hooks/use-stylist-bookings'

export default function StylistDetailsContent() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const [bookingsPage, setBookingsPage] = useState(1)
  const [bookingsPageSize, setBookingsPageSize] = useState(10)

  const { data, loading, error } = useStylistDetail(id)
  const {
    rows: bookingRows,
    meta: bookingsMeta,
    isFetching: bookingsFetching,
  } = useStylistBookings(id, {
    page: bookingsPage,
    pageSize: bookingsPageSize,
  })

  const handleBookingsPageSizeChange = useCallback((size: number) => {
    setBookingsPage(1)
    setBookingsPageSize(size)
  }, [])

  const stylistBookingsFromApi =
    data && bookingsMeta
      ? {
          rows: bookingRows,
          pagination: {
            currentPage: bookingsPage,
            pageSize: bookingsPageSize,
            totalPages: bookingsMeta.totalPages,
            totalItemCount: bookingsMeta.total,
            onPageChange: setBookingsPage,
            onPageSizeChange: handleBookingsPageSizeChange,
          },
          tableLoading: Boolean(bookingsFetching && data),
        }
      : data
        ? {
            rows: bookingRows,
            pagination: null,
            tableLoading: Boolean(bookingsFetching),
          }
        : null

  return (
    <StylistProfileScreen
      stylistId={id}
      stylist={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      backHref="/dashboard/stylists"
      backAriaLabel="Back to stylists"
      showBookingActivityCard
      stylistBookingsFromApi={stylistBookingsFromApi}
    />
  )
}
