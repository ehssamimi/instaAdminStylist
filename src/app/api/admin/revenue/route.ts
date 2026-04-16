import { NextResponse } from 'next/server'
import { adminRouteUsesMock } from '@/lib/admin-route-mock'

/**
 * GET /api/admin/revenue — revenue charts + optional `summaryByRange` for stat cards.
 * - Development: returns mock JSON (same pattern as `/api/admin/dashboard`).
 * - Set `NEXT_PUBLIC_REVENUE_USE_LIVE_API=true` to proxy to the backend.
 * - Production + `ADMIN_API_USE_MOCK=true`: returns mock.
 */
export async function GET(request: Request) {
  const useLive =
    process.env.NEXT_PUBLIC_REVENUE_USE_LIVE_API === 'true'

  if (adminRouteUsesMock(useLive)) {
    const { revenueOverviewMock } = await import(
      '@/mocks/data/revenue-overview'
    )
    return NextResponse.json({
      success: true,
      data: revenueOverviewMock,
    })
  }

  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const url = `${base.replace(/\/$/, '')}/api/admin/revenue`
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
      'Content-Type':
        res.headers.get('Content-Type') ?? 'application/json',
    },
  })
}

export const runtime = 'edge'
