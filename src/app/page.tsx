'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getRefreshToken, getToken } from '@/lib/jwt-utils'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()?.trim()
    const refreshToken = getRefreshToken()?.trim()

    if (token && refreshToken) {
      router.replace('/dashboard')
    } else {
      router.replace('/admin-login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main">
      <p className="font-satoshi text-sm text-muted-foreground">Loading…</p>
    </div>
  )
}
