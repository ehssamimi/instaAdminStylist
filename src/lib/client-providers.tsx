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

const MswProvider = dynamic(
  () =>
    import('@/components/msw-provider').then((m) => ({
      default: m.MswProvider,
    })),
  { ssr: false, loading: () => null }
)

export default function ClientProviders({ children }: PropsWithChildren) {
  return (
    <MswProvider>
      <Providers>
        {children}
        <Toaster />
      </Providers>
    </MswProvider>
  )
}
