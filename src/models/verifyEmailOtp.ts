export interface VerifyEmailOtpRequest {
  email: string
  otp: string
  /** Sent to API when required (e.g. device fingerprint label). */
  device_name?: string
}

export interface VerifyEmailOtpResponse {
  message: string
  token: string
  user: User
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  phone_verified_at: any
  social_provider: any
  social_id: any
}
