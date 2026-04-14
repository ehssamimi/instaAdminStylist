import { http, HttpResponse } from 'msw'
import { dashboardOverviewMock } from '@/mocks/data/dashboard-overview'
import type { DashboardOverviewResponse } from '@/models/dashboardOverview'

/** Same path axios uses: baseURL `/api` + `/admin/dashboard` */
export const dashboardHandlers = [
  http.get('/api/admin/dashboard', () => {
    const body: DashboardOverviewResponse = {
      success: true,
      data: dashboardOverviewMock,
    }
    return HttpResponse.json(body)
  }),
]
