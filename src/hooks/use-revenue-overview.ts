'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import type { RevenueOverviewData } from '@/models/revenueOverview'

export function useRevenueOverview() {
  const [data, setData] = useState<RevenueOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const response = await dashboardApi.getRevenueOverview()
        if (!cancelled && response.success) {
          setData(response.data)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch revenue overview:', e)
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
