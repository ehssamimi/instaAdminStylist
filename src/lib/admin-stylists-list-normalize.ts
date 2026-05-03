import type { StylistRowDto, StylistsListResponse } from '@/models/stylists'

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null
}

function num(v: unknown, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function coalesceStr(v: unknown): string | null {
  if (v == null) return null
  if (typeof v === 'string') {
    const t = v.trim()
    return t.length ? t : null
  }
  return null
}

function formatCurrencyUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatSpeciality(raw: unknown): string {
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t || '—'
  }
  if (!Array.isArray(raw)) return '—'
  const parts: string[] = []
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) {
      parts.push(item.trim())
      continue
    }
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const label =
        coalesceStr(o.label) ??
        coalesceStr(o.option) ??
        coalesceStr(o.name) ??
        coalesceStr(o.key)
      if (label) parts.push(label)
    }
  }
  return parts.length ? parts.join(', ') : '—'
}

function formatScalarDisplay(raw: unknown): string {
  if (raw == null) return '—'
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw)
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  return '—'
}

function mapTotalRevenue(raw: Record<string, unknown>): string {
  const v =
    raw.total_revenue ??
    raw.totalRevenue ??
    raw.total_sales ??
    raw.totalSales
  if (typeof v === 'number' && Number.isFinite(v)) return formatCurrencyUsd(v)
  const s = coalesceStr(v)
  return s ?? '—'
}

function pickNonNegativeInt(...vals: unknown[]): number {
  for (const v of vals) {
    const n = Number(v)
    if (Number.isFinite(n)) return Math.max(0, Math.round(n))
  }
  return 0
}

function mapListItem(raw: unknown): StylistRowDto | null {
  const rec = asRecord(raw)
  if (!rec) return null
  const id =
    coalesceStr(rec.stylistId) ??
    coalesceStr(rec.id)
  if (!id) return null

  const first =
    coalesceStr(rec.first_name) ??
    coalesceStr(rec.firstName) ??
    ''
  const last =
    coalesceStr(rec.last_name) ??
    coalesceStr(rec.lastName) ??
    ''

  const profile_picture =
    coalesceStr(rec.profile_picture) ??
    coalesceStr(rec.profilePicture) ??
    coalesceStr(rec.imageUrl) ??
    null

  const bookings = pickNonNegativeInt(
    rec.bookings,
    rec.totalBookings,
    rec.totalCompletedBookings
  )

  return {
    id,
    profile_picture,
    first_name: first || '—',
    last_name: last || '',
    speciality: formatSpeciality(
      rec.speciality ?? rec.specialty ?? rec.specialties
    ),
    bookings,
    total_revenue: mapTotalRevenue(rec),
    stylist_since: formatScalarDisplay(
      rec.stylist_since ?? rec.stylistSince ?? rec.memberSince
    ),
    avg_weekly_availability: formatScalarDisplay(
      rec.avg_weekly_availability ?? rec.avgWeeklyAvailability
    ),
    avg_weekly_drop_in: formatScalarDisplay(
      rec.avg_weekly_drop_in ?? rec.avgWeeklyDropIn
    ),
  }
}

function parseMeta(
  root: Record<string, unknown>,
  rows: StylistRowDto[],
  fallbackLimit: number
): StylistsListResponse['meta'] {
  const m =
    asRecord(root.meta) ??
    asRecord(root.metadata) ??
    asRecord(root.pagination)
  const page = m ? num(m.page, 1) : 1
  const perPage = m
    ? num(m.limit ?? m.perPage ?? m.pageSize, fallbackLimit)
    : fallbackLimit
  const total = m ? num(m.total ?? m.totalCount, rows.length) : rows.length
  let totalPages = m
    ? num(m.totalPages ?? m.total_page ?? m.total_pages, 0)
    : 0
  if (!totalPages && perPage > 0) {
    totalPages = Math.max(1, Math.ceil(total / perPage))
  }
  if (!totalPages) totalPages = 1
  return {
    page: page > 0 ? page : 1,
    perPage: perPage > 0 ? perPage : fallbackLimit,
    total: total >= 0 ? total : 0,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

/**
 * Normalizes `GET /api/admin/stylists` payloads.
 *
 * Known shapes:
 * - Rows: `stylistId`, `firstName`, `lastName`, `profilePicture`, `specialty`, `totalBookings`,
 *   `totalSales`, `stylistSince`, `avgWeeklyAvailability`, `avgWeeklyDropIn` (and snake_case variants).
 * - Paging: `{ data, pagination: { page, limit, total } }` — `totalPages` is derived when omitted.
 */
export function normalizeAdminStylistsListResponse(
  raw: unknown,
  requestLimitFallback = 10
): StylistsListResponse {
  const root = asRecord(raw)
  if (!root || root.success === false) {
    return {
      success: false,
      data: [],
      meta: {
        page: 1,
        perPage: requestLimitFallback,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }

  const dataRaw = root.data
  const rows: StylistRowDto[] = Array.isArray(dataRaw)
    ? (dataRaw.map(mapListItem).filter(Boolean) as StylistRowDto[])
    : []

  return {
    success: true,
    data: rows,
    meta: parseMeta(root, rows, requestLimitFallback),
  }
}
