export interface DashboardStatsData {
  newCoveragesSold: number;
  todaysSales: number;
  newClaims: number;
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
