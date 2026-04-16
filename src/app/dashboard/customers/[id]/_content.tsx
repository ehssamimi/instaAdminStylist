'use client'

import { useParams } from 'next/navigation'
import { CustomerProfilePageView } from '@/components/customer-profile-page-view'
import { useCustomerDetail } from '@/hooks/use-customer-detail'

export default function CustomerDetailsContent() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const { data, loading, error } = useCustomerDetail(id)

  return (
    <CustomerProfilePageView
      customer={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      backHref="/dashboard/customers"
      backAriaLabel="Back to customers"
    />
  )
}
