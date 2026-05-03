'use client'

import { useParams } from 'next/navigation'
import { StylistProfileScreen } from '@/components/stylist-profile-screen'
import { useStylistDetail } from '@/hooks/use-stylist-detail'

export default function ApplicationDetailContent() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const { data, loading, error } = useStylistDetail(id)

  return (
    <StylistProfileScreen
      stylistId={id}
      stylist={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      backHref="/dashboard/applications"
      backAriaLabel="Back to applications"
    />
  )
}
