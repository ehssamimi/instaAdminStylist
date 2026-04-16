import { z } from "zod"

export const userReviewRowSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  /** ISO date or yyyy-MM-dd */
  date: z.string(),
  review: z.string(),
  rating: z.number().int().min(1).max(5),
  stylist: z.string(),
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
  },
  {
    id: "rev-3",
    last_name: "Williams",
    first_name: "Emily",
    date: "2025-10-10",
    review: "Great attention to detail and very professional session.",
    rating: 5,
    stylist: "Arjun Patel",
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
  },
  {
    id: "rev-5",
    last_name: "Davis",
    first_name: "Lisa",
    date: "2025-10-08",
    review: "Would book again — the styling matched my brief perfectly.",
    rating: 5,
    stylist: "Sarah Chen",
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
