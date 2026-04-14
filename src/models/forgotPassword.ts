export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  code: string
}


export interface VerifyPasswordResetOtpResponse {
  success: boolean
  message: string
  reset_token: string
  expires_in: number
}

export interface ResetPasswordRequest {
  reset_token: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}
