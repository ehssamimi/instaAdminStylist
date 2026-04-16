import { z } from "zod"

export const bookingRowSchema = z.object({
  id: z.string(),
  booking_id: z.string(),
  date: z.string(),
  stylist: z.string(),
  customer: z.string(),
  duration: z.string(),
  total_cost: z.string(),
  service_fee: z.string(),
  call_type: z.string(),
  status: z.string(),
})

export type BookingRow = z.infer<typeof bookingRowSchema>
