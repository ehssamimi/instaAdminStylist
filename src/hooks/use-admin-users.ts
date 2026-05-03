import { useQuery } from "@tanstack/react-query"
import { adminUsersApi, type AdminUsersQueryParams } from "@/lib/api"

export function adminUsersQueryKey(params: AdminUsersQueryParams) {
  return [
    "admin-users",
    params.page,
    params.pageSize,
    params.search?.trim() ?? "",
  ] as const
}

export function useAdminUsers(params: AdminUsersQueryParams) {
  return useQuery({
    queryKey: adminUsersQueryKey(params),
    queryFn: () => adminUsersApi.list(params),
    staleTime: 60_000,
    gcTime: 300_000,
  })
}
