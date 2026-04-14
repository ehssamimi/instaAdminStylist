import { NextResponse } from 'next/server'

/**
 * Proxies GET /api/admin/bookings to the configured backend.
 * Mock data lives in `@/lib/mock-bookings` for MSW (optional) and stylist fixtures only.
 */
export async function GET(request: Request) {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
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
  const url = `${base.replace(/\/$/, '')}/api/admin/bookings${qs ? `?${qs}` : ''}`
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