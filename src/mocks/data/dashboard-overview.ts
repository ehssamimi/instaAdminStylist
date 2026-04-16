import type { DashboardOverviewData } from '@/models/dashboardOverview'

/**
 * Static mock aligned with previous in-component mocks (sales area + referral bars).
 * Served by MSW when `NEXT_PUBLIC_API_MOCK=true`; replace backend route when going live.
 */
export const dashboardOverviewMock: DashboardOverviewData = {
  stats: {
    newCoveragesSold: 42,
    todaysSales: 12840.5,
    newClaims: 7,
  },
  salesByRange: {
    '7d': [
      { date: '2026-05-07', sales: 650 },
      { date: '2026-05-08', sales: 1200 },
      { date: '2026-05-09', sales: 850 },
      { date: '2026-05-10', sales: 1450 },
      { date: '2026-05-11', sales: 1100 },
      { date: '2026-05-12', sales: 1750 },
      { date: '2026-05-13', sales: 1225 },
      { date: '2026-05-14', sales: 1500 },
    ],
    '90d': [
      { date: '2026-02-07', sales: 580 },
      { date: '2026-02-20', sales: 1240 },
      { date: '2026-03-05', sales: 900 },
      { date: '2026-03-18', sales: 1520 },
      { date: '2026-03-29', sales: 980 },
      { date: '2026-04-07', sales: 1680 },
      { date: '2026-04-20', sales: 1180 },
      { date: '2026-05-07', sales: 1460 },
    ],
    '180d': [
      { date: '2025-11-01', sales: 520 },
      { date: '2025-12-01', sales: 980 },
      { date: '2026-01-01', sales: 760 },
      { date: '2026-02-01', sales: 1380 },
      { date: '2026-03-01', sales: 940 },
      { date: '2026-04-01', sales: 1700 },
      { date: '2026-04-20', sales: 1140 },
      { date: '2026-05-01', sales: 1480 },
    ],
    '365d': [
      { date: '2025-05-01', sales: 450 },
      { date: '2025-07-01', sales: 1080 },
      { date: '2025-09-01', sales: 760 },
      { date: '2025-11-01', sales: 1490 },
      { date: '2026-01-01', sales: 900 },
      { date: '2026-03-01', sales: 1760 },
      { date: '2026-04-01', sales: 1210 },
      { date: '2026-05-01', sales: 1530 },
    ],
  },
  salesAllTime: [
    { date: '2024-05-01', sales: 820 },
    { date: '2024-07-01', sales: 960 },
    { date: '2024-09-01', sales: 740 },
    { date: '2024-11-01', sales: 1120 },
    { date: '2025-01-01', sales: 890 },
    { date: '2025-03-01', sales: 1340 },
    { date: '2025-05-01', sales: 1010 },
    { date: '2025-07-01', sales: 1280 },
    { date: '2025-09-01', sales: 990 },
    { date: '2025-11-01', sales: 1520 },
    { date: '2026-01-01', sales: 1180 },
    { date: '2026-03-01', sales: 1620 },
    { date: '2026-05-01', sales: 1390 },
  ],
  referralSourcesByRange: {
    '7d': [
      { label: 'Stylist', count: 200 },
      { label: 'Instagram', count: 400 },
      { label: 'TikTok', count: 67 },
      { label: 'Friend/Referral', count: 180 },
      { label: 'Referral (other)', count: 200 },
      { label: 'Other', count: 600 },
    ],
    '90d': [
      { label: 'Stylist', count: 820 },
      { label: 'Instagram', count: 1540 },
      { label: 'TikTok', count: 410 },
      { label: 'Friend/Referral', count: 690 },
      { label: 'Referral (other)', count: 715 },
      { label: 'Other', count: 1280 },
    ],
    '180d': [
      { label: 'Stylist', count: 1680 },
      { label: 'Instagram', count: 3100 },
      { label: 'TikTok', count: 890 },
      { label: 'Friend/Referral', count: 1420 },
      { label: 'Referral (other)', count: 1380 },
      { label: 'Other', count: 2650 },
    ],
    '365d': [
      { label: 'Stylist', count: 3400 },
      { label: 'Instagram', count: 6200 },
      { label: 'TikTok', count: 2100 },
      { label: 'Friend/Referral', count: 2800 },
      { label: 'Referral (other)', count: 2750 },
      { label: 'Other', count: 5200 },
    ],
  },
}
