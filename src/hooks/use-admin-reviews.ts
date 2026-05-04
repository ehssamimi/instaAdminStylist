import { useQueries, useQuery } from "@tanstack/react-query"

import { adminReviewsApi, type AdminReviewsQueryParams } from "@/lib/api"
import {
  adminReviewStatuses,
  type AdminReviewStatus,
} from "@/models/adminReviews"

export function adminReviewsQueryKey(params: AdminReviewsQueryParams) {
  return [
    "admin-reviews",
    params.status,
    params.page,
    params.pageSize,
    params.search?.trim() ?? "",
  ] as const
}

export function useAdminReviews(params: AdminReviewsQueryParams) {
  return useQuery({
    queryKey: adminReviewsQueryKey(params),
    queryFn: () => adminReviewsApi.list(params),
    staleTime: 60_000,
    gcTime: 300_000,
  })
}

export function useAdminReviewCounts(search: string) {
  const queries = useQueries({
    queries: adminReviewStatuses.map((status) => ({
      queryKey: [
        "admin-reviews",
        "count",
        status,
        search.trim(),
      ] as const,
      queryFn: () =>
        adminReviewsApi.list({
          status,
          page: 1,
          pageSize: 1,
          ...(search.trim() ? { search: search.trim() } : {}),
        }),
      staleTime: 60_000,
      gcTime: 300_000,
    })),
  })

  const counts = adminReviewStatuses.reduce(
    (acc, status, index) => {
      acc[status] = queries[index]?.data?.meta.total ?? 0
      return acc
    },
    { pending: 0, approved: 0, rejected: 0 } as Record<
      AdminReviewStatus,
      number
    >
  )

  return {
    counts,
    isLoading: queries.some((q) => q.isLoading),
    error: queries.find((q) => q.error)?.error ?? null,
  }
}

