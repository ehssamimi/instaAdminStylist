import { useQuery } from "@tanstack/react-query"
import { onboardingApi } from "@/lib/api"

/** `screen_type` values for stylist onboarding option screens */
export const STYLIST_ONBOARDING_SCREEN = {
  speciality: "stylist_speciality",
  recommendedShops: "stylist_recommended_shops",
} as const

export const STYLIST_ONBOARDING_USER_TYPE = "stylist" as const

function sortOnboardingOptions<T extends { option: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) =>
    (a.option || "").localeCompare(b.option || "", undefined, {
      sensitivity: "base",
    })
  )
}

export function useOnboardingOptions(
  screenType: string,
  userType: string = STYLIST_ONBOARDING_USER_TYPE
) {
  return useQuery({
    queryKey: ["onboarding-options", screenType, userType],
    queryFn: async () => {
      const data = await onboardingApi.getOptions({
        screen_type: screenType,
        user_type: userType,
      })
      return sortOnboardingOptions(data)
    },
    staleTime: 60 * 60 * 1000,
  })
}
