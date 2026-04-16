'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

const DashboardShell = dynamic(() => import('./_shell'), {
  ssr: false,
  loading: () => null,
})

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
