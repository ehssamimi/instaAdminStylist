import type { RevenueTimeRange } from "@/models/dashboardOverview"

export type { RevenueRangeModel } from "@/models/revenueOverview"

export const REVENUE_RANGE_TAB_LABELS: Record<RevenueTimeRange, string> = {
  "7d": "Past Week",
  "30d": "Past 30 Days",
  "6m": "Past 6 Months",
}

export const REVENUE_TAB_ORDER: RevenueTimeRange[] = ["7d", "30d", "6m"]

/**
 * `/api/admin/revenue` expects `range=week` for the short window.
 * Retained for the revenue API route proxy; not used by the revenue page.
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
