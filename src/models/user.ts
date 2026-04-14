import { ClaimOption, ClaimResponseItem } from "./claimOptions"
import { CoverageProduct } from "./coverageProducts"

export interface UserResponse {
  success: boolean
  data: User
}

export interface User {
  current_page: number
  data: UserItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: unknown
  path: string
  per_page: number
  prev_page_url: unknown
  to: number
  total: number
}

export interface UserItem {
  id: number
  name: string
  email: string
  email_verified_at?: string
  is_email_verified: boolean
  roles: Role[]
  profile: unknown
  created_at: string
  updated_at: string
}

export interface UserProfile {
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  avatar_url: string | null
}

export interface OnboardingSubmission {
  id: number
  selected_categories: number[]
  created_at: string
  updated_at: string
}

export interface UserDetails {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  is_email_verified: boolean
  roles: Role[]
  profile: UserProfile
  created_at: string
  updated_at: string
  last_login_at: string | null
  onboarding_submissions: OnboardingSubmission[]
  coverages: CoverageProduct[]
  claims: ClaimOption[]

}

export interface UserDetailsResponse {
  success: boolean
  data: UserDetails
}

export interface Role {
  id: number
  name: string
  slug: string
}

export interface Link {
  url?: string
  label: string
  page?: number
  active: boolean
}
