import { z } from "zod"

import type { CustomerDetailDto } from "@/models/customer"
import type { BookingRowDto } from "@/models/bookings"
import { normalizeAdminBookingListItem } from "@/models/bookings"
import {
  MOCK_ADMIN_BOOKING_ITEMS,
  MOCK_PROFILE_IMAGE_PATH,
} from "@/lib/mock-bookings"

export const customerRowSchema = z.object({
  id: z.string(),
  customer: z.string(),
  email: z.string(),
  total_bookings: z.number().int().min(0),
  /** ISO date `yyyy-MM-dd` */
  last_booking: z.string(),
})

export type CustomerRow = z.infer<typeof customerRowSchema>

export const mockCustomersSeed: CustomerRow[] = [
  {
    id: "cust-1",
    customer: "Charlotte White",
    email: "cw.johnson@example.com",
    total_bookings: 5,
    last_booking: "2026-03-10",
  },
  {
    id: "cust-2",
    customer: "James Rivera",
    email: "j.rivera@example.com",
    total_bookings: 5,
    last_booking: "2026-03-05",
  },
  {
    id: "cust-3",
    customer: "Amelia Chen",
    email: "amelia.chen@example.com",
    total_bookings: 2,
    last_booking: "2026-03-08",
  },
  {
    id: "cust-4",
    customer: "Marcus Thompson",
    email: "m.thompson@example.com",
    total_bookings: 3,
    last_booking: "2026-03-06",
  },
]

/** Non-overlapping slices of `MOCK_ADMIN_BOOKING_ITEMS` for each list customer (valid booking IDs). */
const CUSTOMER_DETAIL_RANGES: Record<string, [number, number]> = {
  "cust-1": [0, 5],
  "cust-2": [5, 10],
  "cust-3": [10, 12],
  "cust-4": [12, 15],
}

function sumCurrencyDisplay(costs: string[]): string {
  const n = costs.reduce((acc, c) => {
    const v = parseFloat(String(c).replace(/[^0-9.-]/g, ""))
    return acc + (Number.isFinite(v) ? v : 0)
  }, 0)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function bookingHistoryForCustomer(
  customerName: string,
  range: [number, number]
): BookingRowDto[] {
  const [start, end] = range
  return MOCK_ADMIN_BOOKING_ITEMS.slice(start, end).map((item) => {
    const row = normalizeAdminBookingListItem(item)
    const callType =
      row.call_type === "—" || !row.call_type?.trim() ? "Drop-in" : row.call_type
    return {
      ...row,
      customer: customerName,
      call_type: callType,
    }
  })
}

export function getMockCustomerDetail(id: string): CustomerDetailDto | null {
  const listRow = mockCustomersSeed.find((c) => c.id === id)
  const range = CUSTOMER_DETAIL_RANGES[id]
  if (!listRow || !range) return null

  const booking_history = bookingHistoryForCustomer(listRow.customer, range)
  const total_bookings = booking_history.length
  const total_spend = sumCurrencyDisplay(booking_history.map((b) => b.total_cost))

  return {
    id: listRow.id,
    name: listRow.customer,
    email: listRow.email,
    profile_picture: MOCK_PROFILE_IMAGE_PATH,
    total_bookings,
    total_spend,
    booking_history,
  }
}

export function filterCustomerRows(
  rows: CustomerRow[],
  query: string
): CustomerRow[] {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    const hay = [
      row.customer,
      row.email,
      String(row.total_bookings),
      row.last_booking,
    ]
      .join(" ")
      .toLowerCase()
    return hay.includes(q)
  })
}
