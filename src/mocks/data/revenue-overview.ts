import type { RevenueOverviewData } from '@/models/revenueOverview'
import { dashboardOverviewMock } from '@/mocks/data/dashboard-overview'

/**
 * Mock for `GET /api/admin/revenue` — same series as the main dashboard mock,
 * with explicit KPIs per tab (also used to scale each chart to its total).
 */
export const revenueOverviewMock: RevenueOverviewData = {
  salesByRange: dashboardOverviewMock.salesByRange,
  salesAllTime: dashboardOverviewMock.salesAllTime,
  summaryByRange: {
    '7d': { totalRevenue: 1080, bookings: 30 },
    '90d': { totalRevenue: 12_450, bookings: 340 },
    '180d': { totalRevenue: 24_600, bookings: 680 },
    '365d': { totalRevenue: 50_200, bookings: 1390 },
    all: { totalRevenue: 128_400, bookings: 3560 },
  },
}
