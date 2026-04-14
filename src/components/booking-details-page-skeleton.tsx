import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function SkeletonDetailInfoCard({ withAvatar }: { withAvatar?: boolean }) {
  return (
    <div
      className="min-h-16 rounded-xl border border-border-soft bg-white p-3 shadow-sm"
      aria-hidden
    >
      <div className="flex gap-3">
        {withAvatar ? (
          <Skeleton className="size-[38px] shrink-0 rounded-[8px]" />
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <div className="flex items-center gap-2">
            {!withAvatar ? (
              <Skeleton className="size-4 shrink-0 rounded" />
            ) : null}
            <Skeleton className="h-4 max-w-[85%] flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonDetailSectionCard({
  titleWidth,
  children,
  titleRight,
}: {
  titleWidth: string
  children?: ReactNode
  titleRight?: ReactNode
}) {
  return (
    <section
      className="rounded-xl border border-border-soft bg-white px-4 py-5 shadow-sm"
      aria-hidden
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-3',
          children ? 'mb-4' : ''
        )}
      >
        <Skeleton className={cn('h-5 rounded-md', titleWidth)} />
        {titleRight}
      </div>
      {children}
    </section>
  )
}

/**
 * Loading placeholder for {@link BookingDetailsPageView}.
 */
export function BookingDetailsPageSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading booking details…</span>

      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonDetailInfoCard withAvatar />
        <SkeletonDetailInfoCard />
        <SkeletonDetailInfoCard withAvatar />
        <SkeletonDetailInfoCard />
        <SkeletonDetailInfoCard />
        <SkeletonDetailInfoCard />
        <SkeletonDetailInfoCard />
        <SkeletonDetailInfoCard />
      </div>

      <SkeletonDetailSectionCard titleWidth="w-36">
        <ul className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0"
            >
              <Skeleton className="mb-2 h-4 w-full max-w-lg rounded-md" />
              <Skeleton className="h-3 w-full max-w-2xl rounded-md" />
              <Skeleton className="mt-2 h-3 w-[80%] max-w-xl rounded-md" />
            </li>
          ))}
        </ul>
      </SkeletonDetailSectionCard>

      <SkeletonDetailSectionCard titleWidth="w-44">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-[92%] rounded-md" />
          <Skeleton className="h-3 w-[70%] rounded-md" />
        </div>
      </SkeletonDetailSectionCard>

      <SkeletonDetailSectionCard
        titleWidth="w-20"
        titleRight={
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="size-6 rounded-sm" />
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonDetailSectionCard titleWidth="w-28">
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-[88%] rounded-md" />
          </div>
        </SkeletonDetailSectionCard>
        <SkeletonDetailSectionCard titleWidth="w-48">
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-[80%] rounded-md" />
          </div>
        </SkeletonDetailSectionCard>
      </div>
    </div>
  )
}
