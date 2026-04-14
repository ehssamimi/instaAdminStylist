export interface ConfirmPaymentResponse {
  success: boolean
  data: Data
  message: string
}

export interface Data {
  coverage_product: CoverageProduct
  subscription: Subscription2
  payment_info: PaymentInfo
}

export interface CoverageProduct {
  id: number
  user_id: number
  category_id: number
  coverage_for: string
  first_name: string | null
  last_name: string | null
  product_name: string
  model: string
  year: number
  color: string
  product_year: string
  serial_number: string
  purchase_date: string
  receipt_photos: string[]
  coverage_plan: string | null
  coverage_duration: string | null
  coverage_type: string | null
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  subscription_id: number
  policy_number: string
  expiration_date: string
  category: Category
  subscription: Subscription
}

export interface Category {
  id: number
  name: string
  subtitle: string
  photo_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: number
  user_id: number
  coverage_product_id: number
  stripe_customer_id: string
  stripe_subscription_id: string | null
  stripe_payment_intent_id: string
  plan_type: string
  amount: string
  currency: string
  billing_cycle: string
  status: string
  current_period_start: string
  current_period_end: string
  trial_end: string | null
  canceled_at: string | null
  metadata: Metadata
  created_at: string
  updated_at: string
}

export interface Metadata {
  plan_type: string
  plan_display: string
  base_amount: number
  service_fee: number
  total_amount: number
  coverage_duration: number
  billing_cycle: string
  savings: number
  savings_percentage: number
  request_metadata: RequestMetadata
}

export interface RequestMetadata {
  product_price: number
  coverage_duration: number
}

export interface Subscription2 {
  id: number
  user_id: number
  coverage_product_id: number
  stripe_customer_id: string
  stripe_subscription_id: string | null
  stripe_payment_intent_id: string
  plan_type: string
  amount: string
  currency: string
  billing_cycle: string
  status: string
  current_period_start: string
  current_period_end: string
  trial_end: string | null
  canceled_at: string | null
  metadata: Metadata2
  created_at: string
  updated_at: string
}

export interface Metadata2 {
  plan_type: string
  plan_display: string
  base_amount: number
  service_fee: number
  total_amount: number
  coverage_duration: number
  billing_cycle: string
  savings: number
  savings_percentage: number
  request_metadata: RequestMetadata2
}

export interface RequestMetadata2 {
  product_price: number
  coverage_duration: number
}

export interface PaymentInfo {
  amount: string
  currency: string
  status: string
  billing_cycle: string
  plan_type: string
  plan_type_display: string
  next_billing_date: string
  days_until_renewal: number
}


export interface ConfirmPaymentRequest {
  subscription_id: number;
  payment_intent_id: string;
}
