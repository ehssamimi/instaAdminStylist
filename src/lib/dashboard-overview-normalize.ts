import type { AdminDashboardDto } from '@/models/adminDashboard'
import type {
  DashboardOverviewData,
  DashboardOverviewResponse,
} from '@/models/dashboardOverview'

function isOverviewData(v: unknown): v is DashboardOverviewData {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    typeof o.stats === 'object' &&
    o.stats !== null &&
    Array.isArray(o.performance) &&
    Array.isArray(o.referralSources) &&
    typeof o.totalResponses === 'number'
  )
}

function isAdminDashboardDto(v: unknown): v is AdminDashboardDto {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    typeof o.summary === 'object' &&
    o.summary !== null &&
    Array.isArray(o.performance) &&
    Array.isArray(o.userAcquisition) &&
    typeof o.totalResponses === 'number'
  )
}

function unwrapPayload(raw: unknown): AdminDashboardDto | null {
  if (isAdminDashboardDto(raw)) return raw
  if (
    raw &&
    typeof raw === 'object' &&
    'data' in raw &&
    isAdminDashboardDto((raw as { data: unknown }).data)
  ) {
    return (raw as { data: AdminDashboardDto }).data
  }
  return null
}

/** Maps staging/backend dashboard JSON into chart + card shapes used by the UI. */
export function normalizeAdminDashboardPayload(
  raw: unknown
): DashboardOverviewResponse | null {
  if (
    raw &&
    typeof raw === 'object' &&
    'success' in raw &&
    (raw as { success?: boolean }).success === true &&
    isOverviewData((raw as { data?: unknown }).data)
  ) {
    return raw as DashboardOverviewResponse
  }

  const dto = unwrapPayload(raw)
  if (!dto) return null

  const data: DashboardOverviewData = {
    stats: {
      bookingsToday: dto.summary.bookingsToday,
      todaysRevenue: dto.summary.todaysRevenue,
      newApplications: dto.summary.newApplications,
      reviewsToApprove: dto.summary.reviewsToApprove,
    },
    performance: dto.performance.map((p) => ({
      date: p.date,
      sales: p.revenue,
    })),
    referralSources: dto.userAcquisition.map((u) => ({
      label: u.source,
      count: u.count,
    })),
    totalResponses: dto.totalResponses,
  }

  return { success: true, data }
}
