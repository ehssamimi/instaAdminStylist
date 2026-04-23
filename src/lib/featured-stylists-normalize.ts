import type { FeaturedStylistApiItem } from '@/models/featuredStylists'
import type { StylistRowDto } from '@/models/stylists'

function asRecord(v: unknown): Record<string, unknown> | null {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null
}

function num(v: unknown, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function parseName(
  name: string
): { first_name: string; last_name: string } {
  const t = name.trim()
  if (!t) return { first_name: '—', last_name: '' }
  const i = t.indexOf(' ')
  if (i === -1) return { first_name: t, last_name: '' }
  return { first_name: t.slice(0, i), last_name: t.slice(i + 1).trim() }
}

function formatTotalSales(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

export function mapFeaturedStylistToRow(
  item: FeaturedStylistApiItem
): StylistRowDto {
  const { first_name, last_name } = parseName(item.name)
  return {
    id: item.id,
    profile_picture: item.profilePicture ?? null,
    first_name,
    last_name,
    speciality: item.speciality,
    bookings: item.totalBookings,
    total_revenue: formatTotalSales(item.totalSales),
    stylist_since: '—',
    avg_weekly_availability: '—',
    avg_weekly_drop_in: '—',
  }
}

export type FeaturedStylistsListNormalized = {
  data: StylistRowDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export function normalizeFeaturedStylistsListResponse(
  raw: unknown
): FeaturedStylistsListNormalized {
  const root = asRecord(raw)
  if (!root) {
    return {
      data: [],
      meta: { page: 1, perPage: 10, total: 0, totalPages: 1 },
    }
  }

  const dataRaw = root.data
  const data = Array.isArray(dataRaw)
    ? (dataRaw as FeaturedStylistApiItem[]).map(mapFeaturedStylistToRow)
    : []

  const metaRec = asRecord(root.metadata) ?? asRecord(root.meta)
  if (metaRec) {
    const perPage = num(metaRec.limit, 10)
    const total = num(metaRec.totalCount ?? metaRec.total, data.length)
    const totalPages = Math.max(
      1,
      num(metaRec.totalPages, Math.ceil(total / Math.max(1, perPage || 10)))
    )
    return {
      data,
      meta: {
        page: num(metaRec.page, 1),
        perPage: perPage || 10,
        total,
        totalPages,
      },
    }
  }

  return {
    data,
    meta: {
      page: 1,
      perPage: 10,
      total: data.length,
      totalPages: 1,
    },
  }
}
