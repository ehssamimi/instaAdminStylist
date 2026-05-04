'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

const Providers = dynamic(() => import('@/lib/provider'), {
  ssr: false,
  loading: () => null,
})

const Toaster = dynamic(
  () => import('@/components/ui/sonner').then((m) => ({ default: m.Toaster })),
  { ssr: false, loading: () => null }
)

export default function ClientProviders({ children }: PropsWithChildren) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  )
}
