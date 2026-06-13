'use client'

import { useEffect, useState } from 'react'
import { bookingsApi } from '@/lib/api'
import type { BookingDetailDto } from '@/models/bookings'

export function useBookingDetail(id: string) {
  const [data, setData] = useState<BookingDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [fetchCount, setFetchCount] = useState(0)

  useEffect(() => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    void (async () => {
      try {
        const response = await bookingsApi.getById(id)
        if (!cancelled) {
          setData(response.data)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
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
  }, [id, fetchCount])

  const refetch = () => setFetchCount((c) => c + 1)

  return { data, loading, error, refetch }
}
