import { revenueHandlers } from '@/mocks/handlers/revenue'
import { stylistsHandlers } from '@/mocks/handlers/stylists'

/**
 * Dashboard is intentionally **not** mocked here: requests go to `/api/admin/dashboard`,
 * which proxies to `NEXT_PUBLIC_API_URL`. Import `./dashboard` handlers locally if you need
 * offline-only dashboard mocks.
 *
 * Bookings handlers live in `./bookings` for optional local testing.
 */
export const handlers = [...revenueHandlers, ...stylistsHandlers]
