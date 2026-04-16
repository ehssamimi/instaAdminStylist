'use client'

import dynamic from 'next/dynamic'

const ApplicationDetailContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function StylistProfilePage() {
  return <ApplicationDetailContent />
}
export const runtime = 'edge'
