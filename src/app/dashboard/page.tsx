"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartReferralSources } from "@/components/chart-referral-sources"
import { SectionCards } from "@/components/section-cards"
import { useDashboardOverview } from "@/hooks/use-dashboard-overview"
import { usePageTitle } from "@/hooks/use-page-title"

const emptyStats = {
  newCoveragesSold: 0,
  todaysSales: 0,
  newClaims: 0,
}

export default function Page() {
  const { title } = usePageTitle()
  const { data, loading, error } = useDashboardOverview()

  return (
    <div className="flex flex-col gap-[10px]">
      <h1 className="admin-page-title">{title}</h1>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}
      <SectionCards stats={data?.stats ?? emptyStats} loading={loading} />
      {data ? (
        <>
          <ChartAreaInteractive salesByRange={data.salesByRange} />
          <ChartReferralSources
            referralSourcesByRange={data.referralSourcesByRange}
          />
        </>
      ) : loading ? (
        <div className="grid gap-[10px]">
          <div className="h-[250px] animate-pulse rounded-xl bg-muted" />
          <div className="h-[280px] animate-pulse rounded-xl bg-muted" />
        </div>
      ) : null}
    </div>
  )
}
