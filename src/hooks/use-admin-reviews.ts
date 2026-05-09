import { useQuery } from "@tanstack/react-query"

import { adminReviewsApi, type AdminReviewsQueryParams } from "@/lib/api"

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


