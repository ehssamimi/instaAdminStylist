import { loginResponse, RefreshTokenRequestBody, RefreshTokenResponse } from '@/models/login'
import apiClient, { AxiosResponse } from './api-client'
import { AxiosRequestConfig } from 'axios'
import { CategoryActiveResponse, CategoryItem, CategoryResponse } from '@/models/category'
import { UserResponse, UserDetailsResponse } from '@/models/user'
import { ProductResponse, SchoolProductRequest } from '@/models/product'
import { WarrantyPriceFormData, WarrantyPricingItem, WarrantyPricingResponse } from '@/models/warrantyPricing'
import { CoverageDurationsResponse } from '@/models/coverageDurations'
import { ClaimAdminResponse, ClaimOptionsResponse, ClaimResponse, ClaimsResponse, FileClaimPayload } from '@/models/claimOptions'
import { CoverageProductDetails, CoverageProductStartResponse } from '@/models/coverageProductStart'
import { CoverageProductsResponse, CoverageProductDetailResponse } from '@/models/coverageProducts'
import { ProfileResponse } from '@/models/profile'
import { NotificationPreferencesResponse, NotificationsResponse } from '@/models/notifications'
import { PublicSchoolProductsResponse } from '@/models/publicSchoolProducts'
import { FileClaimResponse } from '@/models/FileClaimResponse'
import { PaymentHistoryResponse } from '@/models/paymentHistory'
import { PaymentMethodsResponse } from '@/models/paymentMethods'
import { CoveragePlansResponse } from '@/models/coveragePlans'
import { ConfirmPaymentRequest, ConfirmPaymentResponse } from '@/models/confirmPayment'
import { PublicSchoolResponse } from '@/models/publicSchoolResponse'
import { PublicSchoolsResponse } from '@/models/publicSchoolsResponse'
import { ExtensionOptionsResponse } from '@/models/extensionOptions'
import {
  CreateExtensionPaymentIntentRequest,
  CreateExtensionPaymentIntentResponse,
  ConfirmExtensionPaymentRequest,
  ConfirmExtensionPaymentResponse
} from '@/models/extensionPayment'
import { ForgotPasswordResponse, VerifyPasswordResetOtpResponse, ResetPasswordRequest, ResetPasswordResponse } from '@/models/forgotPassword'
import { VerifyEmailOtpRequest, VerifyEmailOtpResponse } from '@/models/verifyEmailOtp'
import { DashboardStatsResponse, DashboardMetricsResponse } from '@/models/dashboardStats'
import { DashboardOverviewResponse } from '@/models/dashboardOverview'
import {
  AdminBookingsListResponse,
  BookingDetailResponse,
  BookingsListNormalized,
  normalizeAdminBookingListItem,
  normalizeBookingDetailFromApi,
} from '@/models/bookings'
import { StylistDetailResponse, StylistsListResponse } from '@/models/stylists'
import { DuplicatedProductsResponse } from '@/models/duplicatedProducts'
import { PendingStylistApplicationsResponse } from '@/models/stylistApplication'
import type { AdminFeeDto, AdminFeePutItem } from '@/models/fees'
import type { ReportStatus } from '@/models/reports'

// Generic API utility functions
export const api = {
  // GET request
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config)
    return response.data
  },

  // POST request
  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config)
    return response.data
  },

  // PUT request
  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config)
    return response.data
  },

  // PATCH request
  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config)
    return response.data
  },

  // DELETE request
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config)
    return response.data
  },
}

// Authentication specific API calls
export const authApi = {
  login: async (credentials: { email: string; password: string;}) => {
    return api.post<loginResponse>('/auth/login', credentials)
  },

  signup: async (data: { name: string; email: string; password: string; password_confirmation: string; role: string }) => {
    return api.post('/auth/signup', data)
  },

  verifyEmailOtp: async (data: VerifyEmailOtpRequest) => {
    return api.post<VerifyEmailOtpResponse>('/auth/verify-email-otp', data)
  },
  verifyPasswordResetOtp: async (data: { email: string; otp: string; }) => {
    return api.post<VerifyPasswordResetOtpResponse>('/auth/verify-password-reset-otp', data)
  },

  resendEmailOtp: async (data: { email: string }) => {
    return api.post('/auth/resend-email-otp', data)
  },

  logout: async () => {
    return api.post('/auth/logout')
  },

  refreshToken: async (body: RefreshTokenRequestBody) => {
    return api.post<RefreshTokenResponse>('/auth/refresh-token', body)
  },

  forgotPassword: async (email: string) => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', { email })
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    return api.post<ResetPasswordResponse>('/auth/reset-password', data)
  },
  addPhone: async (data: { email: string; phone: string }) => {
    return api.post('/auth/add-phone', data)
  },
  verifyPhoneNumber: async (data: { phone: string; code: string }) => {
    return api.post('/auth/verify-phone-otp', data)
  },
  resendAddPhoneOtp: async (data: { phone: string }) => {
    return api.post('/auth/resend-add-phone-otp', data)
  },
  addOrganizationMember: async (data: { first_name: string, last_name: string, member_email: string, member_id: string, school_id: number }) => {
    return api.post('/organization-members', data)
  },
}

// Example usage functions for your dashboard
export const dashboardApi = {
  getDashboardData: async () => {
    return api.get('/dashboard')
  },

  /** Single payload for dashboard home: stats + chart datasets (same path MSW mocks when flag on). */
  getOverview: async () => {
    return api.get<DashboardOverviewResponse>('/admin/dashboard')
  },

  getStats: async () => {
    return api.get<DashboardStatsResponse>('/admin/dashboard/stats')
  },

  getMetrics: async (range: string) => {
    return api.get<DashboardMetricsResponse>(`/admin/dashboard/metrics?range=${range}`)
  },

  getCategories: async () => {
    return api.get('/categories')
  },

  getClaims: async () => {
    return api.get<ClaimsResponse>('/claims')
  },

  getClaim: async (id: number) => {
    return api.get<ClaimResponse>(`/claims/${id}`)
  },

  createClaim: async (claimData: Record<string, unknown>) => {
    return api.post<FileClaimResponse>('/claims', claimData)
  },

  attachFilesToClaim: async (id: number, attachments: FormData) => {
    return api.post<FileClaimResponse>(`/claims/${id}/attachments`, attachments, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  finalizeClaim: async (id: number, claimData: FileClaimPayload) => {
    return api.post<FileClaimResponse>(`/claims/${id}/finalize`, claimData)
  },

  updateClaim: async (id: string, claimData: Record<string, unknown>) => {
    return api.put(`/claims/${id}`, claimData)
  },

  deleteClaim: async (id: string) => {
    return api.delete(`/claims/${id}`)
  },
}

export const bookingsApi = {
  getOverview: async (params?: {
    page?: number
    limit?: number
    search?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<BookingsListNormalized> => {
    const raw = await api.get<AdminBookingsListResponse>('/admin/bookings', {
      params: {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      },
    })
    const m = raw.metadata
    return {
      data: raw.data.map(normalizeAdminBookingListItem),
      meta: {
        page: m.page,
        perPage: m.limit,
        total: m.total,
        totalPages: m.totalPages,
        hasNextPage: m.page < m.totalPages,
        hasPreviousPage: m.page > 1,
      },
    }
  },
  getById: async (id: string): Promise<BookingDetailResponse> => {
    const raw = await api.get<unknown>(`/admin/bookings/${id}`)
    const data = normalizeBookingDetailFromApi(raw)
    return { success: data != null, data }
  },
}

/** List reports — `GET /api/admin/reports` (proxied). Use when the backend payload is ready; the UI currently uses mock data. */
export const reportsApi = {
  getList: async (params: {
    status: ReportStatus
    search?: string
    page?: number
    pageSize?: number
  }) => {
    return api.get<unknown>('/admin/reports', {
      params: {
        status: params.status,
        search: params.search,
        page: params.page,
        pageSize: params.pageSize,
      },
    })
  },
}

export const stylistsApi = {
  getList: async (params?: { page?: number; per_page?: number; search?: string }) => {
    return api.get<StylistsListResponse>('/admin/stylists', { params })
  },
  getById: async (id: string) => {
    return api.get<StylistDetailResponse>(`/admin/stylists/${id}`)
  },
}

export const claimsApi = {
  getClaims: async (search?: string, page?: number, perPage?: number) => {
    const params = {
      search: search || '',
      page: page || 1,
      per_page: perPage || 10,
    };
    return api.get<ClaimsResponse>('/admin/claims', { params })
  },

  getClaimAdmin: async (id: number) => {
    return api.get<ClaimAdminResponse>(`/admin/claims/${id}`)
  },

  updateClaimStatus: async (id: number, data: FormData) => {
    return api.put(`/admin/claims/${id}/status`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  updateCategory: async (id: number, categoryData: CategoryItem | FormData) => {
    return api.post(`/admin/categories/${id}`, categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteCategory: async (id: number) => {
    return api.delete(`/admin/categories/${id}`)
  },
}

export const categoriesApi = {
  getCategories: async (search?: string) => {
    const params = search ? { search } : {};
    return api.get<CategoryResponse>('/admin/categories?status=active', { params })
  },

  getActivePublicCategories: async () => {
    return api.get<CategoryActiveResponse>('/categories/active')
  },

  createCategory: async (categoryData: CategoryItem | FormData) => {
    return api.post('/admin/categories', categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  updateCategory: async (id: number, categoryData: CategoryItem | FormData) => {
    return api.post(`/admin/categories/${id}`, categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteCategory: async (id: number) => {
    return api.delete(`/admin/categories/${id}`)
  },
}

export const stylistApplicationsApi = {
  getPending: async () => {
    return api.get<PendingStylistApplicationsResponse>('/admin/stylist/pending')
  },
}

export const feesApi = {
  getAll: async () => {
    return api.get<AdminFeeDto[]>('/admin/fees')
  },
  putAll: async (body: AdminFeePutItem[]) => {
    return api.put<unknown>('/admin/fees', body)
  },
}

export const productsApi = {
  getProducts: async (search?: string) => {
    const params = search ? { search } : {};
    return api.get<ProductResponse>('/admin/products', { params })
  },
  deleteProduct: async (id: number) => {
    return api.delete(`/admin/products/${id}`)
  },
  updateProduct: async (id: number, productData: Record<string, unknown>) => {
    return api.put(`/admin/products/${id}`, productData)
  },
  postProduct: async (productData: Record<string, unknown>) => {
    return api.post(`/admin/products`, productData)
  },
}


export interface CheckDistrictDuplicatesRequest {
  district_id: number;
  products: number[];
}

export const warrantyPricingApi = {
  getWarrantyPricing: async (activeCategoryId: number | undefined) => {
    return api.get<WarrantyPricingResponse>('/admin/warranty-pricing', {
      params: { category_id: activeCategoryId }
    })
  },
  getCoverageDurations: async () => {
    return api.get<CoverageDurationsResponse>('/admin/coverage-durations')
  },
  deleteWarrantyPricing: async (id: number) => {
    return api.delete(`/admin/warranty-pricing/${id}`)
  },
  updateWarrantyPricing: async (id: number, params: WarrantyPricingItem) => {
    return api.put(`/admin/warranty-pricing/${id}`, params)
  },
  postWarrantyPricing: async (warrantyPricingData: WarrantyPriceFormData) => {
    return api.post(`/admin/warranty-pricing`, warrantyPricingData)
  },
}

export const coverageProductsApi = {
  getCoverageProduct: async (id: number) => {
    return api.get<CoverageProductDetailResponse>(`/coverage-products/${id}`)
  },
  getCoverageProducts: async (page = 1, per_page = 100) => {
    return api.get<CoverageProductsResponse>(`/coverage-products?page=${page}&per_page=${per_page}`)
  },
  getCoverageProductStart: async (categoryId: number | undefined) => {
    return api.post<CoverageProductStartResponse>('/coverage-products/start', { category_id: categoryId })
  },
  submitProductDetails: async (id: number, data: CoverageProductDetails) => {
    return api.put(`/coverage-products/${id}/submit-details`, data)
  },
  submitReceipt: async (id: number, data: FormData) => {
    return api.post(`/coverage-products/${id}/step5`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getCoveragePlans: async (categoryId: number, productPrice: string) => {
    return api.get<CoveragePlansResponse>(`/coverage-plans?category_id=${categoryId}&product_price=${productPrice}`)
  },
  getExtensionOptions: async (id: number) => {
    return api.get<ExtensionOptionsResponse>(`/coverage-products/${id}/extension-options`)
  },
  createExtensionPaymentIntent: async (id: number, data: CreateExtensionPaymentIntentRequest) => {
    return api.post<CreateExtensionPaymentIntentResponse>(`/coverage-products/${id}/extension/payment-intent`, data)
  },
  confirmExtensionPayment: async (id: number, data: ConfirmExtensionPaymentRequest) => {
    return api.post<ConfirmExtensionPaymentResponse>(`/coverage-products/${id}/extension/confirm`, data)
  },
}


export default api
