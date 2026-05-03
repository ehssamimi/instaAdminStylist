export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  email: string
  success: boolean
}


export interface VerifyPasswordResetOtpResponse {
  success: boolean
  message: string
  reset_token: string
  expires_in: number
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

/** POST `/auth/verify-password?token=…` — body is `{ password }` only. */
export interface VerifyPasswordResponse {
  /** When false on HTTP 200, the reset failed without throwing — handle as an error. */
  isValid?: boolean
  success?: boolean
  message?: string
}
