'use client'

import { useEffect, useState } from 'react'
import { stylistsApi } from '@/lib/api'
import type { StylistDetailDto } from '@/models/stylists'

export function useStylistDetail(id: string) {
  const [data, setData] = useState<StylistDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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
  }, [id])

  return { data, loading, error }
}
