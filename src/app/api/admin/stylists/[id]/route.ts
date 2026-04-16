import { NextResponse } from 'next/server'
import { adminRouteUsesMock } from '@/lib/admin-route-mock'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const useLive = process.env.NEXT_PUBLIC_STYLISTS_USE_LIVE_API === 'true'

  if (adminRouteUsesMock(useLive)) {
    const { getMockStylistDetail } = await import('@/mocks/data/stylists')
    const detail = getMockStylistDetail(id)
    return NextResponse.json(
      { success: Boolean(detail), data: detail },
      { status: detail ? 200 : 404 }
    )
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  if (!backendUrl) {
    return NextResponse.json(
      { success: false, message: 'NEXT_PUBLIC_API_URL is not set' },
      { status: 500 }
    )
  }

  const upstream = await fetch(
    `${backendUrl.replace(/\/$/, '')}/api/stylist/details/${id}`,
    {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    }
  )
  const json = await upstream.json()
  return NextResponse.json(json, { status: upstream.status })
}
export const runtime = 'edge'