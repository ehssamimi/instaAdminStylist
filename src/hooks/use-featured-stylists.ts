'use client'

import { useCallback, useEffect, useState } from 'react'

import { stylistsApi } from '@/lib/api'
import type { StylistRowDto } from '@/models/stylists'

export function useFeaturedStylists() {
  const [data, setData] = useState<StylistRowDto[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOnce = useCallback(async () => {
    return stylistsApi.getFeaturedList({
      page,
      limit: perPage,
      ...(search.trim() ? { search: search.trim() } : {}),
    })
  }, [page, perPage, search])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchOnce()
      .then((response) => {
        if (!cancelled) {
          setData(response.data)
          setTotalPages(response.meta.totalPages)
          setTotal(response.meta.total)
          setPage((p) => Math.min(p, Math.max(1, response.meta.totalPages)))
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)))
          setData([])
          setTotalPages(1)
          setTotal(0)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [fetchOnce])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchOnce()
      setData(response.data)
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
      setPage((p) => Math.min(p, Math.max(1, response.meta.totalPages)))
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      setData([])
      setTotalPages(1)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [fetchOnce])

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
    refetch,
  }
}
