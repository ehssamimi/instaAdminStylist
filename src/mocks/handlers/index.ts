import { dashboardHandlers } from '@/mocks/handlers/dashboard'
import { revenueHandlers } from '@/mocks/handlers/revenue'
import { stylistsHandlers } from '@/mocks/handlers/stylists'

/** Bookings use the live API; handlers kept in `./bookings` for optional local testing. */
export const handlers = [
  ...dashboardHandlers,
  ...revenueHandlers,
  ...stylistsHandlers,
]
