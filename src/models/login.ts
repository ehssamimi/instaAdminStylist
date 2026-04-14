export interface loginResponse {
  accessToken: string
  refreshToken: string
  user: User
  message: string
}

/** POST /auth/refresh-token response */
export interface RefreshTokenResponse {
  accessToken: string
  /** If the API rotates refresh tokens, persist when present */
  refreshToken?: string
}

export interface RefreshTokenRequestBody {
  refreshToken: string
}

export interface User {
  id: number
  type: string
  email: string
  created_at?: string
  updated_at?: string
  isActive: boolean
  isVerified: boolean
}

export interface SignupFormDataTypes {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  smsVerificationCode: string;
  studentName: string;
  studentEmail: string;
  school: string;
  studentId: string;
  modelNumber: string;
  modelYear: string;
  serial_number?: string;
  asset_tag?: string;
  model_number?: string;
  model_year?: string;
  color?: string;
  phoneNumber: string;
  coverage_product_id: number;
  product_name: string;
  plan_type: 'yearly_standard' | 'yearly_premium' | 'monthly_standard' | 'monthly_premium' | null;
  coverage_duration: number;
  category: number;
  productCost: string;
  plan_price: number;
  billing_cycle: 'monthly' | 'yearly';
  expiration_date: string;
  policy_number: string;

}


export interface FormErrorsTypes {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode?: string;
  smsVerificationCode?: string;
  studentName?: string;
  studentEmail?: string;
  school?: string;
  studentId?: string;
  modelNumber?: string;
  modelYear?: string;
  serialNumber?: string;
  assetTag?: string;
  phoneNumber?: string;
  receipt?: string;
}
