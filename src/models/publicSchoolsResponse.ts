export interface PublicSchoolsResponse {
  success: boolean
  data: Data
}

export interface Data {
  current_page: number
  data: Daum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface Daum {
  id: number
  name: string
  contact_email: string
  contact_phone: string
  url_extension: string
  claim_options: string
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  schools: School[]
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

export interface Link {
  url?: string
  label: string
  page?: number
  active: boolean
}
