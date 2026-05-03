import type { DashboardOverviewData } from '@/models/dashboardOverview'

/** Local/dev MSW payload (normalized shape — same as `normalizeAdminDashboardPayload` output). */
export const dashboardOverviewMock: DashboardOverviewData = {
  stats: {
    bookingsToday: 42,
    todaysRevenue: 12840.5,
    newApplications: 7,
    reviewsToApprove: 3,
  },
  performance: [
    { date: '2026-05-07', sales: 650 },
    { date: '2026-05-08', sales: 1200 },
    { date: '2026-05-09', sales: 850 },
    { date: '2026-05-10', sales: 1450 },
    { date: '2026-05-11', sales: 1100 },
    { date: '2026-05-12', sales: 1750 },
    { date: '2026-05-13', sales: 1225 },
    { date: '2026-05-14', sales: 1500 },
  ],
  referralSources: [
    { label: 'Stylist', count: 200 },
    { label: 'Instagram', count: 400 },
    { label: 'TikTok', count: 67 },
    { label: 'Friend/Referral', count: 180 },
    { label: 'Online Search', count: 200 },
    { label: 'Other', count: 600 },
  ],
  totalResponses: 1647,
}
