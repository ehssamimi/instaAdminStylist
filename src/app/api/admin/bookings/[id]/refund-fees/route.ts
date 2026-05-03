import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/**
 * Proxies POST /api/admin/bookings/:id/refund-fees to the configured backend.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const url = `${apiBase}/admin/bookings/${encodeURIComponent(id)}/refund-fees`
  const auth = request.headers.get('authorization')
  const contentType = request.headers.get('content-type')
  const body = await request.text()

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      ...(contentType ? { 'Content-Type': contentType } : {}),
      Accept: 'application/json',
    },
    body: body || '{}',
    cache: 'no-store',
  })

  const responseBody = await res.text()
  return new NextResponse(responseBody, {
    status: res.status,
    headers: {
      'Content-Type':
        res.headers.get('Content-Type') ?? 'application/json',
    },
  })
}

export const runtime = 'edge'
