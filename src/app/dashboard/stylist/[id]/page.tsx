'use client'

import dynamic from 'next/dynamic'

const StylistDetailsContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function StylistDetailsPage() {
  return <StylistDetailsContent />
}
export const runtime = 'edge'
