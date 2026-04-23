import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/**
 * Proxies POST /api/admin/stylist/:id/reject to the backend (JSON or multipart).
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const apiBase = backendApiBaseFromEnv();
  console.log('apiBase', apiBase);
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const url = `${apiBase}/admin/stylist/${id}/reject`
  const auth = request.headers.get('authorization')
  const contentType = request.headers.get('content-type')
  const buf = await request.arrayBuffer()

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: 'application/json',
      ...(contentType ? { 'Content-Type': contentType } : {}),
    },
    ...(buf.byteLength > 0 ? { body: buf } : {}),
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
