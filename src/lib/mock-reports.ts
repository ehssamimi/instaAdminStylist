import { z } from "zod"

import type { AdminReportDetail, AdminReportListItem, ReportStatus } from "@/models/reports"

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur. Lobortis ac sed tristique dui. Mollis cursus lacinia non quis sapien a nibh."

const LOREM_LONG =
  "Inappropriate behavior during a session; the stylist arrived late and used language that made the customer uncomfortable. " +
  "Customer requests follow-up from support."

export const reportRowSchema = z.object({
  id: z.string(),
  reported_user: z.string(),
  user_type: z.enum(["Stylist", "Customer"]),
  reasoning: z.string(),
  report_date: z.string(),
  reported_by: z.string(),
  status: z.enum(["OPEN", "REMOVED_USER", "IGNORED"]),
})

export type ReportRow = z.infer<typeof reportRowSchema>

function toRow(item: AdminReportListItem): ReportRow {
  return {
    id: item.id,
    reported_user: item.reportedUserName,
    user_type: item.userType,
    reasoning: item.reasoning,
    report_date: item.reportDate,
    reported_by: item.reportedByName,
    status: item.status,
  }
}

/** Canonical mock dataset — replace with API normalization when backend is ready. */
export const MOCK_ADMIN_REPORT_ITEMS: AdminReportDetail[] = [
  {
    id: "rep-open-001",
    reportedUserName: "Jane Smith",
    userType: "Stylist",
    reasoning: LOREM_SHORT,
    reportDate: "2025-08-10",
    reportedByName: "John Williams",
    status: "OPEN",
    reportedUserId: "user-stylist-1",
    reportedById: "user-cust-1",
    reportedUserEmail: "Jane@yahoo.com",
    reportedUserPhone: "+543516410737",
    reportedUserAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    attachmentImageUrls: [
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b24?w=640&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=400&fit=crop",
    ],
  },
  {
    id: "rep-open-002",
    reportedUserName: "John Doe",
    userType: "Customer",
    reasoning: LOREM_LONG,
    reportDate: "2025-08-12",
    reportedByName: "Sophia Williams",
    status: "OPEN",
  },
  {
    id: "rep-open-003",
    reportedUserName: "Mark Johnson",
    userType: "Stylist",
    reasoning: "Repeated no-shows and unprofessional messages in chat.",
    reportDate: "2025-08-15",
    reportedByName: "Emma Wilson",
    status: "OPEN",
  },
  {
    id: "rep-removed-001",
    reportedUserName: "Alex Rivera",
    userType: "Customer",
    reasoning: "Suspected fraudulent payment activity reported by stylist.",
    reportDate: "2025-07-22",
    reportedByName: "Jane Smith",
    status: "REMOVED_USER",
  },
  {
    id: "rep-removed-002",
    reportedUserName: "Chris Lee",
    userType: "Stylist",
    reasoning: "Multiple verified policy violations after warnings.",
    reportDate: "2025-07-30",
    reportedByName: "Noah Davis",
    status: "REMOVED_USER",
  },
  {
    id: "rep-removed-003",
    reportedUserName: "Taylor Morgan",
    userType: "Customer",
    reasoning: "Harassment toward stylists via in-app messages.",
    reportDate: "2025-08-01",
    reportedByName: "Charlotte White",
    status: "REMOVED_USER",
  },
  {
    id: "rep-ignored-001",
    reportedUserName: "Jamie Chen",
    userType: "Stylist",
    reasoning: "Minor misunderstanding; reporter withdrew the complaint.",
    reportDate: "2025-06-18",
    reportedByName: "John Williams",
    status: "IGNORED",
  },
  {
    id: "rep-ignored-002",
    reportedUserName: "Pat Kelly",
    userType: "Customer",
    reasoning: "Duplicate report — already handled in ticket #4421.",
    reportDate: "2025-07-05",
    reportedByName: "Sophia Williams",
    status: "IGNORED",
  },
]

export function getMockReportDetailById(id: string): AdminReportDetail | null {
  return MOCK_ADMIN_REPORT_ITEMS.find((r) => r.id === id) ?? null
}

export function filterAndPaginateMockReports(params: {
  status: ReportStatus
  search: string
  page: number
  pageSize: number
}): { rows: ReportRow[]; total: number; totalPages: number } {
  const q = params.search.trim().toLowerCase()
  let list = MOCK_ADMIN_REPORT_ITEMS.filter((r) => r.status === params.status)

  if (q) {
    list = list.filter((r) => {
      const hay = [
        r.reportedUserName,
        r.userType,
        r.reasoning,
        r.reportedByName,
        r.reportDate,
      ]
        .join(" ")
        .toLowerCase()
      return hay.includes(q)
    })
  }

  const total = list.length
  const totalPages =
    total === 0 ? 1 : Math.max(1, Math.ceil(total / params.pageSize))
  const page = Math.min(Math.max(1, params.page), totalPages)
  const start = (page - 1) * params.pageSize
  const slice = list.slice(start, start + params.pageSize)

  return {
    rows: slice.map(toRow),
    total,
    totalPages,
  }
}
