export interface CategoryResponse {
  data: Category
  success: boolean
}
export interface CategoryActiveResponse {
  data: CategoryItem[]
  success: boolean
}
export interface Category {
  current_page: number
  data: CategoryItem[]
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

export interface CategoryItem {
  id: number
  name: string
  subtitle?: string
  description?: string
  photo_url?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Link {
  url?: string
  label: string
  page?: number
  active: boolean
}
