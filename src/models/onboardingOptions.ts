export type OnboardingOptionMeta = {
  allowsTextInput?: boolean
  textInputPlaceholder?: string
} | null

/** Row from `GET /api/onboarding/options` */
export type OnboardingOption = {
  id: string
  option: string
  screenType: string
  userType: string
  key: string | null
  label: string | null
  imageUrl: string | null
  meta: OnboardingOptionMeta
  createdAt: string
  updatedAt: string
}
