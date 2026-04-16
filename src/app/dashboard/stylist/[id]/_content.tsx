'use client'

import { useParams } from 'next/navigation'
import { StylistProfilePageView } from '@/components/stylist-profile-page-view'
import { useStylistDetail } from '@/hooks/use-stylist-detail'

export default function StylistDetailsContent() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const { data, loading, error } = useStylistDetail(id)

  return (
    <StylistProfilePageView
      stylist={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      backHref="/dashboard/stylists"
      backAriaLabel="Back to stylists"
    />
  )
}
