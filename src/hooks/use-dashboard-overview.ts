'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import type { DashboardOverviewRange } from '@/models/adminDashboard'
import type { DashboardOverviewData } from '@/models/dashboardOverview'

export function useDashboardOverview() {
  const [range, setRange] = useState<DashboardOverviewRange>('past_week')
  const [data, setData] = useState<DashboardOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await dashboardApi.getOverview({ range })
        if (!cancelled && response.success) {
          setData(response.data)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch dashboard overview:', e)
          setError(e instanceof Error ? e : new Error(String(e)))
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [range])

  return { data, loading, error, range, setRange }
}
