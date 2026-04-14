'use client'

import { useEffect, useState } from 'react'
import { bookingsApi } from '@/lib/api'
import type { BookingRowDto } from '@/models/bookings'

export function useBookingsOverview() {
  const [data, setData] = useState<BookingRowDto[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    void (async () => {
      try {
        const response = await bookingsApi.getOverview({
          page,
          limit: perPage,
          search: search || undefined,
        })
        if (!cancelled) {
          setData(response.data)
          setTotalPages(response.meta.totalPages)
          setTotal(response.meta.total)
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
  }, [page, perPage, search])

  return {
    data,
    loading,
    error,
    page,
    perPage,
    totalPages,
    total,
    search,
    setPage,
    setPerPage,
    setSearch,
  }
}
