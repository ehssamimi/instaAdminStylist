import type { RevenueTimeRange, SalesByRange, SalesDataPoint } from '@/models/dashboardOverview'

/** Normalized KPIs + performance for one range (from live `GET /api/admin/revenue?range=`). */
export type RevenueRangeModel = {
  series: SalesDataPoint[]
  totalRevenue: number
  bookings: number
  avgRevenue: number
}

/** Optional per-tab headline numbers for legacy revenue payloads. */
export type RevenueSummaryByRange = Partial<
  Record<RevenueTimeRange, { totalRevenue: number; bookings: number }>
>

/** Legacy revenue overview payload shape retained for compatibility. */
export interface RevenueOverviewData {
  salesByRange: SalesByRange
  salesAllTime?: SalesDataPoint[]
  summaryByRange?: RevenueSummaryByRange
}

export interface RevenueOverviewResponse {
  success: boolean
  data: RevenueOverviewData
}
