export interface FileClaimResponse {
  success: boolean
  data: Data
  message: string
}

export interface Data {
  user_id: number
  coverage_product_id: number
  claim_number: string
  incident_date: string
  incident_location: string
  incident_description: string
  payment_method: string
  payment_email: string
  status: string
  submitted_at: string
  updated_at: string
  created_at: string
  id: number
  text_status: string
  claim_statuses: Status[]
  coverage_product: CoverageProduct
  attachments: Attachment[]
}
export interface Attachment {
  id: number
  claim_id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
  created_at: string
  updated_at: string
}
export interface Status {
  key: string
  title: string
  description: string
  state: string
  timestamp?: string
  timestamp_raw?: string
}

export interface CoverageProduct {
  id: number
  user_id: number
  category_id: number
  coverage_for: string
  first_name: string
  last_name: string
  product_name: string
  model: string
  year: number
  color: string
  product_year: string
  serial_number: string
  purchase_date: string
  receipt_photos: string[]
  coverage_plan: string
  coverage_duration: string
  coverage_type: string
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  subscription_id: number
  policy_number: string
}
