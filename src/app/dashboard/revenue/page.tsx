"use client"

import { RevenuePageView } from "@/components/revenue-page-view"
import { useRevenueApi } from "@/hooks/use-revenue-api"
import { usePageTitle } from "@/hooks/use-page-title"

export default function RevenuePage() {
  const { title } = usePageTitle()
  const { data: model, loading, error, range, setRange } = useRevenueApi()

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title mb-6">{title}</h1>
      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

      {loading && !model ? (
        <div className="space-y-6">
          <div className="h-11 animate-pulse rounded-md bg-muted" />
          <div className="grid grid-cols-1 gap-[10px] @xl/main:grid-cols-3">
            <div className="h-28 animate-pulse rounded-[12px] bg-muted" />
            <div className="h-28 animate-pulse rounded-[12px] bg-muted" />
            <div className="h-28 animate-pulse rounded-[12px] bg-muted" />
          </div>
          <div className="h-[360px] animate-pulse rounded-xl bg-muted" />
        </div>
      ) : model ? (
        <RevenuePageView
          activeRange={range}
          onRangeChange={setRange}
          model={model}
        />
      ) : !error ? (
        <p className="text-sm text-muted-foreground">
          Revenue data is not available.
        </p>
      ) : null}
    </div>
  )
}
