import { http, HttpResponse } from 'msw'
import { revenueOverviewMock } from '@/mocks/data/revenue-overview'
import type { RevenueOverviewResponse } from '@/models/revenueOverview'

export const revenueHandlers = [
  http.get('/api/admin/revenue', () => {
    const body: RevenueOverviewResponse = {
      success: true,
      data: revenueOverviewMock,
    }
    return HttpResponse.json(body)
  }),
]
