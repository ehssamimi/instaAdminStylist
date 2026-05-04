import { useQuery } from "@tanstack/react-query"
import {
  stylistApplicationsApi,
  type StylistApplicationsQueryParams,
} from "@/lib/api"

export function stylistApplicationsQueryKey(
  params: StylistApplicationsQueryParams
) {
  return [
    "stylist-applications",
    "pending",
    params.status,
    params.page,
    params.pageSize,
    params.search ?? "",
  ] as const
}

export function useStylistApplications(params: StylistApplicationsQueryParams) {
  return useQuery({
    queryKey: stylistApplicationsQueryKey(params),
    queryFn: () => stylistApplicationsApi.getPendingList(params),
    staleTime: 60000,
    gcTime: 300000,
  })
}
