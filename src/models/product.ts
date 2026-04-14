export interface ProductResponse {
  success: boolean
  data: Product
  message: string
}

export interface Product {
  current_page: number
  data: ProductItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: unknown
  path: string
  per_page: number
  prev_page_url: unknown
  to: number
  total: number
}

export interface ProductItem {
  id: number
  product_name: string
  category_id: number
  image: unknown
  is_active: boolean
  created_at: string
  updated_at: string
  image_url: unknown
  category: Category
}

export interface Category {
  id: number
  name: string
}

export interface Link {
  url?: string
  label: string
  page?: number
  active: boolean
}


export interface SchoolProductRequest {
  school_ids: number[]
  products: SchoolProduct[]
}

export interface SchoolProduct {
  product_id: number
  start_date: string
  end_date: string
  yearly_coverage_cost: number
  is_pro_coverage_cost: boolean
  minimal_prorated_cost: number
  minimum_months: number
  total_number_of_devices: number
  required_data_fields: string[]
}
