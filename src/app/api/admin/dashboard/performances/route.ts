import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/** Proxies GET /api/admin/dashboard/performances to the backend with the same query string. */
export async function GET(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const qs = new URL(request.url).searchParams.toString()
  const url = `${apiBase}/admin/dashboard/performances${qs ? `?${qs}` : ''}`
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
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export const runtime = 'edge'
