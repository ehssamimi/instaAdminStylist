export interface PublicSchoolResponse {
  success: boolean
  data: Data
}

export interface Data {
  district_id: number
  district_name: string
  contact_email: string
  logo_url: string | null
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
