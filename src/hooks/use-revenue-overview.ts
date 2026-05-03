'use client'

import { useEffect, useState } from 'react'
import { dashboardApi } from '@/lib/api'
import {
  revenueTabToApiRange,
  type RevenueRangeModel,
} from '@/lib/revenue-dashboard'
import type { RevenueTimeRange } from '@/models/dashboardOverview'

export function useRevenueOverview(activeRange: RevenueTimeRange) {
  const [model, setModel] = useState<RevenueRangeModel | null>(null)
  const [loadedFor, setLoadedFor] = useState<RevenueTimeRange | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await dashboardApi.getRevenueOverview({
          range: revenueTabToApiRange(activeRange),
        })
        if (!cancelled && response.success) {
          setModel(response.data)
          setLoadedFor(activeRange)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch revenue overview:', e)
          setError(e instanceof Error ? e : new Error(String(e)))
          setModel(null)
          setLoadedFor(null)
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
  }, [activeRange])

  const ready = loadedFor === activeRange && model != null

  return { model, loading, error, ready }
}
