'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { ReportDetailsPageView } from '@/components/report-details-page-view'
import type { AdminReportDetail } from '@/models/reports'

export default function ReportDetailContent() {
  const params = useParams()
  const id =
    typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const [report, setReport] = useState<AdminReportDetail | null>(null)

  useEffect(() => {
    if (!id) {
      setReport(null)
      return
    }

    let cancelled = false

    void (async () => {
      const { getMockReportDetailById } = await import('@/lib/mock-reports')
      if (!cancelled) {
        setReport(getMockReportDetailById(id))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <ReportDetailsPageView
      report={report}
      backHref="/dashboard/report"
      backAriaLabel="Back to reports"
    />
  )
}
