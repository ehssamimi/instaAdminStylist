export interface CoverageProductStartResponse {
  success: boolean
  data: CoverageProductStartData
  message: string
}

export interface CoverageProductStartData {
  id: number
  status: string
  category: CoverageProductCategory
}

export interface CoverageProductCategory {
  id: number
  name: string
  subtitle: string
  photo_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CoverageProductDetails {
  coverage_for: 'me' | 'someone_else'
  first_name?: string
  last_name?: string
  product_name: string
  model: string
  year?: number
  color?: string
  product_year?: string
  purchase_date?: string
  serial_number?: string
  // Dynamic required data fields
  student_id?: string
  device_year?: string
  student_name?: string
  choose_school?: string
  is_package?: boolean
  required_data?: {
    asset_tag?: string
    model_year?: string
    model_number?: string
  }
}

