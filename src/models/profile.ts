export interface ProfileResponse {
  user: User
  profile: Profile
}

export interface User {
  id: number
  email: string
  name: string
}

export interface Profile {
  id: number
  user_id: number
  phone: string | null
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip_code: string
  country: string
  avatar_url: string | null
  created_at: string
  updated_at: string
  pending_email: string | null
  pending_phone: string | null
}
