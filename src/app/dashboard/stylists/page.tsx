'use client'

import dynamic from 'next/dynamic'

const StylistsContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function StylistsPage() {
  return <StylistsContent />
}
