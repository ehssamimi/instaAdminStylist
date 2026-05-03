import type { RevenueRangeModel } from '@/models/revenueOverview'
import type { SalesDataPoint } from '@/models/dashboardOverview'

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function pickRecordNum(
  o: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && Number.isFinite(Number(v))) {
      return Number(v)
    }
  }
  return 0
}

function isPerformancePoint(v: unknown): v is { date: string; revenue: unknown } {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return typeof o.date === 'string' && 'revenue' in o
}

function unwrapRevenueRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (
    'success' in r &&
    r.success === true &&
    r.data &&
    typeof r.data === 'object'
  ) {
    return r.data as Record<string, unknown>
  }
  return r
}

/** Parse live `GET /api/admin/revenue` JSON into chart + KPI shape. */
export function normalizeAdminRevenuePayload(
  raw: unknown
): { success: true; data: RevenueRangeModel } | null {
  const rec = unwrapRevenueRecord(raw)
  if (!rec || !Array.isArray(rec.performance)) return null

  const performanceRaw = rec.performance.filter(isPerformancePoint)
  const series: SalesDataPoint[] = performanceRaw.map((p) => ({
    date: p.date,
    sales: num(p.revenue, 0),
  }))

  const totalRevenue = pickRecordNum(
    rec,
    'platformRevenue',
    'platform_revenue',
    'totalRevenue',
    'total_revenue'
  )
  const bookings = pickRecordNum(rec, 'totalBookings', 'total_bookings')
  let avgRevenue = pickRecordNum(rec, 'avgRevenue', 'avg_revenue')
  if ((avgRevenue === 0 || !Number.isFinite(avgRevenue)) && bookings > 0) {
    avgRevenue = totalRevenue / bookings
  }

  const data: RevenueRangeModel = {
    series,
    totalRevenue,
    bookings,
    avgRevenue,
  }

  return { success: true, data }
}
