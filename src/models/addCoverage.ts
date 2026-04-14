import type { CoverageProductDetails } from '@/models/coverageProductStart';

export interface AddCoveragePayload {
  category: number;
  coverage_product_id: number;
  coverage_for: string;
  first_name: string;
  last_name: string;
  email: string;
  model: string;
  color: string;
  product_year: string;
  product_name: string;
  productCost: string;
  serial_number: string;
  purchase_date: string;
  receipt: File | null;
  // Plan selection
  plan_type: 'yearly_standard' | 'yearly_premium' | 'monthly_standard' | 'monthly_premium' | null;
  billing_cycle: 'monthly' | 'yearly';
  plan_price: number;
  coverage_duration: number; // in months
  // Additional required data fields
  asset_tag: string;
  student_id: string;
  model_number: string;
  model_year: string;
  device_year: string;
  student_name: string;
  choose_school: string;
  productDetailsSubmitted?: boolean;
  /** Snapshot of product details last successfully submitted; used to detect changes and re-submit when needed */
  lastSubmittedProductDetails?: CoverageProductDetails | null;
}

export const initialAddCoveragePayload: AddCoveragePayload = {
  category: 0,
  coverage_product_id: 0,
  coverage_for: '',
  first_name: '',
  last_name: '',
  email: '',
  model: '',
  color: '',
  product_year: '',
  product_name: '',
  productCost: '',
  serial_number: '',
  purchase_date: '',
  receipt: null,
  plan_type: null,
  billing_cycle: 'monthly',
  plan_price: 0,
  coverage_duration: 12, // Default to 12 months (1 year)
  // Additional required data fields
  asset_tag: '',
  student_id: '',
  model_number: '',
  model_year: '',
  device_year: '',
  student_name: '',
  choose_school: '',
  productDetailsSubmitted: false,
};

