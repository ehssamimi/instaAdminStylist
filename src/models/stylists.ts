import type { BookingRowDto } from '@/models/bookings'

/** Raw payload from `GET /api/stylist/details/:id` (camelCase; some fields optional). */
export type StylistDetailsApiDto = {
  id: string
  firstName?: string | null
  lastName?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phoneNumber?: string | null
  businessName?: string | null
  bio?: string | null
  location?: string | null
  experience?: unknown
  speciality?: unknown
  imageUrl?: string | null
  profile_picture?: string | null
  isVerified?: boolean
  available?: boolean
  totalCompletedBookings?: number
  gender?: string | null
  linkedInUrl?: string | null
  tiktokHandle?: string | null
  instagramOrFacebook?: string | null
  website?: string | null
  recommendShops?: unknown
  booking_history?: BookingRowDto[]
}

export interface StylistRowDto {
  id: string
  profile_picture: string | null
  first_name: string
  last_name: string
  speciality: string
  bookings: number
  total_revenue: string
  stylist_since: string
  avg_weekly_availability: string
  avg_weekly_drop_in: string
}

export interface StylistDetailDto extends StylistRowDto {
  email: string
  phoneNumber?: string | null
  gender: string | null
  businessName: string | null
  location: string | null
  linkedInUrl: string | null
  tiktokHandle: string | null
  instagramOrFacebook: string | null
  experience: string | null
  website: string | null
  bio: string | null
  specialityTags: string[]
  otherSpecialities: string | null
  recommendShopIds: string[]
  otherShops: string | null
  booking_history: BookingRowDto[]
  isVerified?: boolean
  available?: boolean
}

export interface StylistsListResponse {
  success: boolean
  data: StylistRowDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface StylistDetailResponse {
  success: boolean
  data: StylistDetailDto | null
}

function coalesceStr(v: unknown): string | null {
  if (v == null) return null
  if (typeof v === 'string') {
    const t = v.trim()
    return t.length ? t : null
  }
  return null
}

function stringifyExperience(ex: unknown): string | null {
  if (ex == null) return null
  if (typeof ex === 'string') {
    const t = ex.trim()
    return t.length ? t : null
  }
  if (typeof ex === 'object' && ex !== null) {
    const o = ex as Record<string, unknown>
    const label = coalesceStr(o.label) ?? coalesceStr(o.name)
    if (label) return label
    const y = o.years ?? o.yearsOfExperience
    if (typeof y === 'number' && Number.isFinite(y)) return String(y)
    if (typeof y === 'string' && y.trim()) return y.trim()
    try {
      const s = JSON.stringify(ex)
      return s === '{}' ? null : s
    } catch {
      return null
    }
  }
  return null
}

function parseSpecialityList(raw: unknown): { tags: string[]; summary: string } {
  if (!Array.isArray(raw)) return { tags: [], summary: '—' }
  const tags: string[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      const t = item.trim()
      if (t && !tags.includes(t)) tags.push(t)
      continue
    }
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const label =
        coalesceStr(o.label) ??
        coalesceStr(o.option) ??
        coalesceStr(o.name) ??
        coalesceStr(o.key)
      if (label && !tags.includes(label)) tags.push(label)
    }
  }
  const summary = tags.length ? tags.join(', ') : '—'
  return { tags, summary }
}

function parseRecommendShopsFromApi(raw: unknown): {
  ids: string[]
  other: string | null
} {
  if (!Array.isArray(raw)) return { ids: [], other: null }
  const ids: string[] = []
  const other: string[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      const t = item.trim()
      if (t) other.push(t)
      continue
    }
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      const key = coalesceStr(o.key)?.toLowerCase()
      const id = coalesceStr(o.id)
      if (key) {
        if (!ids.includes(key)) ids.push(key)
      } else if (id) {
        if (!ids.includes(id)) ids.push(id)
      } else {
        const name = coalesceStr(o.option) ?? coalesceStr(o.label)
        if (name) other.push(name)
      }
    }
  }
  return { ids, other: other.length ? other.join(', ') : null }
}

export function mapStylistDetailsApiToDto(raw: StylistDetailsApiDto): StylistDetailDto {
  const first =
    coalesceStr(raw.firstName) ?? coalesceStr(raw.first_name) ?? ''
  const last =
    coalesceStr(raw.lastName) ?? coalesceStr(raw.last_name) ?? ''
  const { tags: specialityTags, summary: specialityLine } =
    parseSpecialityList(raw.speciality)
  const shops = parseRecommendShopsFromApi(raw.recommendShops)
  const image =
    coalesceStr(raw.imageUrl) ?? coalesceStr(raw.profile_picture) ?? null
  const bookings = raw.totalCompletedBookings ?? 0

  return {
    id: String(raw.id),
    profile_picture: image,
    first_name: first,
    last_name: last,
    speciality: specialityLine,
    bookings,
    total_revenue: '—',
    stylist_since: '—',
    avg_weekly_availability: '—',
    avg_weekly_drop_in: '—',
    email: coalesceStr(raw.email) ?? '',
    phoneNumber: coalesceStr(raw.phoneNumber),
    gender: raw.gender ?? null,
    businessName: raw.businessName ?? null,
    location: raw.location ?? null,
    linkedInUrl: raw.linkedInUrl ?? null,
    tiktokHandle: raw.tiktokHandle ?? null,
    instagramOrFacebook: raw.instagramOrFacebook ?? null,
    experience: stringifyExperience(raw.experience),
    website: raw.website ?? null,
    bio: raw.bio ?? null,
    specialityTags,
    otherSpecialities: null,
    recommendShopIds: shops.ids,
    otherShops: shops.other,
    booking_history: Array.isArray(raw.booking_history) ? raw.booking_history : [],
    isVerified: raw.isVerified,
    available: raw.available,
  }
}

function isLikelyNormalizedDetailDto(p: Record<string, unknown>): boolean {
  return (
    typeof p.first_name === 'string' &&
    typeof p.last_name === 'string' &&
    Array.isArray(p.specialityTags)
  )
}

/** Accepts flat stylist object, or `{ success, data }`, or error-shaped `{ success: false }`. */
export function normalizeStylistDetailResponse(raw: unknown): StylistDetailResponse {
  if (!raw || typeof raw !== 'object') {
    return { success: false, data: null }
  }
  const top = raw as Record<string, unknown>
  if (top.success === false) {
    return { success: false, data: null }
  }

  const payloadUnknown =
    top.data !== undefined && top.data !== null && typeof top.data === 'object'
      ? top.data
      : top

  if (
    !payloadUnknown ||
    typeof payloadUnknown !== 'object' ||
    (payloadUnknown as StylistDetailsApiDto).id === undefined ||
    (payloadUnknown as StylistDetailsApiDto).id === null
  ) {
    return { success: false, data: null }
  }

  const payload = payloadUnknown as Record<string, unknown>
  if (isLikelyNormalizedDetailDto(payload)) {
    return { success: true, data: payload as unknown as StylistDetailDto }
  }

  return {
    success: true,
    data: mapStylistDetailsApiToDto(payloadUnknown as StylistDetailsApiDto),
  }
}
