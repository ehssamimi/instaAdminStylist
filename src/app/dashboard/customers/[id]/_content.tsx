"use client"

import { useCallback, useState } from "react"
import { useParams } from "next/navigation"

import { CustomerProfilePageView } from "@/components/customer-profile-page-view"
import { useCustomerDetail } from "@/hooks/use-customer-detail"
import { getApiErrorMessage } from "@/lib/api"

export default function CustomerDetailsContent() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""

  const [bookingsPage, setBookingsPage] = useState(1)
  const [bookingsPageSize, setBookingsPageSize] = useState(10)

  const {
    customer,
    bookingsMeta,
    loading,
    isFetching,
    error,
    refetch,
  } = useCustomerDetail(id, {
    page: bookingsPage,
    pageSize: bookingsPageSize,
  })

  const handleBookingsPageSizeChange = useCallback((size: number) => {
    setBookingsPage(1)
    setBookingsPageSize(size)
  }, [])

  const bookingsPagination =
    customer && bookingsMeta
      ? {
          currentPage: bookingsPage,
          pageSize: bookingsPageSize,
          totalPages: bookingsMeta.totalPages,
          totalItemCount: bookingsMeta.total,
          onPageChange: setBookingsPage,
          onPageSizeChange: handleBookingsPageSizeChange,
        }
      : null

  return (
    <CustomerProfilePageView
      customer={customer}
      loading={loading}
      errorMessage={error ? getApiErrorMessage(error) : null}
      onRetry={error ? () => void refetch() : undefined}
      backHref="/dashboard/customers"
      backAriaLabel="Back to customers"
      bookingsPagination={bookingsPagination}
      bookingsTableLoading={Boolean(isFetching && customer)}
    />
  )
}
