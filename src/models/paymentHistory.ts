export interface PaymentHistoryItem {
  id: number;
  coverage_subscription_id: number;
  stripe_payment_intent_id: string;
  stripe_charge_id: string;
  amount: string;
  currency: string;
  status: string;
  payment_method: string;
  failure_reason: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  subscription: {
    id: number;
    user_id: number;
    coverage_product_id: number;
    stripe_customer_id: string;
    stripe_subscription_id: string | null;
    stripe_payment_intent_id: string;
    plan_type: string;
    amount: string;
    currency: string;
    billing_cycle: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    trial_end: string | null;
    canceled_at: string | null;
    metadata: {
      plan_type: string;
      plan_display: string;
      base_amount: number;
      service_fee: number;
      total_amount: number;
      coverage_duration: number;
      billing_cycle: string;
      savings: number;
      savings_percentage: number;
    };
    created_at: string;
    updated_at: string;
    coverage_product: {
      id: number;
      user_id: number;
      category_id: number;
      coverage_for: string;
      first_name: string | null;
      last_name: string | null;
      product_name: string;
      model: string;
      year: number;
      color: string;
      product_year: string;
      serial_number: string;
      purchase_date: string;
      receipt_photos: string[];
      coverage_plan: string | null;
      coverage_duration: number | null;
      coverage_type: string | null;
      status: string;
      submitted_at: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      subscription_id: number;
      policy_number: string;
    };
  };
}

export interface PaymentHistoryResponse {
  success: boolean;
  data: {
    current_page: number;
    data: PaymentHistoryItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string;
}

