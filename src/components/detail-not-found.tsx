'use client'

import Link from 'next/link'
import { AlertTriangle, ChevronLeft, SearchX } from 'lucide-react'

type DetailNotFoundProps = {
  title: string
  description?: string
  /** API error message shown as a banner below the icon */
  errorMessage?: string | null
  backHref?: string
  backLabel?: string
  onRetry?: () => void
}

export function DetailNotFound({
  title,
  description,
  errorMessage,
  backHref,
  backLabel = 'Go back',
  onRetry,
}: DetailNotFoundProps) {
  return (
    <div className="admin-panel-surface flex flex-col items-center py-12 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
        <SearchX className="size-8 text-gray-400" aria-hidden />
      </div>

      <p className="font-satoshi text-base font-bold text-gray-900">{title}</p>

      {description && (
        <p className="mt-1.5 max-w-xs font-satoshi text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {errorMessage && (
        <div
          className="mt-5 flex w-full max-w-md items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left"
          role="alert"
        >
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0 text-red-500"
            aria-hidden
          />
          <p className="font-satoshi text-sm leading-relaxed text-red-700">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="font-satoshi text-sm font-semibold text-brand-600 hover:underline"
          >
            Try again
          </button>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 font-satoshi text-sm font-semibold text-gray-500 hover:underline"
          >
            <ChevronLeft className="size-4" aria-hidden />
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
