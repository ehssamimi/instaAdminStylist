export interface CoverageProductCategory {
  id: number
  name: string
  subtitle: string
  photo_url: string
}

export interface PaymentPlan {
  plan_type: string
  plan_type_display: string
  billing_cycle: string
  amount: string
  currency: string
  status: string
  next_billing_date: string
  days_until_renewal: number
}

export interface CoverageProduct {
  id: number
  product_price: string
  coverage_for: string
  coverage_for_name: string
  product_name: string
  model: string
  year: number
  color: string
  serial_number: string | null
  purchase_date: string
  product_year: string
  status: string
  coverage_plan: string | null
  coverage_duration: number | null
  coverage_type: string | null
  submitted_at: string
  created_at: string
  updated_at: string
  category: CoverageProductCategory
  claims_count: number
  active_claims_count: number
  can_submit_claims: boolean
  can_be_modified: boolean
  receipt_photos: string[]
  total_cost: string
  expiration_date: string
  payment_plan: PaymentPlan
  policy_number: string
  payment_method: string
  is_package?: boolean
  computed_status: string
}

export interface CoverageProductDetailSubscriptionMetadataPricing {
  plan_type: string;
  plan_display: string;
  base_amount: number;
  service_fee: number;
  total_amount: number;
  coverage_duration: number;
  billing_cycle: string;
  savings: number;
  savings_percentage: number;
}

export interface CoverageProductDetailSubscriptionMetadata {
  stripe_price_id: string;
  plan_type: string;
  pricing: CoverageProductDetailSubscriptionMetadataPricing;
  plan_display: string;
  request_metadata: {
    coverage_duration: number;
    product_price: number;
  };
}

export interface CoverageProductDetailSubscription {
  id: number;
  user_id: number;
  coverage_product_id: number;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_payment_intent_id: string | null;
  plan_type: string;
  amount: string;
  currency: string;
  billing_cycle: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  trial_end: string | null;
  canceled_at: string | null;
  metadata: CoverageProductDetailSubscriptionMetadata;
  created_at: string;
  updated_at: string;
}

export interface CoverageProductDetailClaim {
  id: number;
  coverage_product_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CoverageProductDetail {
  id: number;
  user_id: number;
  category_id: number;
  coverage_for: string | null;
  first_name: string | null;
  last_name: string | null;
  product_name: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  product_year: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  receipt_photos: string[] | null;
  coverage_plan: string | null;
  coverage_duration: number | null;
  coverage_type: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  subscription_id: number;
  policy_number: string;
  payment_method: string;
  expiration_date: string;
  is_package: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    phone_verified_at: string | null;
    social_provider: string | null;
    social_id: string | null;
  };
  category: {
    id: number;
    name: string;
    subtitle: string;
    photo_url: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  subscription: CoverageProductDetailSubscription;
  claims: CoverageProductDetailClaim[];
  renew_eligible: boolean;
  computed_status: string;
  required_data?: {
    asset_tag?: string
    model_year?: string
    model_number?: string
  }
}

export interface CoverageProductDetailResponse {
  success: boolean;
  data: CoverageProductDetail;
  message?: string;
}

export interface CoverageProductsPaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export interface CoverageProductsData {
  current_page: number
  data: CoverageProduct[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: CoverageProductsPaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface CoverageProductsResponse {
  success: boolean
  data: CoverageProductsData
  message: string
}
