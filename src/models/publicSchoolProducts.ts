export interface PublicSchoolProductsResponse {
  success: boolean
  data: PublicSchoolProducts[]
}

export interface PublicSchoolProducts {
  id: number
  school_id: number
  product_id: number
  start_date: string
  end_date: string
  yearly_coverage_cost: string
  minimal_prorated_cost: string
  minimum_months: number
  total_number_of_devices: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  is_pro_coverage_cost: boolean
  required_data_fields: string[]
  school: School
  product: Product
}

export interface School {
  id: number
  school_district_id: number
  name: string
  logo_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Product {
  id: number
  product_name: string
  category_id: number
  image: unknown
  is_active: boolean
  created_at: string
  updated_at: string
  image_url: unknown
}
