import type {
  StylistApplicationApiStatus,
  StylistApplicationListItem,
  StylistApplicationsListResult,
} from "@/models/stylistApplication"
import type { StylistApplicationsQueryParams } from "@/lib/api"

const API_STATUS_BY_QUERY: Record<
  StylistApplicationsQueryParams["status"],
  StylistApplicationApiStatus
> = {
  review: "PENDING_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
}

export const MOCK_STYLIST_APPLICATION_ROWS: StylistApplicationListItem[] = [
  {
    userId: "user-1",
    firstName: "Jane",
    lastName: "Smith",
    yearsOfExperience: 7,
    speciality: "High fashion/editorial, Special events/weddings",
    status: "PENDING_REVIEW",
    rejectionReason: null,
    updatedAt: "2026-03-20T12:00:00.000Z",
    email: "jane.smith@example.com",
  },
  {
    userId: "user-2",
    firstName: "Alex",
    lastName: "Rivera",
    yearsOfExperience: 3,
    speciality: "Corporate/Professional Attire",
    status: "APPROVED",
    rejectionReason: null,
    updatedAt: "2026-03-18T09:30:00.000Z",
    email: "alex.r@example.com",
  },
  {
    userId: "user-3",
    firstName: "Sam",
    lastName: "Lee",
    yearsOfExperience: 1,
    speciality: "Capsule Wardrobes",
    status: "REJECTED",
    rejectionReason: "Incomplete profile",
    updatedAt: "2026-03-15T14:00:00.000Z",
    email: "sam.lee@example.com",
  },
]

function matchesSearch(row: StylistApplicationListItem, q: string): boolean {
  if (!q) return true
  const hay = [
    row.firstName,
    row.lastName,
    row.speciality,
    row.email,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  return hay.includes(q)
}

/** Offline / error fallback: same filtering semantics as the live API. */
export function getMockStylistApplicationsPage(
  params: StylistApplicationsQueryParams
): StylistApplicationsListResult {
  const want = API_STATUS_BY_QUERY[params.status]
  const q = params.search?.trim().toLowerCase() ?? ""
  const filtered = MOCK_STYLIST_APPLICATION_ROWS.filter(
    (r) => r.status === want && matchesSearch(r, q)
  )
  const pageSize = Math.max(1, params.pageSize)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, params.page), totalPages)
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)
  return {
    data,
    meta: { page, pageSize, total, totalPages },
  }
}
