import { z } from "zod"

export const userReviewStatuses = ["pending", "approved", "rejected"] as const
export type UserReviewStatus = (typeof userReviewStatuses)[number]

export const userReviewRowSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  /** ISO date or yyyy-MM-dd */
  date: z.string(),
  review: z.string(),
  rating: z.number().int().min(1).max(5),
  stylist: z.string(),
  status: z.enum(userReviewStatuses),
})

export type UserReviewRow = z.infer<typeof userReviewRowSchema>

export const mockUserReviewsSeed: UserReviewRow[] = [
  {
    id: "rev-1",
    last_name: "Smith",
    first_name: "Jane",
    date: "2025-10-12",
    review: "The formal outfit was stunning and I felt so confident.",
    rating: 5,
    stylist: "Arjun Patel",
    status: "pending",
  },
  {
    id: "rev-2",
    last_name: "Johnson",
    first_name: "Michael",
    date: "2025-10-11",
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    rating: 4,
    stylist: "Sarah Chen",
    status: "pending",
  },
  {
    id: "rev-3",
    last_name: "Williams",
    first_name: "Emily",
    date: "2025-10-10",
    review: "Great attention to detail and very professional session.",
    rating: 5,
    stylist: "Arjun Patel",
    status: "pending",
  },
  {
    id: "rev-4",
    last_name: "Brown",
    first_name: "David",
    date: "2025-10-09",
    review:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    rating: 3,
    stylist: "Maya Rodriguez",
    status: "approved",
  },
  {
    id: "rev-5",
    last_name: "Davis",
    first_name: "Lisa",
    date: "2025-10-08",
    review: "Would book again — the styling matched my brief perfectly.",
    rating: 5,
    stylist: "Sarah Chen",
    status: "approved",
  },
  {
    id: "rev-6",
    last_name: "Garcia",
    first_name: "Maria",
    date: "2025-10-07",
    review: "Loved the color palette suggestions and quick turnaround.",
    rating: 5,
    stylist: "Arjun Patel",
    status: "approved",
  },
  {
    id: "rev-7",
    last_name: "Miller",
    first_name: "James",
    date: "2025-10-06",
    review:
      "Session started late and communication could have been clearer beforehand.",
    rating: 2,
    stylist: "Maya Rodriguez",
    status: "rejected",
  },
  {
    id: "rev-8",
    last_name: "Wilson",
    first_name: "Anna",
    date: "2025-10-05",
    review: "Outfit did not match what we discussed in the intake form.",
    rating: 2,
    stylist: "Sarah Chen",
    status: "rejected",
  },
]

export function filterUserReviewRows(
  rows: UserReviewRow[],
  query: string
): UserReviewRow[] {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    const hay = [
      row.last_name,
      row.first_name,
      row.review,
      row.stylist,
      String(row.rating),
      row.date,
    ]
      .join(" ")
      .toLowerCase()
    return hay.includes(q)
  })
}

export function countReviewsByStatus(rows: UserReviewRow[]): {
  pending: number
  approved: number
  rejected: number
} {
  return rows.reduce(
    (acc, row) => {
      acc[row.status] += 1
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 }
  )
}
