import type { DashboardStatsData } from '@/models/dashboardStats'

/** Time ranges used by dashboard charts (toggle + mobile select). */
export type DashboardChartRange = '7d' | '90d' | '180d' | '365d'

/** Revenue page tabs include an extra “All time” bucket. */
export type RevenueTimeRange = DashboardChartRange | 'all'

export type SalesDataPoint = {
  date: string
  sales: number
}

export type ReferralSourceDatum = {
  label: string
  count: number
}

export type SalesByRange = Record<DashboardChartRange, SalesDataPoint[]>

export type ReferralSourcesByRange = Record<DashboardChartRange, ReferralSourceDatum[]>

/**
 * Single payload for the admin dashboard home page (cards + chart datasets).
 * Mirrors a typical backend `{ success, data }` wrapper via `DashboardOverviewResponse`.
 */
export interface DashboardOverviewData {
  stats: DashboardStatsData
  salesByRange: SalesByRange
  /**
   * Longer revenue series for the “All time” tab. Optional until the backend sends it.
   */
  salesAllTime?: SalesDataPoint[]
  referralSourcesByRange: ReferralSourcesByRange
}

export interface DashboardOverviewResponse {
  success: boolean
  data: DashboardOverviewData
}
