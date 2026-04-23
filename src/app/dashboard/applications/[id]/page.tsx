'use client'

import dynamic from 'next/dynamic'

import { StylistProfilePageSkeleton } from '@/components/stylist-profile-page-skeleton'

const ApplicationDetailContent = dynamic(() => import('./_content'), {
  ssr: false,
  loading: () => (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <StylistProfilePageSkeleton />
    </div>
  ),
})

export default function StylistProfilePage() {
  return <ApplicationDetailContent />
}
export const runtime = 'edge'
