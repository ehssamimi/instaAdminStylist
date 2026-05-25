import { NextResponse } from 'next/server'
import { backendApiBaseFromEnv } from '@/lib/backend-api-url'

/**
 * Proxies GET /api/admin/stylists/export to the backend.
 * Forwards all query params (page, limit, search, etc.) and Authorization.
 */
export async function GET(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
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
  const url = `${apiBase}/admin/stylists/export${qs ? `?${qs}` : ''}`
  const auth = request.headers.get('authorization')

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: 'text/csv,application/octet-stream,*/*',
    },
    cache: 'no-store',
  })

  const body = await res.arrayBuffer()
  const contentType = res.headers.get('Content-Type') ?? 'text/csv'
  const contentDisposition = res.headers.get('Content-Disposition')

  const headers: Record<string, string> = { 'Content-Type': contentType }
  if (contentDisposition) headers['Content-Disposition'] = contentDisposition

  return new NextResponse(body, { status: res.status, headers })
}

export const runtime = 'edge'
