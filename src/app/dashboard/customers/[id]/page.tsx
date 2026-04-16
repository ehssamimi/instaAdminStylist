'use client'

import dynamic from 'next/dynamic'

const CustomerDetailsContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function CustomerDetailsPage() {
  return <CustomerDetailsContent />
}
export const runtime = 'edge'
