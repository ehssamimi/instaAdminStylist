/**
 * Raw payload from `GET /api/admin/dashboard?range=past_week|3m|6m|1y`
 * (staging example is unwrapped; some proxies may wrap `{ success, data }`).
 */
export type DashboardOverviewRange = 'past_week' | '3m' | '6m' | '1y'

export type PerformanceRange = '7d' | '30d' | '6m'

export interface PerformanceDataPoint {
  date: string
  value: number
}

export interface PerformanceMetric {
  total: number
  dataPoints: PerformanceDataPoint[]
}

export interface PerformancesResponse {
  range: string
  totalSales: PerformanceMetric
  totalRevenue: PerformanceMetric
}

export interface AdminDashboardSummaryDto {
  bookingsToday: number
  todaysRevenue: number
  newApplications: number
  reviewsToApprove: number
}

export interface AdminDashboardPerformancePointDto {
  date: string
  revenue: number
}

export interface AdminDashboardUserAcquisitionDto {
  source: string
  count: number
}

export interface AdminDashboardDto {
  summary: AdminDashboardSummaryDto
  performance: AdminDashboardPerformancePointDto[]
  userAcquisition: AdminDashboardUserAcquisitionDto[]
  totalResponses: number
}
