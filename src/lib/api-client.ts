import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import type { RefreshTokenResponse } from '@/models/login'
import {
  getRefreshToken,
  removeToken,
  setRefreshToken,
  updateAccessToken,
} from '@/lib/jwt-utils'

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const SKIP_REFRESH_PATHS = new Set([
  '/auth/login',
  '/auth/refresh-token',
  '/auth/verify-email-otp',
  '/auth/resend-email-otp',
  '/auth/forgot-password',
  '/auth/verify-password-reset-otp',
  '/auth/reset-password',
  '/auth/signup',
])

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return true
  const path = url.split('?')[0] ?? ''
  return SKIP_REFRESH_PATHS.has(path)
}

/** No auth interceptors — used only for refresh to avoid recursion */
const refreshClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
const queue: Array<{
  resolve: (t: string) => void
  reject: (e: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => {
    if (error != null) reject(error)
    else if (token) resolve(token)
    else reject(new Error('Session refresh failed'))
  })
  queue.length = 0
}

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const path = config.url?.split('?')[0] ?? ''
      if (path === '/auth/refresh-token') {
        delete config.headers.Authorization
      } else {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    }

    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
    })

    return config
  },
  (error: AxiosError) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    })

    return response
  },
  async (error: AxiosError) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    })
    console.log('error.config?.url', error)

    const originalRequest = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      originalRequest &&
      typeof window !== 'undefined'
    ) {
      if (shouldSkipRefresh(originalRequest.url)) {
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        removeToken()
        window.location.href = '/admin-login'
        return Promise.reject(error)
      }

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        removeToken()
        window.location.href = '/admin-login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject })
        })
          .then((newToken) => {
            if (!originalRequest.headers) {
              originalRequest.headers = {} as RetryableRequestConfig['headers']
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await refreshClient.post<RefreshTokenResponse>(
          '/auth/refresh-token',
          { refreshToken }
        )
        const newAccess = data.accessToken
        updateAccessToken(newAccess)
        if (data.refreshToken) {
          setRefreshToken(data.refreshToken)
        }
        processQueue(null, newAccess)
        if (!originalRequest.headers) {
          originalRequest.headers = {} as RetryableRequestConfig['headers']
        }
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return await apiClient(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        removeToken()
        window.location.href = '/admin-login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 403) {
      console.warn('Access forbidden - insufficient permissions')
    }

    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error occurred')
    }

    return Promise.reject(error)
  }
)

export default apiClient

export type { AxiosResponse, AxiosError, InternalAxiosRequestConfig }
