export interface MonthlyPlan {
  coverage_duration: number;
  standard: string;
  premium: string;
  service_fee: string;
}

export interface YearlyPlan {
  coverage_duration: number;
  standard: string;
  premium: string;
  service_fee: string;
  standard_savings_percentage: number;
  premium_savings_percentage: number;
}

export interface CoveragePlansData {
  category: {
    id: number;
    name: string;
  };
  product_price: string;
  monthly_plans: MonthlyPlan[];
  yearly_plans: YearlyPlan[];
}

export interface CoveragePlansResponse {
  success: boolean;
  data: CoveragePlansData;
  message: string;
}


