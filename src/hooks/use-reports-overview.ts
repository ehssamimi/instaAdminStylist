"use client"

import { useEffect, useState } from "react"

import type { ReportRow } from "@/lib/mock-reports"
import type { ReportStatus } from "@/models/reports"

/**
 * Uses local mock data until `GET /admin/reports` returns a stable payload.
 * Wire `reportsApi.getList` here when the backend list is available.
 */
export function useReportsOverview(status: ReportStatus) {
  const [data, setData] = useState<ReportRow[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const t = window.setTimeout(() => {
      void (async () => {
        const { filterAndPaginateMockReports } = await import("@/lib/mock-reports")
        const { rows, totalPages: tp, total: tCount } =
          filterAndPaginateMockReports({
            status,
            search,
            page,
            pageSize: perPage,
          })
        if (!cancelled) {
          setData(rows)
          setTotalPages(tp)
          setTotal(tCount)
          setPage((p) => Math.min(p, Math.max(1, tp)))
          setLoading(false)
        }
      })()
    }, 120)

    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [status, page, perPage, search])

  return {
    data,
    loading,
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
