import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

async function proxy(
  request: Request,
  method: 'GET' | 'PUT'
): Promise<NextResponse> {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const url = `${apiBase}/admin/fees`
  const auth = request.headers.get('authorization')
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (auth) headers.Authorization = auth

  const res = await fetch(url, {
    method,
    headers:
      method === 'PUT'
        ? {
            ...headers,
            'Content-Type':
              request.headers.get('content-type') ?? 'application/json',
          }
        : headers,
    body: method === 'PUT' ? await request.text() : undefined,
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

export async function GET(request: Request) {
  return proxy(request, 'GET')
}

export async function PUT(request: Request) {
  return proxy(request, 'PUT')
}

export const runtime = 'edge'
