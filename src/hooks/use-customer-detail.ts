"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  adminUsersApi,
  type CustomerBookingsQueryParams,
} from "@/lib/api"
import type { CustomerDetailDto } from "@/models/customer"
import type { CustomerBookingsPageMeta } from "@/models/customerBookings"

export function customerDetailQueryKey(
  customerId: string,
  bookingsParams: CustomerBookingsQueryParams
) {
  return [
    "customer-detail",
    customerId,
    bookingsParams.page,
    bookingsParams.pageSize,
  ] as const
}

export function useCustomerDetail(
  customerId: string,
  bookingsParams: CustomerBookingsQueryParams
): {
  customer: CustomerDetailDto | null
  bookingsMeta: CustomerBookingsPageMeta | null
  loading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => void
} {
  const enabled = Boolean(customerId?.trim())

  const query = useQuery({
    queryKey: customerDetailQueryKey(customerId, bookingsParams),
    queryFn: () =>
      adminUsersApi.getCustomerBookings(customerId.trim(), bookingsParams),
    enabled,
    staleTime: 30_000,
    gcTime: 300_000,
    placeholderData: keepPreviousData,
  })

  const payload = query.data

  return {
    customer: payload?.customer ?? null,
    bookingsMeta: payload?.meta ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error : null,
    refetch: () => {
      void query.refetch()
    },
  }
}
