"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { UserReviewsPageView } from "@/components/user-reviews-page-view"
import { useAdminReviews } from "@/hooks/use-admin-reviews"
import { usePageTitle } from "@/hooks/use-page-title"
import { adminReviewsApi, getApiErrorMessage } from "@/lib/api"
import type { AdminReviewStatus } from "@/models/adminReviews"

export default function ReviewsPage() {
  const { title } = usePageTitle()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<AdminReviewStatus>("pending")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [disabledReviewIds, setDisabledReviewIds] = useState<Set<string>>(
    () => new Set()
  )

  const {
    data: reviews,
    isLoading,
    error,
  } = useAdminReviews({
    status: activeTab,
    page,
    pageSize,
    ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
  })

  const counts = reviews?.statusCounts ?? { pending: 0, approved: 0, rejected: 0 }

  const rows = useMemo(() => reviews?.data ?? [], [reviews?.data])
  const meta = reviews?.meta ?? {
    page,
    pageSize,
    total: 0,
    totalPages: 1,
  }

  const invalidateReviews = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] })
  }, [queryClient])

  const approveMutation = useMutation({
    mutationFn: (reviewId: string) => adminReviewsApi.approve(reviewId),
    onMutate: (reviewId) => {
      setDisabledReviewIds((prev) => new Set(prev).add(reviewId))
    },
    onSuccess: async () => {
      toast.success("Review approved")
      await invalidateReviews()
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e))
    },
    onSettled: (_data, _error, reviewId) => {
      setDisabledReviewIds((prev) => {
        const next = new Set(prev)
        next.delete(reviewId)
        return next
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (reviewId: string) => adminReviewsApi.reject(reviewId),
    onMutate: (reviewId) => {
      setDisabledReviewIds((prev) => new Set(prev).add(reviewId))
    },
    onSuccess: async () => {
      toast.success("Review rejected")
      await invalidateReviews()
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e))
    },
    onSettled: (_data, _error, reviewId) => {
      setDisabledReviewIds((prev) => {
        const next = new Set(prev)
        next.delete(reviewId)
        return next
      })
    },
  })

  useEffect(() => {
    setPage(1)
  }, [activeTab])

  const handleSearch = useCallback((query: string) => {
    setPage(1)
    setSearchQuery(query)
  }, [])

  const handleApprove = useCallback(
    (id: string) => {
      approveMutation.mutate(id)
    },
    [approveMutation]
  )

  const handleReject = useCallback(
    (id: string) => {
      rejectMutation.mutate(id)
    },
    [rejectMutation]
  )

  const approveAllMutation = useMutation({
    mutationFn: () => adminReviewsApi.approveAll(),
    onSuccess: async () => {
      toast.success("All reviews approved")
      await invalidateReviews()
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e))
    },
  })

  const handleApproveAll = useCallback(() => {
    if (approveAllMutation.isPending) return
    approveAllMutation.mutate()
  }, [approveAllMutation])

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title mb-6">{title}</h1>

      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error instanceof Error
            ? error.message
            : "Unable to load reviews."}
        </p>
      ) : null}

      <UserReviewsPageView
        rows={rows}
        activeTab={activeTab}
        counts={counts}
        onTabChange={setActiveTab}
        onSearch={handleSearch}
        onApprove={handleApprove}
        onReject={handleReject}
        onApproveAll={handleApproveAll}
        disableApproveAll={
          activeTab !== "pending" ||
          meta.total === 0 ||
          approveAllMutation.isPending ||
          disabledReviewIds.size > 0
        }
        disabledReviewIds={disabledReviewIds}
        isLoading={isLoading}
        page={meta.page}
        pageSize={meta.pageSize}
        totalPages={meta.totalPages}
        totalItemCount={meta.total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1)
          setPageSize(size)
        }}
      />
    </div>
  )
}
