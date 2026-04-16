'use client'

import { useEffect, useState } from 'react'
import type { CustomerDetailDto } from '@/models/customer'

export function useCustomerDetail(id: string): {
  data: CustomerDetailDto | null
  loading: boolean
  error: Error | null
} {
  const [data, setData] = useState<CustomerDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id?.trim()) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    void (async () => {
      try {
        const { getMockCustomerDetail } = await import('@/lib/mock-customers')
        if (cancelled) return
        setData(getMockCustomerDetail(id))
        setError(null)
      } catch (err: unknown) {
        if (cancelled) return
        setData(null)
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to load customer details')
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  return { data, loading, error }
}
