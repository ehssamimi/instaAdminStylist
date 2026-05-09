'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import type { PerformanceRange, PerformancesResponse } from '@/models/adminDashboard'

export function usePerformances() {
  const [range, setRange] = useState<PerformanceRange>('7d')
  const [data, setData] = useState<PerformancesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await dashboardApi.getPerformances({ range })
        if (!cancelled) {
          setData(response)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch performances:', e)
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
