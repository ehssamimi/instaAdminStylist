import { useQuery } from "@tanstack/react-query"
import { stylistApplicationsApi } from "@/lib/api"
import { MOCK_PENDING_STYLIST_APPLICATIONS } from "@/lib/mock-stylist-applications"

const PENDING_QUERY_KEY = ["stylist-applications", "pending"] as const

export function usePendingStylistApplications() {
  return useQuery({
    queryKey: PENDING_QUERY_KEY,
    queryFn: async () => {
      try {
        const applications = await stylistApplicationsApi.getPending()
        if (applications.length > 0) {
          const ids = new Set(applications.map((item) => item.id))
          const missingMocks = MOCK_PENDING_STYLIST_APPLICATIONS.filter(
            (item) => !ids.has(item.id)
          )
          return [...applications, ...missingMocks]
        }
      } catch {
        // Keep dashboard previewable when backend data is unavailable.
      }

      return MOCK_PENDING_STYLIST_APPLICATIONS
    },
    staleTime: 120000,
    gcTime: 120000,
  })
}

export { PENDING_QUERY_KEY }
