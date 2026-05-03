import { http, HttpResponse } from 'msw'
import { revenueOverviewMockAsLiveApi } from '@/mocks/data/revenue-overview'

/** Dev-only: mirrors `/api/admin/revenue?range=` live shape (no bundled legacy payload). */
export const revenueHandlers = [
  http.get('/api/admin/revenue', ({ request }) => {
    const range =
      new URL(request.url).searchParams.get('range') ?? 'past_week'
    return HttpResponse.json({
      success: true,
      data: revenueOverviewMockAsLiveApi(range),
    })
  }),
]
