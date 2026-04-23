'use client'

import { useParams } from 'next/navigation'

import { ReportDetailsPageView } from '@/components/report-details-page-view'
import { useReportDetail } from '@/hooks/use-report-detail'

export default function ReportDetailContent() {
  const params = useParams()
  const id =
    typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const { data, loading, error, refetch } = useReportDetail(id)

  return (
    <ReportDetailsPageView
      report={data}
      loading={loading}
      errorMessage={error?.message ?? null}
      onRefetchReport={refetch}
      backHref="/dashboard/report"
      backAriaLabel="Back to reports"
    />
  )
}
