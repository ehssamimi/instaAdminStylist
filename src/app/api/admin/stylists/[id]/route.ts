import { NextResponse } from 'next/server'
import { getMockStylistDetail } from '@/mocks/data/stylists'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const useLive = process.env.NEXT_PUBLIC_STYLISTS_USE_LIVE_API === 'true'

  if (process.env.NODE_ENV === 'development' && !useLive) {
    const detail = getMockStylistDetail(id)
    return NextResponse.json(
      { success: Boolean(detail), data: detail },
      { status: detail ? 200 : 404 }
    )
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const upstream = await fetch(`${backendUrl}/api/admin/stylists/${id}`, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })
  const json = await upstream.json()
  return NextResponse.json(json, { status: upstream.status })
}
export const runtime = 'edge'