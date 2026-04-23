import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/**
 * Proxies `GET` / `PUT` `/api/admin/fees` to the backend (same path under `NEXT_PUBLIC_API_URL`),
 * same pattern as `app/api/admin/stylist/pending/route.ts`.
 * Browser calls: `http(s)://<this-app>/api/admin/fees` only (axios `baseURL: '/api'` + `/admin/fees`).
 */
function backendFeesUrl(request: Request, method: 'GET' | 'PUT'): string {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) return ''
  const incoming = new URL(request.url)
  const target = new URL(`${apiBase}/admin/fees`)
  if (method === 'GET') {
    incoming.searchParams.forEach((value, key) => {
      target.searchParams.set(key, value)
    })
  }
  return target.toString()
}

export async function GET(request: Request) {
  const url = backendFeesUrl(request, 'GET')
  if (!url) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }
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

export async function PUT(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }
  const url = `${apiBase}/admin/fees`
  const auth = request.headers.get('authorization')
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type':
      request.headers.get('content-type') ?? 'application/json',
    ...(auth ? { Authorization: auth } : {}),
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: await request.text(),
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
