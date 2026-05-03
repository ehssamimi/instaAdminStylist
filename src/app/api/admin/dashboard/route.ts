import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/**
 * GET /api/admin/dashboard — proxies to `{NEXT_PUBLIC_API_URL}/api/admin/dashboard`
 * with the same query string (e.g. `?range=past_week`).
 *
 * - When `NEXT_PUBLIC_API_URL` is set: **always** forwards to the backend (same pattern as
 *   `/api/admin/bookings`). Range changes hit the real API.
 * - `ADMIN_API_USE_MOCK=true`: returns local JSON (overrides proxy).
 * - Development with no API URL: returns local mock so the page still loads offline.
 * - Production with no API URL: 500 (misconfiguration).
 */
export async function GET(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  const forceMock = process.env.ADMIN_API_USE_MOCK === 'true'

  if (forceMock) {
    const { dashboardOverviewMock } = await import(
      '@/mocks/data/dashboard-overview'
    )
    return NextResponse.json({
      success: true,
      data: dashboardOverviewMock,
    })
  }

  if (!apiBase) {
    if (process.env.NODE_ENV === 'development') {
      const { dashboardOverviewMock } = await import(
        '@/mocks/data/dashboard-overview'
      )
      return NextResponse.json({
        success: true,
        data: dashboardOverviewMock,
      })
    }
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const qs = new URL(request.url).searchParams.toString()
  const url = `${apiBase}/admin/dashboard${qs ? `?${qs}` : ''}`
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