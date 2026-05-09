import type {
  AdminReviewRow,
  AdminReviewsListNormalized,
  AdminReviewStatus,
} from "@/models/adminReviews"

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === "object" && !Array.isArray(v)
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
    if (typeof v === "string" && v.trim()) return v.trim()
  }
  return ""
}

export function normalizeAdminReviewStatus(raw: unknown): AdminReviewStatus {
  const s = typeof raw === "string" ? raw.trim().toUpperCase() : ""
  if (s === "APPROVED") return "approved"
  if (s === "REJECTED") return "rejected"
  return "pending"
}

export function normalizeAdminReviewListItem(
  raw: unknown
): AdminReviewRow | null {
  const o = asRecord(raw)
  if (!o) return null

  const id = pickString(o, ["reviewId", "review_id", "id"])
  if (!id) return null

  const firstName = pickString(o, ["firstName", "first_name"])
  const lastName = pickString(o, ["lastName", "last_name"])
  const review = pickString(o, ["review", "publicReview", "public_review"])
  const stylist = pickString(o, ["stylistName", "stylist_name", "stylist"])
  const date = pickString(o, ["date", "createdAt", "created_at"])
  const rating = Math.max(1, Math.min(5, Math.round(num(o.rating, 1))))

  return {
    id,
    last_name: lastName || "-",
    first_name: firstName || "-",
    date: date || "-",
    review: review || "-",
    rating,
    stylist: stylist || "-",
    status: normalizeAdminReviewStatus(o.status),
  }
}

function extractStatusCounts(
  root: Record<string, unknown>
): Record<AdminReviewStatus, number> {
  const sc = asRecord(root.statusCounts)
  return {
    pending: num(sc?.pending, 0),
    approved: num(sc?.approved, 0),
    rejected: num(sc?.rejected, 0),
  }
}

export function normalizeAdminReviewsListResponse(
  raw: unknown
): AdminReviewsListNormalized {
  const fallback: AdminReviewsListNormalized = {
    data: [],
    meta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
    statusCounts: { pending: 0, approved: 0, rejected: 0 },
  }

  if (Array.isArray(raw)) {
    const data = raw
      .map(normalizeAdminReviewListItem)
      .filter((r): r is AdminReviewRow => r != null)
    const n = data.length
    return {
      data,
      meta: { page: 1, pageSize: n || 10, total: n, totalPages: 1 },
      statusCounts: { pending: 0, approved: 0, rejected: 0 },
    }
  }

  const root = asRecord(raw)
  if (!root) return fallback

  const dataRaw = root.data ?? root.reviews ?? root.items
  const data = Array.isArray(dataRaw)
    ? dataRaw
        .map(normalizeAdminReviewListItem)
        .filter((r): r is AdminReviewRow => r != null)
    : []

  const statusCounts = extractStatusCounts(root)

  const paging =
    asRecord(root.pagination) ?? asRecord(root.metadata) ?? asRecord(root.meta)

  if (paging) {
    const pageSize = num(paging.pageSize ?? paging.limit ?? paging.perPage, 10)
    const total = num(paging.total, data.length)
    return {
      data,
      meta: {
        page: num(paging.page, 1),
        pageSize,
        total,
        totalPages: Math.max(
          1,
          num(paging.totalPages, Math.ceil(total / Math.max(1, pageSize)))
        ),
      },
      statusCounts,
    }
  }

  const pageSize = num(root.pageSize ?? root.limit ?? root.perPage, 10)
  const total = num(root.total, data.length)
  return {
    data,
    meta: {
      page: num(root.page, 1),
      pageSize,
      total,
      totalPages: Math.max(
        1,
        num(root.totalPages, Math.ceil(total / Math.max(1, pageSize)))
      ),
    },
    statusCounts,
  }
}

