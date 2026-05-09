import { z } from "zod"

export const adminReviewStatuses = ["pending", "approved", "rejected"] as const
export type AdminReviewStatus = (typeof adminReviewStatuses)[number]

export const adminReviewRowSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  date: z.string(),
  review: z.string(),
  rating: z.number().int().min(1).max(5),
  stylist: z.string(),
  status: z.enum(adminReviewStatuses),
})

export type AdminReviewRow = z.infer<typeof adminReviewRowSchema>

export type AdminReviewsListMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type AdminReviewsListNormalized = {
  data: AdminReviewRow[]
  meta: AdminReviewsListMeta
  statusCounts: Record<AdminReviewStatus, number>
}

