'use client'

import dynamic from 'next/dynamic'

const BookingsContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => null,
})

export default function BookingsPage() {
  return <BookingsContent />
}
