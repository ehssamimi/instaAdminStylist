import type {
  StylistApplicationListItem,
  StylistApplicationsListMeta,
  StylistApplicationsListResult,
} from "@/models/stylistApplication"

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null
}

function num(v: unknown, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Parses GET /admin/stylist/pending payloads: bare array, `{ data, meta }`,
 * `{ data, pagination }` (e.g. `pagination: { page, pageSize, total }`), or top-level totals.
 */
export function normalizeStylistApplicationsListResponse(
  raw: unknown
): StylistApplicationsListResult {
  if (Array.isArray(raw)) {
    const items = raw as StylistApplicationListItem[]
    const n = items.length
    return {
      data: items,
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

  const dataRaw = root.data
  const items = Array.isArray(dataRaw)
    ? (dataRaw as StylistApplicationListItem[])
    : []

  const paging =
    asRecord(root.meta) ?? asRecord(root.pagination)
  if (paging) {
    const pageSize = num(paging.pageSize ?? paging.perPage, 10)
    const total = num(paging.total, items.length)
    const totalPages = Math.max(
      1,
      num(
        paging.totalPages,
        Math.ceil(total / Math.max(1, pageSize || 10))
      )
    )
    const meta: StylistApplicationsListMeta = {
      page: num(paging.page, 1),
      pageSize: pageSize || 10,
      total,
      totalPages,
    }
    return { data: items, meta }
  }

  // e.g. `{ success, data: [...], total: 11 }` with no meta/pagination
  const pageSize = num(root.pageSize ?? root.perPage, 10)
  const total = num(root.total, items.length)
  const totalPages = Math.max(
    1,
    num(
      root.totalPages,
      Math.ceil(total / Math.max(1, pageSize || 10))
    )
  )
  return {
    data: items,
    meta: {
      page: num(root.page, 1),
      pageSize: pageSize || 10,
      total,
      totalPages,
    },
  }
}
