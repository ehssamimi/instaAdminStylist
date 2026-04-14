/**
 * Admin API route handlers serve local mock JSON when:
 * - Running in development and the feature's NEXT_PUBLIC_*_USE_LIVE_API is not "true", or
 * - ADMIN_API_USE_MOCK is "true" (e.g. Vercel deploy without a matching backend yet).
 */
export function adminRouteUsesMock(useLiveApiEnvIsTrue: boolean): boolean {
  if (useLiveApiEnvIsTrue) return false
  if (process.env.NODE_ENV === 'development') return true
  return process.env.ADMIN_API_USE_MOCK === 'true'
}
