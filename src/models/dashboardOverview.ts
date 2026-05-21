import type { DashboardStatsData } from '@/models/dashboardStats'
import type { RevenueApiRange } from '@/models/adminDashboard'

/** @deprecated Legacy chart ranges; superseded by {@link PerformanceRange}. */
export type DashboardChartRange = '7d' | '90d' | '180d' | '365d'

/** Revenue page tabs — matches `GET /api/admin/revenue?range=` values. */
export type RevenueTimeRange = RevenueApiRange

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
  /** Revenue series from API `performance` (labelled “Sales” in the area chart). */
  performance: SalesDataPoint[]
  referralSources: ReferralSourceDatum[]
  totalResponses: number
}

export interface DashboardOverviewResponse {
  success: boolean
  data: DashboardOverviewData
}
