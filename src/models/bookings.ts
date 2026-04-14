import { format, isValid, parse } from 'date-fns'

/** Admin bookings list item as returned by `GET /api/admin/bookings`. */
export interface AdminBookingListItem {
  bookingId: string
  stringId: string
  date: string
  stylistName: string
  customerName: string
  duration: number
  totalCost: number | null
  serviceFee: number | null
  currency: string
  status: string
}

export interface AdminBookingsListMetadata {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminBookingsListResponse {
  data: AdminBookingListItem[]
  metadata: AdminBookingsListMetadata
}

export interface BookingRowDto {
  id: string
  booking_id: string
  date: string
  stylist: string
  customer: string
  duration: string
  total_cost: string
  service_fee: string
  call_type: string
  /** Raw API status (e.g. `pending_payment`). */
  status: string
}

export interface BookingsListNormalized {
  data: BookingRowDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export function normalizeAdminBookingListItem(
  item: AdminBookingListItem
): BookingRowDto {
  const currency = item.currency?.trim() || 'USD'
  const fmt = (n: number | null) =>
    n == null
      ? '—'
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(n)

  return {
    id: item.bookingId,
    booking_id: item.stringId,
    date: item.date,
    stylist: item.stylistName,
    customer: item.customerName,
    duration: `${item.duration} min`,
    total_cost: fmt(item.totalCost),
    service_fee: fmt(item.serviceFee),
    call_type: '—',
    status: item.status,
  }
}

/**
 * Raw booking detail payload from `GET /api/admin/bookings/:bookingId`
 * (stage API may return this object directly or under `data`).
 */
export interface AdminBookingDetailApi {
  bookingId: string
  stringId: string
  status: string
  date: string
  customer: { name?: string; email?: string }
  stylist: { name?: string; email?: string }
  callDuration: number
  currency: string
  totalCost: number | null
  serviceFee: number | null
  bookingDetails: { question: string; answer: string }[]
  rating: number | null
  publicReview: string | null
  privateFeedback: string | null
}

/** Normalized detail used by the booking details page. */
export interface BookingDetailDto {
  bookingId: string
  stringId: string
  status: string
  /** Formatted date/time for display */
  dateDisplay: string
  dateRaw: string
  customerName: string
  customerEmail: string
  stylistName: string
  stylistEmail: string
  durationLabel: string
  currency: string
  totalCostDisplay: string
  serviceFeeDisplay: string
  /** Not returned by the current API — placeholder when unknown */
  callTypeDisplay: string
  bookingDetailsQa: { question: string; answer: string }[]
  /** Optional copy; omitted when the API does not supply it */
  whatYouWillNeedText: string | null
  rating: number | null
  publicReview: string | null
  privateFeedback: string | null
}

export interface BookingDetailResponse {
  success: boolean
  data: BookingDetailDto | null
}

function formatBookingDetailDateTime(value: string): string {
  if (!value?.trim()) return '—'
  const patterns = ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd HH:mm']
  for (const p of patterns) {
    const d = parse(value, p, new Date())
    if (isValid(d)) return format(d, "MM/dd/yy '·' h:mm a")
  }
  const fallback = new Date(value.replace(' ', 'T'))
  if (isValid(fallback)) return format(fallback, "MM/dd/yy '·' h:mm a")
  return value
}

function unwrapBookingDetailPayload(raw: unknown): Record<string, unknown> | null {
  if (raw == null || typeof raw !== 'object') return null
  const top = raw as Record<string, unknown>
  if (typeof top.bookingId === 'string') return top
  const inner = top.data
  if (inner != null && typeof inner === 'object' && typeof (inner as Record<string, unknown>).bookingId === 'string') {
    return inner as Record<string, unknown>
  }
  return null
}

/**
 * Maps stage admin booking detail JSON (possibly wrapped) into UI fields.
 * Returns `null` if the payload is missing required identifiers.
 */
export function normalizeBookingDetailFromApi(raw: unknown): BookingDetailDto | null {
  const o = unwrapBookingDetailPayload(raw)
  if (!o) return null

  const bookingId = typeof o.bookingId === 'string' ? o.bookingId : null
  const stringId = typeof o.stringId === 'string' ? o.stringId : null
  if (!bookingId || !stringId) return null

  const dateRaw = typeof o.date === 'string' ? o.date : ''
  const status = typeof o.status === 'string' ? o.status : ''

  const c = o.customer != null && typeof o.customer === 'object' ? (o.customer as Record<string, unknown>) : {}
  const s = o.stylist != null && typeof o.stylist === 'object' ? (o.stylist as Record<string, unknown>) : {}

  const customerName = typeof c.name === 'string' && c.name.trim() ? c.name : '—'
  const customerEmail = typeof c.email === 'string' && c.email.trim() ? c.email : '—'
  const stylistName = typeof s.name === 'string' && s.name.trim() ? s.name : '—'
  const stylistEmail = typeof s.email === 'string' && s.email.trim() ? s.email : '—'

  const currency = typeof o.currency === 'string' && o.currency.trim() ? o.currency.trim() : 'USD'

  const fmtMoney = (n: unknown) => {
    if (n == null || n === '') return '—'
    const num = typeof n === 'number' ? n : Number(n)
    if (!Number.isFinite(num)) return '—'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num)
  }

  const durRaw = o.callDuration
  const callDuration = typeof durRaw === 'number' ? durRaw : Number(durRaw)
  const durationLabel =
    Number.isFinite(callDuration) && callDuration > 0 ? `${Math.round(callDuration)} min` : '—'

  let bookingDetailsQa: { question: string; answer: string }[] = []
  if (Array.isArray(o.bookingDetails)) {
    bookingDetailsQa = o.bookingDetails
      .filter((x): x is Record<string, unknown> => x != null && typeof x === 'object')
      .map((x) => ({
        question: typeof x.question === 'string' ? x.question : '',
        answer: typeof x.answer === 'string' ? x.answer : '',
      }))
  }

  const ratingRaw = o.rating
  const rating =
    typeof ratingRaw === 'number' && Number.isFinite(ratingRaw)
      ? Math.min(5, Math.max(0, ratingRaw))
      : null

  const publicReview = typeof o.publicReview === 'string' ? o.publicReview : null
  const privateFeedback = typeof o.privateFeedback === 'string' ? o.privateFeedback : null

  const callTypeRaw = o.callType ?? o.call_type
  const callTypeDisplay =
    typeof callTypeRaw === 'string' && callTypeRaw.trim() ? callTypeRaw.trim() : '—'

  const whatYouNeed = o.whatYouWillNeed ?? o.what_you_will_need
  const whatYouWillNeedText =
    typeof whatYouNeed === 'string' && whatYouNeed.trim() ? whatYouNeed.trim() : null

  return {
    bookingId,
    stringId,
    status,
    dateDisplay: formatBookingDetailDateTime(dateRaw),
    dateRaw,
    customerName,
    customerEmail,
    stylistName,
    stylistEmail,
    durationLabel,
    currency,
    totalCostDisplay: fmtMoney(o.totalCost),
    serviceFeeDisplay: fmtMoney(o.serviceFee),
    callTypeDisplay,
    bookingDetailsQa,
    whatYouWillNeedText,
    rating,
    publicReview,
    privateFeedback,
  }
}
