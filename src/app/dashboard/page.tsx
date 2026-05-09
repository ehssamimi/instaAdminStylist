"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartReferralSources } from "@/components/chart-referral-sources"
import { SectionCards } from "@/components/section-cards"
import { useDashboardOverview } from "@/hooks/use-dashboard-overview"
import { usePerformances } from "@/hooks/use-performances"
import { usePageTitle } from "@/hooks/use-page-title"

const emptyStats = {
  bookingsToday: 0,
  todaysRevenue: 0,
  newApplications: 0,
  reviewsToApprove: 0,
}

export default function Page() {
  const { title } = usePageTitle()
  const { data, loading, error, range, setRange } = useDashboardOverview()
  const { data: perfData, loading: perfLoading, range: perfRange, setRange: setPerfRange } = usePerformances()

  return (
    <div className="flex flex-col gap-[10px]">
      <h1 className="admin-page-title">{title}</h1>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}
      <SectionCards stats={data?.stats ?? emptyStats} loading={loading} />
      <ChartAreaInteractive
        data={perfData}
        loading={perfLoading}
        range={perfRange}
        onRangeChange={setPerfRange}
      />
      {data ? (
        <ChartReferralSources
          referralSources={data.referralSources}
          totalResponses={data.totalResponses}
          range={range}
          onRangeChange={setRange}
          loading={loading}
        />
      ) : loading ? (
        <div className="h-[280px] animate-pulse rounded-xl bg-muted" />
      ) : null}
    </div>
  )
}
