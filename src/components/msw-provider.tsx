'use client'

import { useEffect, useState, type PropsWithChildren } from 'react'

/**
 * Starts the MSW Service Worker when `NEXT_PUBLIC_API_MOCK=true`.
 * Delays rendering children until the worker is ready so dashboard requests are intercepted.
 */
export function MswProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(
    () => process.env.NEXT_PUBLIC_API_MOCK !== 'true'
  )

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCK !== 'true') {
      return
    }

    let cancelled = false

    void (async () => {
      const { worker } = await import('@/mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      })
      if (!cancelled) {
        setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Loading mocks…
      </div>
    )
  }

  return <>{children}</>
}
