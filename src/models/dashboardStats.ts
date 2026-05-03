/** Summary strip on `/dashboard` from `GET /admin/dashboard`. */
export interface DashboardStatsData {
  bookingsToday: number
  todaysRevenue: number
  newApplications: number
  reviewsToApprove: number
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStatsData;
}

export interface DashboardMetricsData {
  date: string;
  sales: number;
}

export interface DashboardMetricsResponse {
  success: boolean;
  data: {
    range: string;
    data: DashboardMetricsData[];
  };
}
