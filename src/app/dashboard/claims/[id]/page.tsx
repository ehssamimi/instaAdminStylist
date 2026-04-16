'use client'

import dynamic from 'next/dynamic'

const ClaimDetailsContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function ClaimDetailsPage() {
  return <ClaimDetailsContent />
}
export const runtime = 'edge'
