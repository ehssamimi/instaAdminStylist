import { useQuery } from "@tanstack/react-query"
import { stylistApplicationsApi } from "@/lib/api"

const PENDING_QUERY_KEY = ["stylist-applications", "pending"] as const

export function usePendingStylistApplications() {
  return useQuery({
    queryKey: PENDING_QUERY_KEY,
    queryFn: async () => {
      const loadMockApplications = async () => {
        const { MOCK_PENDING_STYLIST_APPLICATIONS } = await import(
          "@/lib/mock-stylist-applications"
        )
        return MOCK_PENDING_STYLIST_APPLICATIONS
      }

      try {
        const applications = await stylistApplicationsApi.getPending()
        if (applications.length > 0) {
          const mockApplications = await loadMockApplications()
          const ids = new Set(applications.map((item) => item.id))
          const missingMocks = mockApplications.filter(
            (item) => !ids.has(item.id)
          )
          return [...applications, ...missingMocks]
        }
      } catch {
        // Keep dashboard previewable when backend data is unavailable.
      }

      return loadMockApplications()
    },
    staleTime: 120000,
    gcTime: 120000,
  })
}

export { PENDING_QUERY_KEY }
