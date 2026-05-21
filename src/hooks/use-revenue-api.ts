'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import type { RevenueTimeRange } from '@/models/dashboardOverview'
import type { RevenueRangeModel } from '@/models/revenueOverview'

export function useRevenueApi() {
  const [range, setRange] = useState<RevenueTimeRange>('week')
  const [data, setData] = useState<RevenueRangeModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await dashboardApi.getRevenueOverview({ range })
        if (!cancelled) {
          setData(response.data)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch revenue:', e)
          setError(e instanceof Error ? e : new Error(String(e)))
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [range])

  return { data, loading, error, range, setRange }
}
