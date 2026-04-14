import { CategoryItem } from "./category"

export interface WarrantyPricingResponse {
  success: boolean
  data: WarrantyPricing
  message: string
}

export interface WarrantyPricing {
  current_page: number
  data: WarrantyPricingItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export interface WarrantyPricingItem {
  id: number
  category_id: number
  retail_min: string
  retail_max: string
  coverage_duration: number
  yearly_standard: string
  yearly_premium: string
  monthly_standard: string
  monthly_premium: string
  service_fee: string
  is_active: boolean
  created_at: string
  updated_at: string
  category: CategoryItem
}


export interface Link {
  url?: string
  label: string
  page?: number
  active: boolean
}

export type WarrantyPriceFormData = {
  "id"?: number | string,
  "category_id": number | string,
  "retail_min": number | string,
  "retail_max": number | string,
  "coverage_duration": number | string,
  "yearly_standard": number | string,
  "yearly_premium": number | string,
  "monthly_standard": number | string,
  "monthly_premium": number | string,
  "service_fee": number | string,
  "is_active": boolean
}