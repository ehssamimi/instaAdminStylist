'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import type { DashboardOverviewData } from '@/models/dashboardOverview'

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const response = await dashboardApi.getOverview()
        if (!cancelled && response.success) {
          setData(response.data)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch dashboard overview:', e)
          setError(e instanceof Error ? e : new Error(String(e)))
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
  }, [])

  return { data, loading, error }
}
