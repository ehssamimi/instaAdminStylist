export interface NotificationPreferencesResponse {
  success: boolean
  data: Data
  message?: string
}

export interface Data {
  coverage_updates: CoverageUpdates
  claim_updates: ClaimUpdates
}

export interface CoverageUpdates {
  email: boolean
  push: boolean
  sms: boolean
}

export interface ClaimUpdates {
  email: boolean
  push: boolean
  sms: boolean
}

// Notifications List Types
export interface NotificationItem {
  id: number
  user_id: number
  type: string
  title: string
  body: string
  data: Record<string, unknown>
  status: 'read' | 'unread'
  fcm_message_id: string | null
  sent_at: string | null
  read_at: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface NotificationsResponse {
  success: boolean
  data: {
    current_page: number
    data: NotificationItem[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      page: number | null
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  message: string
}
