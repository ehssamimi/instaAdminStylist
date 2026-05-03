import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'
import { revenueQueryParamForBackend } from '@/lib/revenue-dashboard'

/**
 * GET /api/admin/revenue — proxies to `{NEXT_PUBLIC_API_URL}/api/admin/revenue`
 * Forwards `range` to the backend; `past_week` is rewritten to `week` (revenue API contract).
 *
 * - When `NEXT_PUBLIC_API_URL` is set: forwards to the backend.
 * - `ADMIN_API_USE_MOCK=true`: returns local mock (offline / deploy without backend).
 * - Development with no API URL: returns mock so the page still loads offline.
 *
 * Live response shape (unwrapped or `{ success, data }`):
 * `platformRevenue`, `totalBookings`, `avgRevenue`, `performance: [{ date, revenue }]`.
 */
export async function GET(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  const forceMock = process.env.ADMIN_API_USE_MOCK === 'true'

  if (forceMock) {
    const range =
      new URL(request.url).searchParams.get('range') ?? 'past_week'
    const { revenueOverviewMockAsLiveApi } = await import(
      '@/mocks/data/revenue-overview'
    )
    return NextResponse.json({
      success: true,
      data: revenueOverviewMockAsLiveApi(range),
    })
  }

  if (!apiBase) {
    if (process.env.NODE_ENV === 'development') {
      const range =
        new URL(request.url).searchParams.get('range') ?? 'past_week'
      const { revenueOverviewMockAsLiveApi } = await import(
        '@/mocks/data/revenue-overview'
      )
      return NextResponse.json({
        success: true,
        data: revenueOverviewMockAsLiveApi(range),
      })
    }
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const requested = new URL(request.url).searchParams.get('range')
  const backendRange = revenueQueryParamForBackend(requested)
  const url = `${apiBase}/admin/revenue?range=${encodeURIComponent(backendRange)}`
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
