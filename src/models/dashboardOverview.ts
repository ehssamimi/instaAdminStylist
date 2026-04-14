import type { DashboardStatsData } from '@/models/dashboardStats'

/** Time ranges used by dashboard charts (toggle + mobile select). */
export type DashboardChartRange = '7d' | '90d' | '180d' | '365d'

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
  referralSourcesByRange: ReferralSourcesByRange
}

export interface DashboardOverviewResponse {
  success: boolean
  data: DashboardOverviewData
}
