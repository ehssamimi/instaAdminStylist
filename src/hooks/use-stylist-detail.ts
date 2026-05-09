'use client'

import { useCallback, useEffect, useState } from 'react'
import { stylistsApi } from '@/lib/api'
import type { StylistDetailDto } from '@/models/stylists'

export function useStylistDetail(id: string) {
  const [data, setData] = useState<StylistDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [fetchCount, setFetchCount] = useState(0)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    stylistsApi
      .getById(id)
      .then((res) => {
        if (cancelled) return
        if (!res.success || !res.data) {
          setData(null)
          setError(null)
          return
        }
        setData(res.data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err : new Error('Failed to load stylist'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, fetchCount])

  const refetch = useCallback(() => setFetchCount((n) => n + 1), [])

  return { data, loading, error, refetch }
}
