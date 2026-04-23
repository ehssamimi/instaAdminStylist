"use client"

import React, { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { UserReviewsPageView } from "@/components/user-reviews-page-view"
import { usePageTitle } from "@/hooks/use-page-title"
import {
  countReviewsByStatus,
  filterUserReviewRows,
  mockUserReviewsSeed,
  type UserReviewStatus,
} from "@/lib/mock-user-reviews"

export default function ReviewsPage() {
  const { title } = usePageTitle()
  const [rows, setRows] = useState(() => [...mockUserReviewsSeed])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<UserReviewStatus>("pending")

  const searchedRows = useMemo(
    () => filterUserReviewRows(rows, searchQuery),
    [rows, searchQuery]
  )

  const filteredRows = useMemo(
    () => searchedRows.filter((r) => r.status === activeTab),
    [searchedRows, activeTab]
  )

  const counts = useMemo(() => countReviewsByStatus(rows), [rows])

  const pendingMatchCount = useMemo(
    () => searchedRows.filter((r) => r.status === "pending").length,
    [searchedRows]
  )

  const handleApprove = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    )
    toast.success("Review approved")
  }, [])

  const handleReject = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    )
    toast.success("Review rejected")
  }, [])

  const handleApproveAll = useCallback(() => {
    const pendingIds = searchedRows
      .filter((r) => r.status === "pending")
      .map((r) => r.id)
    if (pendingIds.length === 0) return
    const idSet = new Set(pendingIds)
    setRows((prev) =>
      prev.map((r) =>
        idSet.has(r.id) ? { ...r, status: "approved" as const } : r
      )
    )
    toast.success(
      pendingIds.length === 1
        ? "Review approved"
        : `${pendingIds.length} reviews approved`
    )
  }, [searchedRows])

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title mb-6">{title}</h1>
      <UserReviewsPageView
        rows={filteredRows}
        activeTab={activeTab}
        counts={counts}
        onTabChange={setActiveTab}
        onSearch={setSearchQuery}
        onApprove={handleApprove}
        onReject={handleReject}
        onApproveAll={handleApproveAll}
        disableApproveAll={activeTab !== "pending" || pendingMatchCount === 0}
      />
    </div>
  )
}
