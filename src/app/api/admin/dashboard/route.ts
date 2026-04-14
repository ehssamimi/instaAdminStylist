import { NextResponse } from 'next/server'
import { dashboardOverviewMock } from '@/mocks/data/dashboard-overview'

/**
 * Handles GET /api/admin/dashboard before Next rewrites send it to the backend.
 * - Development: returns the same JSON as MSW so the dashboard works without a backend route.
 * - Production: proxies to NEXT_PUBLIC_API_URL (set NEXT_PUBLIC_DASHBOARD_USE_LIVE_API=true in dev to proxy too).
 */
export async function GET(request: Request) {
  const useLive =
    process.env.NEXT_PUBLIC_DASHBOARD_USE_LIVE_API === 'true'

  if (process.env.NODE_ENV === 'development' && !useLive) {
    return NextResponse.json({
      success: true,
      data: dashboardOverviewMock,
    })
  }

  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const url = `${base.replace(/\/$/, '')}/api/admin/dashboard`
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