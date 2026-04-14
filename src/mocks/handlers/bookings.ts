/**
 * Not registered in `handlers/index.ts` — admin bookings use the live API.
 * Import `bookingsHandlers` here if you want to re-enable MSW for local-only runs.
 */
import { http, HttpResponse } from 'msw'
import {
  getMockBookingDetail,
  MOCK_ADMIN_BOOKING_ITEMS,
} from '@/lib/mock-bookings'
import type { AdminBookingsListResponse, BookingDetailResponse } from '@/models/bookings'

export const bookingsHandlers = [
  http.get('/api/admin/bookings', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limitParam =
      url.searchParams.get('limit') ?? url.searchParams.get('per_page') ?? '10'
    const limit = Number(limitParam)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const safePage = Number.isFinite(page) && page > 0 ? page : 1
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10

    const filtered = search
      ? MOCK_ADMIN_BOOKING_ITEMS.filter((row) => {
          const hay = [
            row.stringId,
            row.bookingId,
            row.date,
            row.stylistName,
            row.customerName,
            String(row.duration),
            row.status,
            row.currency,
          ]
            .join(' ')
            .toLowerCase()
          return hay.includes(search)
        })
      : MOCK_ADMIN_BOOKING_ITEMS

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const currentPage = Math.min(safePage, totalPages)
    const start = (currentPage - 1) * safeLimit
    const pageRows = filtered.slice(start, start + safeLimit)

    const body: AdminBookingsListResponse = {
      data: pageRows,
      metadata: {
        total,
        page: currentPage,
        limit: safeLimit,
        totalPages,
      },
    }
    return HttpResponse.json(body)
  }),
  http.get('/api/admin/bookings/:id', ({ params }) => {
    const id = String(params.id ?? '')
    const detail = getMockBookingDetail(id)
    const body: BookingDetailResponse = {
      success: Boolean(detail),
      data: detail,
    }
    return HttpResponse.json(body, {
      status: detail ? 200 : 404,
    })
  }),
]
