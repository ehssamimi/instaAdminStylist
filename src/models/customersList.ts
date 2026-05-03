import { z } from "zod"

/** Table row for admin customers list (stable shape for DataTable / zod). */
export const customerRowSchema = z.object({
  id: z.string(),
  customer: z.string(),
  email: z.string(),
  total_bookings: z.number().int().min(0),
  /** ISO `yyyy-MM-dd` or empty when no last booking */
  last_booking: z.string(),
})

export type CustomerRow = z.infer<typeof customerRowSchema>

const adminUserRowSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  totalBookings: z.number(),
  lastBookingDate: z.string().nullable(),
})

const adminUsersListResponseSchema = z.object({
  data: z.array(adminUserRowSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
})

export type AdminUsersListNormalized = {
  data: CustomerRow[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function normalizeAdminUsersListResponse(
  raw: unknown
): AdminUsersListNormalized {
  const parsed = adminUsersListResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error("Invalid admin users list response")
  }
  const { data, pagination } = parsed.data
  const limit = Math.max(1, pagination.limit)
  const totalPages = Math.max(1, Math.ceil(pagination.total / limit))

  const rows: CustomerRow[] = data.map((row) => ({
    id: row.userId,
    customer: row.name?.trim() || "Unknown",
    email: row.email?.trim() || "",
    total_bookings: Number.isFinite(row.totalBookings)
      ? Math.max(0, Math.floor(row.totalBookings))
      : 0,
    last_booking: row.lastBookingDate?.trim() ?? "",
  }))

  return {
    data: rows,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
    },
  }
}
