"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"

import { ReportDetailsPageView } from "@/components/report-details-page-view"
import { getMockReportDetailById } from "@/lib/mock-reports"

export default function ReportDetailPage() {
  const params = useParams()
  const id =
    typeof params.id === "string" ? params.id : params.id?.[0] ?? ""

  const report = useMemo(() => getMockReportDetailById(id), [id])

  return (
    <ReportDetailsPageView
      report={report}
      backHref="/dashboard/report"
      backAriaLabel="Back to reports"
    />
  )
}
export const runtime = 'edge';