import { NextResponse } from 'next/server'
import { adminRouteUsesMock } from '@/lib/admin-route-mock'
import type { StylistsListResponse } from '@/models/stylists'

export async function GET(request: Request) {
  const useLive = process.env.NEXT_PUBLIC_STYLISTS_USE_LIVE_API === 'true'

  if (adminRouteUsesMock(useLive)) {
    const { MOCK_STYLISTS } = await import('@/mocks/data/stylists')
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') ?? '1')
    const perPage = Number(searchParams.get('per_page') ?? '10')
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

  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const { search } = new URL(request.url)
  const upstream = await fetch(
    `${backendUrl.replace(/\/$/, '')}/api/admin/stylists${search}`,
    {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    }
  )
  const json = await upstream.json()
  return NextResponse.json(json, { status: upstream.status })
}
export const runtime = 'edge'