import type { BookingRowDto } from '@/models/bookings'

/** Admin customer profile (mock or API). */
export interface CustomerDetailDto {
  id: string
  name: string
  email: string
  profile_picture?: string | null
  total_bookings: number
  total_spend: string
  booking_history: BookingRowDto[]
}

export interface CustomerDetailResponse {
  success: boolean
  data: CustomerDetailDto | null
}
