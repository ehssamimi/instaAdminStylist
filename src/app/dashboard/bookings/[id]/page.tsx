'use client'

import dynamic from 'next/dynamic'

const BookingDetailsContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function BookingDetailsPage() {
  return <BookingDetailsContent />
}
export const runtime = 'edge'
