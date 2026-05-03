'use client'

import { DashboardStatsData } from '@/models/dashboardStats'
import { DashboardStatCard } from '@/components/dashboard-stat-card'

type SectionCardsProps = {
  stats: DashboardStatsData
  loading?: boolean
}

export function SectionCards({ stats, loading = false }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-[10px] @xl/main:grid-cols-4">
      <DashboardStatCard
        label="Bookings Today"
        value={
          loading ? '...' : stats.bookingsToday.toLocaleString()
        }
      />
      <DashboardStatCard
        label="Today's Revenue"
        value={
          loading
            ? '...'
            : `$${stats.todaysRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}`
        }
      />
      <DashboardStatCard
        label="New Applications"
        value={
          loading ? '...' : stats.newApplications.toLocaleString()
        }
      />
      <DashboardStatCard
        label="Reviews to Approve"
        value={
          loading ? '...' : stats.reviewsToApprove.toLocaleString()
        }
      />
    </div>
  )
}
