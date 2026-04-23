import type { ReportRow } from '@/lib/mock-reports'
import type {
  AdminReportDetail,
  ReportStatus,
  ReportUserType,
} from '@/models/reports'

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null
}

function num(v: unknown, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function pickString(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

function mapUserType(raw: string): ReportUserType {
  const u = raw.trim().toUpperCase()
  if (u === 'STYLIST' || u === 'STYLIST_USER') return 'Stylist'
  if (u === 'CUSTOMER' || u === 'USER' || u === 'CLIENT') return 'Customer'
  if (raw.trim().toLowerCase() === 'stylist') return 'Stylist'
  if (raw.trim().toLowerCase() === 'customer') return 'Customer'
  return 'Customer'
}

function mapStatus(v: unknown): ReportStatus {
  const s = typeof v === 'string' ? v.trim().toUpperCase() : ''
  if (s === 'OPEN' || s === 'IGNORED' || s === 'REMOVED_USER') return s
  return 'OPEN'
}

function unwrapReportDetailPayload(
  raw: unknown
): Record<string, unknown> | null {
  const r = asRecord(raw)
  if (!r) return null
  const inner = r.data ?? r.report
  const innerRec = asRecord(inner)
  if (innerRec) return innerRec
  return r
}

function normalizeReportAttachmentUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) {
      out.push(item.trim())
      continue
    }
    const rec = asRecord(item)
    if (rec) {
      const url = pickString(rec, ['url', 'imageUrl', 'image_url', 'src'])
      if (url) out.push(url)
    }
  }
  return out
}

function buildReasoningText(o: Record<string, unknown>): string {
  const reasonVal = o.reason
  let catalog = ''
  if (typeof reasonVal === 'string') {
    catalog = reasonVal.trim()
  } else {
    const reasonObj = asRecord(reasonVal)
    catalog = reasonObj ? pickString(reasonObj, ['text', 'label', 'title']) : ''
  }
  const freeform = pickString(o, ['reasonText', 'reason_text'])
  const combined = [catalog, freeform].filter(Boolean).join('\n\n')
  return combined || '—'
}

/**
 * Normalizes `GET /api/admin/reports/:id` (detail) into `AdminReportDetail`.
 */
export function normalizeAdminReportDetailFromApi(
  raw: unknown
): AdminReportDetail | null {
  const o = unwrapReportDetailPayload(raw)
  if (!o) return null

  const id = pickString(o, ['reportId', 'report_id', 'id'])
  if (!id) return null

  const reportedUser = asRecord(o.reportedUser ?? o.reported_user)
  const reportedBy = asRecord(o.reportedBy ?? o.reported_by)

  if (!reportedUser) return null

  const reportedUserName =
    pickString(reportedUser, ['fullName', 'full_name', 'name']) ||
    pickString(reportedUser, ['email']) ||
    '—'

  const userType = mapUserType(
    pickString(reportedUser, ['userType', 'user_type']) || 'CUSTOMER'
  )

  const reportedByName = reportedBy
    ? pickString(reportedBy, ['fullName', 'full_name', 'name']) ||
      pickString(reportedBy, ['email']) ||
      '—'
    : '—'

  const reportDate =
    pickString(o, ['reportDate', 'report_date', 'createdAt']) || '—'
  const status = mapStatus(o.status)

  const reportedUserAvatarRaw = pickString(reportedUser, [
    'imageUrl',
    'image_url',
    'avatarUrl',
  ])
  const reportedByAvatarRaw = reportedBy
    ? pickString(reportedBy, ['imageUrl', 'image_url', 'avatarUrl'])
    : ''

  const email =
    pickString(reportedUser, ['email']) || undefined
  const phoneRaw = pickString(reportedUser, ['phoneNumber', 'phone', 'phone_number'])
  const phone = phoneRaw || undefined

  const sourceType =
    pickString(o, ['sourceType', 'source_type']) || undefined
  const sourceId =
    pickString(o, ['sourceId', 'source_id']) || undefined

  return {
    id,
    reportedUserName,
    userType,
    reasoning: buildReasoningText(o),
    reportDate,
    reportedByName,
    status,
    reportedUserId:
      pickString(reportedUser, ['id']) || undefined,
    reportedById: reportedBy
      ? pickString(reportedBy, ['id']) || undefined
      : undefined,
    reportedUserEmail: email,
    reportedUserPhone: phone,
    reportedUserAvatarUrl: reportedUserAvatarRaw || null,
    reportedByAvatarUrl: reportedByAvatarRaw || null,
    attachmentImageUrls: normalizeReportAttachmentUrls(
      o.attachments ?? o.attachmentImageUrls ?? o.attachment_urls
    ),
    sourceType,
    sourceId,
  }
}

/**
 * Normalizes one list row from `GET /api/admin/reports` (camelCase API shape).
 */
export function normalizeAdminReportListItemToRow(raw: unknown): ReportRow | null {
  const o = asRecord(raw)
  if (!o) return null

  const id = pickString(o, ['reportId', 'report_id', 'id'])
  if (!id) return null

  const reportedUser = asRecord(o.reportedUser ?? o.reported_user)
  const reportedBy = asRecord(o.reportedBy ?? o.reported_by)

  const reported_user =
    reportedUser != null
      ? pickString(reportedUser, ['fullName', 'full_name', 'name']) ||
        pickString(reportedUser, ['email'])
      : pickString(o, ['reportedUserName', 'reported_user_name'])

  const user_type: ReportUserType = reportedUser
    ? mapUserType(
        pickString(reportedUser, ['userType', 'user_type']) || 'CUSTOMER'
      )
    : mapUserType(pickString(o, ['userType', 'user_type']) || 'CUSTOMER')

  const reasoning =
    pickString(o, ['reportReason', 'report_reason', 'reasoning', 'reason']) ||
    '—'

  const report_date =
    pickString(o, ['reportDate', 'report_date', 'createdAt']) || ''

  const reported_by =
    reportedBy != null
      ? pickString(reportedBy, ['fullName', 'full_name', 'name']) ||
        pickString(reportedBy, ['email'])
      : pickString(o, ['reportedByName', 'reported_by_name'])

  const status = mapStatus(o.status)

  if (!reported_user && !reasoning) return null

  return {
    id,
    reported_user: reported_user || '—',
    user_type,
    reasoning,
    report_date: report_date || '—',
    reported_by: reported_by || '—',
    status,
  }
}

export type AdminReportsListMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type AdminReportsListNormalized = {
  data: ReportRow[]
  meta: AdminReportsListMeta
}

/**
 * Parses list payloads: `{ data, metadata | meta | pagination }`, top-level totals, or a bare array.
 */
export function normalizeAdminReportsListResponse(
  raw: unknown
): AdminReportsListNormalized {
  if (Array.isArray(raw)) {
    const data = raw
      .map(normalizeAdminReportListItemToRow)
      .filter((r): r is ReportRow => r != null)
    const n = data.length
    return {
      data,
      meta: {
        page: 1,
        pageSize: n || 10,
        total: n,
        totalPages: 1,
      },
    }
  }

  const root = asRecord(raw)
  if (!root) {
    return {
      data: [],
      meta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
    }
  }

  const dataRaw = root.data ?? root.reports ?? root.items
  const rows = Array.isArray(dataRaw)
    ? dataRaw
        .map(normalizeAdminReportListItemToRow)
        .filter((r): r is ReportRow => r != null)
    : []

  const paging =
    asRecord(root.metadata) ?? asRecord(root.meta) ?? asRecord(root.pagination)
  if (paging) {
    const pageSize = num(paging.pageSize ?? paging.limit ?? paging.perPage, 10)
    const total = num(paging.total, rows.length)
    const totalPages = Math.max(
      1,
      num(
        paging.totalPages,
        Math.ceil(total / Math.max(1, pageSize || 10))
      )
    )
    return {
      data: rows,
      meta: {
        page: num(paging.page, 1),
        pageSize: pageSize || 10,
        total,
        totalPages,
      },
    }
  }

  const pageSize = num(root.pageSize ?? root.limit ?? root.perPage, 10)
  const total = num(root.total, rows.length)
  const totalPages = Math.max(
    1,
    num(root.totalPages, Math.ceil(total / Math.max(1, pageSize || 10)))
  )
  return {
    data: rows,
    meta: {
      page: num(root.page, 1),
      pageSize: pageSize || 10,
      total,
      totalPages,
    },
  }
}
