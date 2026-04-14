/**
 * Admin reports list — aligns with `GET /api/admin/reports`
 * (e.g. `?status=OPEN|REMOVED_USER|IGNORED&search=&page=1&pageSize=10`).
 */
export type ReportStatus = "OPEN" | "REMOVED_USER" | "IGNORED"

export type ReportUserType = "Stylist" | "Customer"

export interface AdminReportListItem {
  id: string
  reportedUserName: string
  userType: ReportUserType
  reasoning: string
  /** ISO date string (e.g. `2025-08-10`) */
  reportDate: string
  reportedByName: string
  status: ReportStatus
}

export interface AdminReportDetail extends AdminReportListItem {
  /** Optional extra fields when the API provides them */
  reportedUserId?: string
  reportedById?: string
  reportedUserEmail?: string
  reportedUserPhone?: string
  /** Square avatar for the reported user on the detail page */
  reportedUserAvatarUrl?: string | null
  /** Evidence images attached to the report */
  attachmentImageUrls?: string[]
}
