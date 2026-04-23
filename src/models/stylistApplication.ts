/** Application status returned by GET /admin/stylist/pending */
export type StylistApplicationApiStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"

/** Single row from `data[]` for GET /admin/stylist/pending */
export interface StylistApplicationListItem {
  userId: string
  firstName: string | null
  lastName: string | null
  yearsOfExperience: number | null
  /** Comma-separated labels from API */
  speciality: string | null
  status: StylistApplicationApiStatus
  rejectionReason: string | null
  updatedAt: string
  /** Optional email when API includes it (for search) */
  email?: string | null
}

export interface StylistApplicationsListMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/** Normalized list response (after parsing various API envelopes). */
export interface StylistApplicationsListResult {
  data: StylistApplicationListItem[]
  meta: StylistApplicationsListMeta
}
