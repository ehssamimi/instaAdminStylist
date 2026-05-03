import type { DashboardOverviewRange } from "@/models/adminDashboard"
import type { RevenueTimeRange } from "@/models/dashboardOverview"

export type { RevenueRangeModel } from "@/models/revenueOverview"

/** Tab labels aligned with the revenue dashboard design. */
export const REVENUE_RANGE_TAB_LABELS: Record<RevenueTimeRange, string> = {
  "7d": "Past Week",
  "90d": "Past 3 Months",
  "180d": "Past 6 Months",
  "365d": "Past Year",
}

export const REVENUE_TAB_ORDER: RevenueTimeRange[] = [
  "7d",
  "90d",
  "180d",
  "365d",
]

/** Map revenue UI tab keys to admin API `range` query values (same as dashboard home). */
export function revenueTabToApiRange(tab: RevenueTimeRange): DashboardOverviewRange {
  switch (tab) {
    case "7d":
      return "past_week"
    case "90d":
      return "3m"
    case "180d":
      return "6m"
    case "365d":
      return "1y"
    default: {
      const _exhaustive: never = tab
      return _exhaustive
    }
  }
}

/**
 * `/api/admin/revenue` expects `range=week` for the short window; `/api/admin/dashboard`
 * uses `past_week`. Translate when calling the revenue endpoint only.
 */
export function revenueQueryParamForBackend(
  range: string | null | undefined
): string {
  const v = (range ?? "past_week").trim()
  if (v === "past_week") return "week"
  return v
}

export function revenueYAxisUpperBound(maxSales: number): number {
  if (!Number.isFinite(maxSales) || maxSales <= 0) return 2000
  const step = 500
  return Math.max(step, Math.ceil(maxSales / step) * step)
}
