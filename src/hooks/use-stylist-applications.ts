import { useQuery } from "@tanstack/react-query"
import {
  stylistApplicationsApi,
  type StylistApplicationsQueryParams,
} from "@/lib/api"
import { getMockStylistApplicationsPage } from "@/lib/mock-stylist-applications"

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
    queryFn: async () => {
      try {
        return await stylistApplicationsApi.getPendingList(params)
      } catch {
        return getMockStylistApplicationsPage(params)
      }
    },
    staleTime: 60000,
    gcTime: 300000,
  })
}
