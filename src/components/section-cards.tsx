'use client'

import { DashboardStatsData } from '@/models/dashboardStats'
import { DashboardStatCard } from '@/components/dashboard-stat-card'

type SectionCardsProps = {
  stats: DashboardStatsData
  loading?: boolean
}

const loadingSkeleton = (
  <span className="block h-9 w-24 animate-pulse rounded-md bg-muted" />
)

export function SectionCards({ stats, loading = false }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-[10px] @xl/main:grid-cols-4">
      <DashboardStatCard
        label="Bookings Today"
        value={loading ? loadingSkeleton : stats.bookingsToday.toLocaleString()}
      />
      <DashboardStatCard
        label="Today's Revenue"
        value={
          loading
            ? loadingSkeleton
            : `$${stats.todaysRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        }
      />
      <DashboardStatCard
        label="New Applications"
        value={loading ? loadingSkeleton : stats.newApplications.toLocaleString()}
      />
      <DashboardStatCard
        label="Reviews to Approve"
        value={loading ? loadingSkeleton : stats.reviewsToApprove.toLocaleString()}
      />
    </div>
  )
}
