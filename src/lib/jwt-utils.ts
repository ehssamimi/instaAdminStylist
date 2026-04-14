import { User } from '@/models/login'

export const REFRESH_TOKEN_KEY = 'refreshToken'

/**
 * Gets user information from a JWT token stored in localStorage
 * @returns User object or null if no valid token
 */
export function getUserFromToken(): User | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<User>
    if (parsed.id == null || typeof parsed.email !== 'string') return null
    return {
      id: parsed.id,
      type: parsed.type ?? '',
      email: parsed.email,
      isActive: parsed.isActive ?? false,
      isVerified: parsed.isVerified ?? false,
      ...(parsed.created_at !== undefined && { created_at: parsed.created_at }),
      ...(parsed.updated_at !== undefined && { updated_at: parsed.updated_at }),
    }
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

/**
 * Gets the raw token from localStorage
 * @returns token string or null
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(refreshToken: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearRefreshToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Updates access token in localStorage and cookie (middleware / PrivateRoute).
 */
export function updateAccessToken(accessToken: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', accessToken)
  document.cookie = `token=${accessToken}; path=/`
}

/**
 * Stores access (+ optional refresh) and syncs access token cookie.
 */
export function persistSession(accessToken: string, refreshToken?: string): void {
  updateAccessToken(accessToken)
  if (refreshToken) setRefreshToken(refreshToken)
}

/**
 * Removes the token from localStorage and cookies
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem('user')
  // Clear cookies
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

/**
 * Stores a token in localStorage
 * @param token JWT token string
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}
