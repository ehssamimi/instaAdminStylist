"use client"

import {
  BookingActivitySection,
  type BookingActivitySectionProps,
} from "@/components/booking-activity-section"
import type { BookingRowDto } from "@/models/bookings"

export type StylistBookingActivityCardProps = {
  /** Full list; search + export run inside this component (same shape as bookings list API). */
  bookings: BookingRowDto[]
  /** When set, row clicks go to booking detail with `?from=stylist&stylistId=` for nested breadcrumbs */
  stylistId?: string
  /** Shown in the card heading */
  title?: string
  /** CSV download filename prefix (date appended automatically in export) */
  exportFileNamePrefix?: string
} & Pick<
  BookingActivitySectionProps,
  | "serverPagination"
  | "currentPage"
  | "pageSize"
  | "totalPages"
  | "totalItemCount"
  | "onPageChange"
  | "onPageSizeChange"
  | "isLoading"
>

export function StylistBookingActivityCard({
  bookings,
  stylistId,
  title = "Booking Activity",
  exportFileNamePrefix = "stylist_booking_activity",
  serverPagination,
  currentPage,
  pageSize,
  totalPages,
  totalItemCount,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: StylistBookingActivityCardProps) {
  const rowClickContext =
    stylistId != null && stylistId !== ""
      ? { kind: "stylist" as const, stylistId }
      : { kind: "plain" as const }

  return (
    <BookingActivitySection
      bookings={bookings}
      title={title}
      exportFileNamePrefix={exportFileNamePrefix}
      counterpartColumn="customer"
      costColumnHeader="Total Cost"
      rowClickContext={rowClickContext}
      serverPagination={serverPagination}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalItemCount={totalItemCount}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      isLoading={isLoading}
    />
  )
}
