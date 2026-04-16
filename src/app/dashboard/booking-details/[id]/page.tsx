'use client'

import dynamic from 'next/dynamic'

const BookingDetailsStandaloneContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function BookingDetailsStandalonePage() {
  return <BookingDetailsStandaloneContent />
}
export const runtime = 'edge'
