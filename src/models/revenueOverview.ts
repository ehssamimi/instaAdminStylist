import type { RevenueTimeRange, SalesByRange, SalesDataPoint } from '@/models/dashboardOverview'

/** Optional per-tab headline numbers from GET /api/admin/revenue. */
export type RevenueSummaryByRange = Partial<
  Record<RevenueTimeRange, { totalRevenue: number; bookings: number }>
>

/**
 * Revenue dashboard payload (mock route, MSW, or live backend).
 * Chart series + optional summaries; when `summaryByRange` is omitted, the client uses defaults.
 */
export interface RevenueOverviewData {
  salesByRange: SalesByRange
  salesAllTime?: SalesDataPoint[]
  summaryByRange?: RevenueSummaryByRange
}

export interface RevenueOverviewResponse {
  success: boolean
  data: RevenueOverviewData
}
