'use client'

import { useEffect, useState } from 'react'
import { stylistsApi } from '@/lib/api'
import type { StylistRowDto } from '@/models/stylists'

export function useStylists() {
  const [data, setData] = useState<StylistRowDto[]>([])
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
    stylistsApi
      .getList({ page, per_page: perPage, search: search || undefined })
      .then((res) => {
        if (cancelled) return
        setData(res.data)
        setTotalPages(res.meta.totalPages)
        setTotal(res.meta.total)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err : new Error('Failed to load stylists'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
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
