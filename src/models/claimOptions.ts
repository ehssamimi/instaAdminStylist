export interface ClaimOptionsResponse {
  success: boolean
  data: ClaimOptionType[]
}

export interface ClaimOptionType {
  value: string
  label: string
}

export interface ClaimsResponse {
  success: boolean
  data: ClaimOptions
  message: string
}
export interface ClaimOptions {
  current_page: number
  data: ClaimOption[]
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

export interface ClaimStatus {
  key: string
  title: string
  description: string
  state: string
  timestamp: string | null
  timestamp_raw: string | null
}

export interface ClaimOption {
  id: number
  user_id: number
  coverage_product_id: number
  category_image_url: string
  claim_number: string
  status: string
  incident_date: string
  incident_location: string
  incident_description: string
  approved_amount: number | null
  payment_method: string
  payment_email: string
  admin_notes: string | null
  submitted_at: string
  reviewed_at: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  text_status?: string
  claim_statuses?: ClaimStatus[]
  user?: User
  coverage_product: CoverageProduct
  attachments: Attachment[]
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  phone_verified_at: string | null
}

export interface CoverageProduct {
  id: number
  user_id: number
  category_id: number
  category_image_url: string
  coverage_for: string
  first_name: string | null
  last_name: string | null
  product_name: string
  model: string
  year: number
  color: string
  product_year: string
  serial_number: string | null
  purchase_date: string
  receipt_photos: string[]
  coverage_plan: string | null
  coverage_duration: number | null
  coverage_type: string | null
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  subscription_id: number
  policy_number?: string
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

export interface Link {
  url?: string
  label: string
  page?: number
  active: boolean
}

// Claim Response
export interface ClaimResponse {
  success: boolean
  data: ClaimOption
  message: string
}
export interface ClaimAdminResponse {
  success: boolean
  data: ClaimResponseItem
  message: string
}

export interface ClaimResponseItem {
  claim_header: ClaimHeader
  device_info: DeviceInfo
  incident_details: IncidentDetails
  coverage_plan: CoveragePlan
  customer: Customer
}

export interface Customer {
  email: string
  name: string
  phone: string
}

export interface ClaimHeader {
  claim_number: string
  policy_number: string
  status: string
  status_display: string
}

export interface DeviceInfo {
  device_name: string
  model: string
  serial_number: string
  purchase_date: string
  color: string
  receipt_photos: string[]
}

export interface IncidentDetails {
  incident_date: string
  incident_location: string
  incident_description: string
  uploaded_files: UploadedFiles
}

export interface UploadedFiles {
  count: number
  files: File[]
}

export interface File {
  id: number
  file_name: string
  file_url: string
  file_type: string
}

export interface CoveragePlan {
  plan: string
  coverage_start: string
  coverage_end: string
  deductible: string
  service_fee_deduction: string
  claim_cost: string
  payment_method: string
}

export interface FileClaimPayload {
  coverage_product_id: number;
  incident_date: string;
  incident_location: string;
  incident_description: string;
  payment_method: string;
  payment_email: string;
}
