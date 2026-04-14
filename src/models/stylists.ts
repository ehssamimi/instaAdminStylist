import type { BookingRowDto } from '@/models/bookings'

export interface StylistRowDto {
  id: string
  profile_picture: string | null
  first_name: string
  last_name: string
  speciality: string
  bookings: number
  total_revenue: string
  stylist_since: string
  avg_weekly_availability: string
  avg_weekly_drop_in: string
}

export interface StylistDetailDto extends StylistRowDto {
  email: string
  gender: string | null
  businessName: string | null
  location: string | null
  linkedInUrl: string | null
  tiktokHandle: string | null
  instagramOrFacebook: string | null
  experience: string | null
  website: string | null
  bio: string | null
  specialityTags: string[]
  otherSpecialities: string | null
  recommendShopIds: string[]
  otherShops: string | null
  booking_history: BookingRowDto[]
}

export interface StylistsListResponse {
  success: boolean
  data: StylistRowDto[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface StylistDetailResponse {
  success: boolean
  data: StylistDetailDto | null
}
