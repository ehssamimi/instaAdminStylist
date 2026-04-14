export interface ExtensionOptionsResponse {
  success: boolean
  data: ExtensionOptionsData
  message: string
}

export interface ExtensionOptionsData {
  current_subscription: CurrentSubscription
  monthly_plans: MonthlyPlan[]
  yearly_plans: YearlyPlan[]
  duration_options: number[]
  max_available_years: number
  remaining_years: number
  product_name: string
  category_name: string
}

export interface CurrentSubscription {
  plan_type: string
  plan_type_display: string
  expiration_date: string
  amount: string
  currency: string
  billing_cycle: string
  status: string
}

export interface MonthlyPlan {
  coverage_duration: number
  standard: string
  premium: string
  service_fee: string
}

export interface YearlyPlan {
  coverage_duration: number
  standard: string
  premium: string
  service_fee: string
  standard_savings_percentage: number
  premium_savings_percentage: number
}
