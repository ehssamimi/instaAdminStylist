import type { AdminBookingListItem, BookingDetailDto } from "@/models/bookings"
import {
  normalizeAdminBookingListItem,
  normalizeBookingDetailFromApi,
} from "@/models/bookings"

import type { BookingRow } from "@/lib/booking-schema"
import { formatDurationLabel } from "@/lib/booking-format"
export type { BookingRow } from "@/lib/booking-schema"

/** Served from `public/mock/profile.jpg` */
export const MOCK_PROFILE_IMAGE_PATH = "/mock/profile.jpg"

const LOREM_BOOKING_DETAILS =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

const LOREM_WHAT_YOU_NEED =
  "Bring a few outfit options you already own, good lighting near your device, and a quiet spot for the session. Have a pen ready for notes."

/**
 * Raw list rows in the same shape as the stage admin bookings API (see `AdminBookingListItem`).
 * Stylist names align with MOCK_STYLISTS for profile `booking_history`.
 */
export const MOCK_ADMIN_BOOKING_ITEMS: AdminBookingListItem[] = [
  {
    bookingId: "bcc7c225-62f7-43d3-9c01-5829fbe6482e",
    stringId: "ZWSVDK",
    date: "2026-03-10 10:00:00",
    stylistName: "Jane Smith",
    customerName: "Charlotte White",
    duration: 10,
    totalCost: 50,
    serviceFee: 15,
    currency: "USD",
    status: "pending_payment",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111101",
    stringId: "BKJ001",
    date: "2026-03-09 14:30:00",
    stylistName: "Mark Johnson",
    customerName: "Noah Davis",
    duration: 30,
    totalCost: 150,
    serviceFee: 45,
    currency: "USD",
    status: "scheduled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111102",
    stringId: "BKJ002",
    date: "2026-03-08 11:00:00",
    stylistName: "Sophia Williams",
    customerName: "Emma Wilson",
    duration: 45,
    totalCost: 200,
    serviceFee: 60,
    currency: "USD",
    status: "canceled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111103",
    stringId: "BKJ003",
    date: "2026-03-07 09:15:00",
    stylistName: "Sam Patel",
    customerName: "Liam Chen",
    duration: 20,
    totalCost: 80,
    serviceFee: 24,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111104",
    stringId: "BKJ004",
    date: "2026-03-06 16:45:00",
    stylistName: "Amara Okafor",
    customerName: "Olivia Brown",
    duration: 15,
    totalCost: 65,
    serviceFee: 19,
    currency: "USD",
    status: "scheduled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111105",
    stringId: "BKJ005",
    date: "2026-03-05 10:00:00",
    stylistName: "Derek Nguyen",
    customerName: "James Carter",
    duration: 60,
    totalCost: 250,
    serviceFee: 75,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111106",
    stringId: "BKJ006",
    date: "2026-03-04 13:20:00",
    stylistName: "Priya Mehta",
    customerName: "Sophia Lee",
    duration: 30,
    totalCost: 150,
    serviceFee: 45,
    currency: "USD",
    status: "canceled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111107",
    stringId: "BKJ007",
    date: "2026-03-03 08:00:00",
    stylistName: "Taylor Brooks",
    customerName: "Ethan Hall",
    duration: 10,
    totalCost: 50,
    serviceFee: 15,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111108",
    stringId: "BKJ008",
    date: "2026-03-02 15:10:00",
    stylistName: "Isabelle Fontaine",
    customerName: "Ava Thompson",
    duration: 25,
    totalCost: 95,
    serviceFee: 28,
    currency: "USD",
    status: "scheduled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111109",
    stringId: "BKJ009",
    date: "2026-03-01 12:00:00",
    stylistName: "Marcus Hall",
    customerName: "Benjamin Scott",
    duration: 40,
    totalCost: 180,
    serviceFee: 54,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111110",
    stringId: "BKJ010",
    date: "2026-02-28 17:30:00",
    stylistName: "Chloe Dubois",
    customerName: "Harper Young",
    duration: 15,
    totalCost: 70,
    serviceFee: 21,
    currency: "USD",
    status: "canceled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111111",
    stringId: "BKJ011",
    date: "2026-02-27 11:45:00",
    stylistName: "Ethan Brooks",
    customerName: "Daniel Moore",
    duration: 35,
    totalCost: 165,
    serviceFee: 49,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111112",
    stringId: "BKJ012",
    date: "2026-02-26 09:30:00",
    stylistName: "Jane Smith",
    customerName: "Nina Patel",
    duration: 20,
    totalCost: 90,
    serviceFee: 27,
    currency: "USD",
    status: "scheduled",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111113",
    stringId: "BKJ013",
    date: "2026-02-25 14:00:00",
    stylistName: "Jane Smith",
    customerName: "Ryan Cole",
    duration: 45,
    totalCost: 195,
    serviceFee: 58,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111114",
    stringId: "BKJ014",
    date: "2026-02-24 10:15:00",
    stylistName: "Mark Johnson",
    customerName: "Elena Park",
    duration: 25,
    totalCost: 110,
    serviceFee: 33,
    currency: "USD",
    status: "completed",
  },
  {
    bookingId: "a1111111-1111-4111-8111-111111111115",
    stringId: "BKJ015",
    date: "2026-02-23 16:00:00",
    stylistName: "Mark Johnson",
    customerName: "Chris Allen",
    duration: 30,
    totalCost: 145,
    serviceFee: 43,
    currency: "USD",
    status: "canceled",
  },
]

/** Normalized rows for tables and stylist booking activity (same as list after API mapping). */
export const MOCK_BOOKINGS: BookingRow[] = MOCK_ADMIN_BOOKING_ITEMS.map(
  normalizeAdminBookingListItem
)

/**
 * Enriches a list row with mock detail-only fields until a booking API exists.
 */
/** Rows for a stylist profile; same shape as the main bookings list. */
export function getMockBookingRowsForStylist(fullName: string): BookingRow[] {
  return MOCK_ADMIN_BOOKING_ITEMS.filter((b) => b.stylistName === fullName).map(
    normalizeAdminBookingListItem
  )
}

export function getMockBookingDetail(id: string): BookingDetailDto | null {
  const item =
    MOCK_ADMIN_BOOKING_ITEMS.find((b) => b.bookingId === id) ??
    MOCK_ADMIN_BOOKING_ITEMS.find((b) => b.stringId === id)
  if (!item) return null
  const row = normalizeAdminBookingListItem(item)

  const customerSlug = row.customer.toLowerCase().replace(/\s+/g, "")
  const stylistFirst = row.stylist.split(" ")[0]?.toLowerCase() ?? "stylist"

  const customerEmail =
    row.customer === "Charlotte White"
      ? "charlottewhite@gmail.com"
      : `${customerSlug}@gmail.com`
  const stylistEmail = `${stylistFirst}@gmail.com`

  return normalizeBookingDetailFromApi({
    bookingId: item.bookingId,
    stringId: item.stringId,
    status: item.status,
    date: item.date,
    customer: { name: row.customer, email: customerEmail },
    stylist: { name: row.stylist, email: stylistEmail },
    callDuration: item.duration,
    currency: item.currency,
    totalCost: item.totalCost,
    serviceFee: item.serviceFee,
    bookingDetails: [
      {
        question: "What should we know for this session?",
        answer: LOREM_BOOKING_DETAILS,
      },
    ],
    rating: row.status === "completed" ? 4 : null,
    publicReview:
      row.status === "completed"
        ? "Arnol was very professional and gave me great tips for styling my hair at home. The session was easy to follow and very helpful."
        : null,
    privateFeedback:
      row.status === "completed"
        ? "It would be great to have more lighting during the call — it was a bit hard to see some details clearly."
        : null,
    whatYouWillNeed: LOREM_WHAT_YOU_NEED,
  })
}
