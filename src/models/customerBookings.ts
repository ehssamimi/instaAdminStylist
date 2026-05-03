import { z } from "zod"

import type { CustomerDetailDto } from "@/models/customer"
import type { BookingRowDto } from "@/models/bookings"

const apiBookingItemSchema = z.object({
  bookingId: z.string(),
  date: z.string(),
  duration: z.string(),
  cost: z.number(),
  currency: z.string(),
  stylistName: z.string(),
  callType: z.string(),
  status: z.string(),
})

const customerBookingsResponseSchema = z.object({
  user: z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
    profilePicture: z.string().nullable().optional(),
  }),
  summary: z.object({
    totalBookings: z.number(),
    totalSpend: z.number(),
  }),
  data: z.array(apiBookingItemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
})

export type CustomerBookingsPageMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type CustomerBookingsPageResult = {
  customer: CustomerDetailDto
  meta: CustomerBookingsPageMeta
}

function formatCurrency(amount: number, currency: string): string {
  const c = currency?.trim() || "USD"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
  }).format(amount)
}

function formatCallTypeLabel(raw: string): string {
  const s = raw.trim()
  if (!s) return "—"
  const withSpaces = s.replace(/_/g, " ").toLowerCase()
  return withSpaces.replace(/\b\w/g, (ch) => ch.toUpperCase())
}

function mapRow(
  item: z.infer<typeof apiBookingItemSchema>,
  customerName: string
): BookingRowDto {
  const currency = item.currency?.trim() || "USD"
  return {
    id: item.bookingId,
    booking_id: item.bookingId,
    date: item.date,
    stylist: item.stylistName?.trim() || "—",
    customer: customerName,
    duration: item.duration?.trim() || "—",
    total_cost: formatCurrency(item.cost, currency),
    service_fee: "—",
    call_type: formatCallTypeLabel(item.callType),
    status: item.status,
  }
}

/**
 * `GET /api/admin/users/:userId/bookings` — builds profile header + booking rows for the DataTable.
 */
export function normalizeCustomerBookingsPage(raw: unknown): CustomerBookingsPageResult {
  const parsed = customerBookingsResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error("Invalid customer bookings response")
  }
  const { user, summary, data, pagination } = parsed.data

  const limit = Math.max(1, pagination.limit)
  const totalPages = Math.max(1, Math.ceil(pagination.total / limit))

  const customerDisplayName = user.name?.trim() || "Unknown"
  const currencyHint =
    data.find((d) => d.currency?.trim())?.currency?.trim() ?? "USD"

  const customer: CustomerDetailDto = {
    id: user.userId,
    name: customerDisplayName,
    email: user.email?.trim() ?? "",
    profile_picture: user.profilePicture ?? null,
    total_bookings: Math.max(0, Math.floor(summary.totalBookings)),
    total_spend: formatCurrency(summary.totalSpend, currencyHint),
    booking_history: data.map((row) => mapRow(row, customerDisplayName)),
  }

  return {
    customer,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
    },
  }
}
