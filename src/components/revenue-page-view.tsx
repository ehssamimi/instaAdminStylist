"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStatCard } from "@/components/dashboard-stat-card"
import { RevenuePerformanceChart } from "@/components/revenue-performance-chart"
import { ADMIN_DASHBOARD_TABS_TRIGGER_CLASS } from "@/lib/admin-dashboard-tabs"
import {
  REVENUE_RANGE_TAB_LABELS,
  REVENUE_TAB_ORDER,
  type RevenueRangeModel,
} from "@/lib/revenue-dashboard"
import type { RevenueTimeRange } from "@/models/dashboardOverview"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export type RevenuePageViewProps = {
  activeRange: RevenueTimeRange
  onRangeChange: (range: RevenueTimeRange) => void
  rangeMap: Record<RevenueTimeRange, RevenueRangeModel>
}

export function RevenuePageView({
  activeRange,
  onRangeChange,
  rangeMap,
}: RevenuePageViewProps) {
  const m = rangeMap[activeRange]

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        value={activeRange}
        onValueChange={(v) => onRangeChange(v as RevenueTimeRange)}
        className="gap-0"
      >
        <div className="w-full border-0 border-b border-gray-200">
          <TabsList className="mb-0 h-auto justify-start gap-6 overflow-x-auto rounded-none bg-transparent p-0 md:gap-8">
            {REVENUE_TAB_ORDER.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className={ADMIN_DASHBOARD_TABS_TRIGGER_CLASS}
              >
                {REVENUE_RANGE_TAB_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 gap-[10px] @xl/main:grid-cols-3">
        <DashboardStatCard
          label={REVENUE_RANGE_TAB_LABELS[activeRange]}
          value={currency.format(m.totalRevenue)}
        />
        <DashboardStatCard label="Bookings" value={m.bookings.toLocaleString()} />
        <DashboardStatCard
          label="Avg. Revenue"
          value={currency.format(m.avgRevenue)}
        />
      </div>

      <RevenuePerformanceChart data={m.series} />
    </div>
  )
}
