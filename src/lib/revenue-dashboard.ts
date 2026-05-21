import type { RevenueTimeRange } from "@/models/dashboardOverview"

export type { RevenueRangeModel } from "@/models/revenueOverview"

export const REVENUE_RANGE_TAB_LABELS: Record<RevenueTimeRange, string> = {
  week: "Past Week",
  "3m": "Past 3 Months",
  "6m": "Past 6 Months",
  "1y": "Past Year",
  all: "All Time",
}

export const REVENUE_TAB_ORDER: RevenueTimeRange[] = ["week", "3m", "6m", "1y", "all"]

/**
 * Retained for the revenue API route proxy (`/api/admin/revenue/route.ts`).
 * Rewrites legacy `past_week` → `week`; all other values pass through unchanged.
 */
export function revenueQueryParamForBackend(
  range: string | null | undefined
): string {
  const v = (range ?? "week").trim()
  if (v === "past_week") return "week"
  return v
}

export function revenueYAxisUpperBound(maxSales: number): number {
  if (!Number.isFinite(maxSales) || maxSales <= 0) return 2000
  const step = 500
  return Math.max(step, Math.ceil(maxSales / step) * step)
}
