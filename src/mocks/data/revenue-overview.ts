import type { RevenueOverviewData } from '@/models/revenueOverview'
import type { SalesByRange, SalesDataPoint } from '@/models/dashboardOverview'

/** @deprecated Offline-only: bundled series used to build range-shaped mocks. */
const revenueSalesByRangeMock = {
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
} satisfies SalesByRange

const revenueSalesAllTimeMock: SalesDataPoint[] = [
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
]

const revenueSummaryByTab = {
  '7d': { totalRevenue: 1080, bookings: 30 },
  '90d': { totalRevenue: 12_450, bookings: 340 },
  '180d': { totalRevenue: 24_600, bookings: 680 },
  '365d': { totalRevenue: 50_200, bookings: 1390 },
} as const

/** Keys match what the revenue proxy sends (`week` from UI `past_week`) and direct queries. */
const TAB_FOR_API_RANGE: Record<
  string,
  keyof typeof revenueSalesByRangeMock
> = {
  past_week: '7d',
  week: '7d',
  '3m': '90d',
  '6m': '180d',
  '1y': '365d',
}

/**
 * Live-API-shaped JSON for one `range` query (for dev / ADMIN_API_USE_MOCK when backend is off).
 */
export function revenueOverviewMockAsLiveApi(range: string): {
  platformRevenue: number
  totalBookings: number
  avgRevenue: number
  performance: { date: string; revenue: number }[]
} {
  const tab = TAB_FOR_API_RANGE[range] ?? '7d'
  const series = revenueSalesByRangeMock[tab]
  const summary = revenueSummaryByTab[tab]
  const { totalRevenue, bookings } = summary
  return {
    platformRevenue: totalRevenue,
    totalBookings: bookings,
    avgRevenue: bookings > 0 ? totalRevenue / bookings : 0,
    performance: series.map((p) => ({ date: p.date, revenue: p.sales })),
  }
}

/**
 * @deprecated Legacy bundled mock. Prefer {@link revenueOverviewMockAsLiveApi} for `/api/admin/revenue`.
 */
export const revenueOverviewMock: RevenueOverviewData = {
  salesByRange: revenueSalesByRangeMock,
  salesAllTime: revenueSalesAllTimeMock,
  summaryByRange: revenueSummaryByTab,
}
