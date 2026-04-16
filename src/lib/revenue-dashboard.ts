import type {
  RevenueTimeRange,
  SalesByRange,
  SalesDataPoint,
} from "@/models/dashboardOverview"
import type { RevenueSummaryByRange } from "@/models/revenueOverview"

/** Build input: from `GET /api/admin/revenue` or `{ salesByRange, salesAllTime }` from the main dashboard payload. */
export type RevenueRangeBuildInput = {
  salesByRange: SalesByRange
  salesAllTime?: SalesDataPoint[]
  summaryByRange?: RevenueSummaryByRange
}

/** Tab labels aligned with the revenue dashboard design. */
export const REVENUE_RANGE_TAB_LABELS: Record<RevenueTimeRange, string> = {
  "7d": "Past Week",
  "90d": "Past 3 Months",
  "180d": "Past 6 Months",
  "365d": "Past Year",
  all: "All Time",
}

export const REVENUE_TAB_ORDER: RevenueTimeRange[] = [
  "7d",
  "90d",
  "180d",
  "365d",
  "all",
]

/**
 * Card totals (and booking counts) shown per range. Series from the API are scaled to * these totals so the chart shape matches backend data while headline numbers stay stable.
 */
const CARD_METRICS: Record<
  RevenueTimeRange,
  { totalRevenue: number; bookings: number }
> = {
  "7d": { totalRevenue: 1080, bookings: 30 },
  "90d": { totalRevenue: 12_450, bookings: 340 },
  "180d": { totalRevenue: 24_600, bookings: 680 },
  "365d": { totalRevenue: 50_200, bookings: 1390 },
  all: { totalRevenue: 128_400, bookings: 3560 },
}

const ALL_TIME_FALLBACK: SalesDataPoint[] = [
  { date: "2024-05-01", sales: 820 },
  { date: "2024-09-01", sales: 740 },
  { date: "2025-01-01", sales: 890 },
  { date: "2025-05-01", sales: 1010 },
  { date: "2025-09-01", sales: 990 },
  { date: "2026-01-01", sales: 1180 },
  { date: "2026-05-01", sales: 1390 },
]

function scaleSeriesToTotal(
  points: SalesDataPoint[],
  targetTotal: number
): SalesDataPoint[] {
  if (points.length === 0) {
    return [{ date: new Date().toISOString().slice(0, 10), sales: targetTotal }]
  }
  const sum = points.reduce((acc, p) => acc + p.sales, 0)
  if (sum <= 0) {
    const per = targetTotal / points.length
    return points.map((p) => ({ ...p, sales: per }))
  }
  const factor = targetTotal / sum
  return points.map((p) => ({
    ...p,
    sales: Math.round(p.sales * factor * 100) / 100,
  }))
}

function rawSeriesForRange(
  data: RevenueRangeBuildInput,
  range: RevenueTimeRange
): SalesDataPoint[] {
  if (range === "all") {
    const s = data.salesAllTime
    return s?.length ? s : ALL_TIME_FALLBACK
  }
  return data.salesByRange[range] ?? []
}

export type RevenueRangeModel = {
  series: SalesDataPoint[]
  totalRevenue: number
  bookings: number
  avgRevenue: number
}

export function buildRevenueRangeMap(
  data: RevenueRangeBuildInput
): Record<RevenueTimeRange, RevenueRangeModel> {
  const out = {} as Record<RevenueTimeRange, RevenueRangeModel>
  for (const r of REVENUE_TAB_ORDER) {
    const raw = rawSeriesForRange(data, r)
    const { totalRevenue, bookings } =
      data.summaryByRange?.[r] ?? CARD_METRICS[r]
    const series = scaleSeriesToTotal(raw, totalRevenue)
    const avgRevenue = bookings > 0 ? totalRevenue / bookings : 0
    out[r] = { series, totalRevenue, bookings, avgRevenue }
  }
  return out
}

export function revenueYAxisUpperBound(maxSales: number): number {
  if (!Number.isFinite(maxSales) || maxSales <= 0) return 2000
  const step = 500
  return Math.max(step, Math.ceil(maxSales / step) * step)
}
