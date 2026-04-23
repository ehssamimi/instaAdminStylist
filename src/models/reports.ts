/**
 * Admin reports list — aligns with `GET /api/admin/reports`
 * (e.g. `?status=OPEN&status=IGNORED&search=&page=1&pageSize=10`).
 */
export type ReportStatus = "OPEN" | "REMOVED_USER" | "IGNORED"

/** User block on each list row from the staging API. */
export interface AdminReportApiUserDto {
  id: string
  fullName: string
  imageUrl?: string
  email?: string
  phoneNumber?: string
  userType: string
}

/** One row from `GET https://…/api/admin/reports` (normalized in `@/lib/reports-normalize`). */
export interface AdminReportApiListItemDto {
  reportId: string
  reportedUser: AdminReportApiUserDto
  reportReason: string
  reportDate: string
  reportedBy: Pick<AdminReportApiUserDto, "id" | "fullName">
  status: ReportStatus
}

export interface AdminReportApiReasonDto {
  id: string
  text: string
}

/** Payload from `GET https://…/api/admin/reports/:reportId`. */
export interface AdminReportApiDetailDto {
  reportId: string
  status: ReportStatus
  reportDate: string
  reportedUser: AdminReportApiUserDto
  reportedBy: AdminReportApiUserDto
  sourceType: string
  sourceId: string
  reason: AdminReportApiReasonDto
  reasonText: string
  attachments: unknown[]
}

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
  reportedByAvatarUrl?: string | null
  /** Evidence images attached to the report */
  attachmentImageUrls?: string[]
  /** Related entity from API (e.g. `booking_scheduled`) */
  sourceType?: string
  sourceId?: string
}
