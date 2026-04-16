import { http, HttpResponse } from 'msw'
import { getMockStylistDetail, MOCK_STYLISTS } from '@/mocks/data/stylists'
import type { StylistDetailResponse, StylistsListResponse } from '@/models/stylists'

export const stylistsHandlers = [
  http.get('/api/admin/stylists', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const perPage = Number(url.searchParams.get('per_page') ?? '10')
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()

    const safePage = Number.isFinite(page) && page > 0 ? page : 1
    const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 10

    const filtered = search
      ? MOCK_STYLISTS.filter((row) => {
          const hay = [
            row.first_name,
            row.last_name,
            row.speciality,
            String(row.bookings),
            row.total_revenue,
            row.stylist_since,
            row.avg_weekly_availability,
            row.avg_weekly_drop_in,
          ]
            .join(' ')
            .toLowerCase()
          return hay.includes(search)
        })
      : MOCK_STYLISTS

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / safePerPage))
    const currentPage = Math.min(safePage, totalPages)
    const start = (currentPage - 1) * safePerPage
    const pageRows = filtered.slice(start, start + safePerPage)

    const body: StylistsListResponse = {
      success: true,
      data: pageRows,
      meta: {
        page: currentPage,
        perPage: safePerPage,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    }
    return HttpResponse.json(body)
  }),

  http.get('/api/admin/stylists/:id', ({ params }) => {
    const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''
    const detail = getMockStylistDetail(id)

    const body: StylistDetailResponse = {
      success: Boolean(detail),
      data: detail,
    }
    return HttpResponse.json(body, { status: detail ? 200 : 404 })
  }),

  /** Same mock as admin stylist detail; client uses this path for live API shape. */
  http.get('/api/stylist/details/:id', ({ params }) => {
    const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''
    const detail = getMockStylistDetail(id)

    const body: StylistDetailResponse = {
      success: Boolean(detail),
      data: detail,
    }
    return HttpResponse.json(body, { status: detail ? 200 : 404 })
  }),
]
