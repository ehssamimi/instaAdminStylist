/** Nested user on pending stylist application (API shape). */
export interface PendingStylistUser {
  id: string
  email: string
  password?: string
  authProvider?: string
  providerId?: string | null
  type?: string
  isActive?: boolean
  isVerified?: boolean
  emailVerificationOtp?: string | null
  emailVerificationOtpExpires?: string | null
  passwordResetToken?: string | null
  passwordResetExpires?: string | null
  firstName: string | null
  lastName: string | null
  phoneNumber?: string | null
  phoneCountryCode?: string | null
  isPhoneVerified?: boolean
  phoneVerifiedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

/** Single item from GET /admin/stylist/pending */
export interface PendingStylistApplication {
  id: string
  userId: string
  businessName: string | null
  gender: string | null
  location: string | null
  instagramHandle: string | null
  facebookHandle: string | null
  tiktokHandle: string | null
  linkedInUrl: string | null
  /** Reference UUID (catalog), not a year count */
  experience: string | null
  platformSource: string | null
  pushNotification: boolean | null
  speciality: string[]
  recommendShops: string[]
  bio: string | null
  imageUrl: string | null
  isVerified: boolean
  available: boolean
  bookingNotification: boolean
  bookingSms: boolean
  bookingEmail: boolean
  bookingReminderNotification: boolean
  bookingReminderSms: boolean
  bookingReminderEmail: boolean
  messageNotification: boolean
  messageSms: boolean
  messageEmail: boolean
  reviewNotification: boolean
  reviewSms: boolean
  reviewEmail: boolean
  availabilityNotification: boolean
  languageSpoken: string[]
  createdAt: string
  updatedAt: string
  user: PendingStylistUser
  firstName: string | null
  lastName: string | null
  email: string | null
}

export type PendingStylistApplicationsResponse = PendingStylistApplication[]
