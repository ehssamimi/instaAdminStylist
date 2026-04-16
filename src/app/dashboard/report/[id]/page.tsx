'use client'

import dynamic from 'next/dynamic'

const ReportDetailContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function ReportDetailPage() {
  return <ReportDetailContent />
}
export const runtime = 'edge'
