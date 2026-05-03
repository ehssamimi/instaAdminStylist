'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { bookingsApi } from '@/lib/api'
import type { BookingRowDto, BookingsListNormalized } from '@/models/bookings'

export type StylistBookingsQueryParams = {
  page: number
  pageSize: number
}

export function stylistBookingsQueryKey(
  stylistId: string,
  params: StylistBookingsQueryParams
) {
  return [
    'stylist-bookings',
    stylistId,
    params.page,
    params.pageSize,
  ] as const
}

export function useStylistBookings(
  stylistId: string,
  params: StylistBookingsQueryParams
): {
  rows: BookingRowDto[]
  meta: BookingsListNormalized['meta'] | null
  loading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => void
} {
  const enabled = Boolean(stylistId?.trim())

  const query = useQuery({
    queryKey: stylistBookingsQueryKey(stylistId, params),
    queryFn: () =>
      bookingsApi.getOverview({
        page: params.page,
        limit: params.pageSize,
        stylistId: stylistId.trim(),
      }),
    enabled,
    staleTime: 30_000,
    gcTime: 300_000,
    placeholderData: keepPreviousData,
  })

  return {
    rows: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error : null,
    refetch: () => {
      void query.refetch()
    },
  }
}
