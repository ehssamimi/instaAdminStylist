import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/**
 * Proxies PUT /api/admin/featured-stylists/:id/order
 * Body: `{ "order": number }`
 */
export async function PUT(
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

  const url = `${apiBase}/admin/featured-stylists/${encodeURIComponent(id)}/order`
  const auth = request.headers.get('authorization')
  const bodyText = await request.text()

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: bodyText || '{}',
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
