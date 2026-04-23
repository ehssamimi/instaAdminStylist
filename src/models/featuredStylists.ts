/**
 * `GET /api/admin/featured-stylists` (e.g. `?page=1&limit=10`).
 */
export interface FeaturedStylistListMetadata {
  limit: number
  page: number
  totalCount: number
  totalPages: number
}

export interface FeaturedStylistApiItem {
  id: string
  name: string
  profilePicture: string | null
  rating: number
  speciality: string
  price: number
  sessionDuration: number
  availableNow: boolean
  order: number
  totalBookings: number
  totalSales: number
}

export interface FeaturedStylistsListResponse {
  metadata: FeaturedStylistListMetadata
  data: FeaturedStylistApiItem[]
}
