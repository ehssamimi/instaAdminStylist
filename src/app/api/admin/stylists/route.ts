import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'
import type { StylistsListResponse } from '@/models/stylists'

async function devMockResponse(request: Request): Promise<NextResponse> {
  const { MOCK_STYLISTS } = await import('@/mocks/data/stylists')
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const perPage = Number(
    searchParams.get('per_page') ?? searchParams.get('limit') ?? '10'
  )
  const search = (searchParams.get('search') ?? '').trim().toLowerCase()

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
  return NextResponse.json(body)
}

/**
 * Proxies `GET /api/admin/stylists` to `{NEXT_PUBLIC_API_URL}/api/admin/stylists`.
 * Forwards `Authorization` and maps `per_page` → `limit` for the upstream API.
 *
 * Without `NEXT_PUBLIC_API_URL` in development, returns local mock data so the UI still works offline.
 */
export async function GET(request: Request) {
  const apiBase = backendApiBaseFromEnv()

  if (!apiBase) {
    if (process.env.NODE_ENV === 'development') {
      return devMockResponse(request)
    }
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const incomingUrl = new URL(request.url)
  const forwardParams = new URLSearchParams(incomingUrl.searchParams)
  if (forwardParams.has('per_page') && !forwardParams.has('limit')) {
    forwardParams.set('limit', forwardParams.get('per_page')!)
    forwardParams.delete('per_page')
  }
  const qs = forwardParams.toString()
  const url = `${apiBase}/admin/stylists${qs ? `?${qs}` : ''}`
  const auth = request.headers.get('authorization')

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  })
}
export const runtime = 'edge'
