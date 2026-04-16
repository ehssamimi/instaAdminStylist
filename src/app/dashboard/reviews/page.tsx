"use client"

import React, { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { UserReviewsPageView } from "@/components/user-reviews-page-view"
import { usePageTitle } from "@/hooks/use-page-title"
import {
  filterUserReviewRows,
  mockUserReviewsSeed,
} from "@/lib/mock-user-reviews"

export default function ReviewsPage() {
  const { title } = usePageTitle()
  const [rows, setRows] = useState(() => [...mockUserReviewsSeed])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRows = useMemo(
    () => filterUserReviewRows(rows, searchQuery),
    [rows, searchQuery]
  )

  const removeById = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const handleApprove = useCallback(
    (id: string) => {
      removeById(id)
      toast.success("Review approved")
    },
    [removeById]
  )

  const handleReject = useCallback(
    (id: string) => {
      removeById(id)
      toast.success("Review rejected")
    },
    [removeById]
  )

  const handleApproveAll = useCallback(() => {
    const ids = new Set(filteredRows.map((r) => r.id))
    if (ids.size === 0) return
    setRows((prev) => prev.filter((r) => !ids.has(r.id)))
    toast.success(
      ids.size === 1
        ? "Review approved"
        : `${ids.size} reviews approved`
    )
  }, [filteredRows])

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title mb-6">{title}</h1>
      <UserReviewsPageView
        rows={filteredRows}
        onSearch={setSearchQuery}
        onApprove={handleApprove}
        onReject={handleReject}
        onApproveAll={handleApproveAll}
      />
    </div>
  )
}
