import type { ReactNode } from 'react'

import { EachContainerDivider } from '@/components/each-container'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const FORM_FIELD_SKELETON_CLASS =
  'h-[var(--height-form-field)] w-full rounded-[var(--radius-form-field)]'

function SkeletonFormField() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-24 rounded-md" />
      <Skeleton className={FORM_FIELD_SKELETON_CLASS} />
    </div>
  )
}

function SkeletonPanel({
  titleWidth,
  children,
}: {
  titleWidth: string
  children: ReactNode
}) {
  return (
    <section className="admin-panel-surface min-w-0">
      <Skeleton className={cn('h-5 rounded-md', titleWidth)} />
      <EachContainerDivider className="my-5" />
      {children}
    </section>
  )
}

function StylistProfileHeaderSkeleton() {
  return (
    <section className="mb-6 admin-panel-surface" aria-hidden>
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="flex w-full shrink-0 flex-col gap-10 sm:flex-row sm:items-center lg:w-auto">
          <Skeleton className="size-24 shrink-0 rounded-xl" />
          <div className="flex min-w-0 gap-10">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-5 w-40 max-w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-5 w-48 max-w-full rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-3xl min-w-0 gap-3 lg:flex-1">
          <Skeleton className="min-h-[112px] min-w-[140px] flex-1 rounded-xl" />
          <Skeleton className="min-h-[112px] min-w-[140px] flex-1 rounded-xl" />
        </div>
      </div>
    </section>
  )
}

function StylistBookingActivitySkeleton() {
  return (
    <section className="mb-6 admin-panel-surface" aria-hidden>
      <div className="flex w-full flex-wrap items-center gap-4">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-[var(--height-form-field)] min-w-[220px] flex-1 rounded-[var(--radius-form-field)]" />
        <Skeleton className="h-[var(--height-form-field)] w-[120px] shrink-0 rounded-lg" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex gap-2 border-b border-gray-100 pb-2">
          {['w-12', 'w-14', 'w-16', 'w-20', 'w-16', 'w-14'].map((w, i) => (
            <Skeleton key={i} className={cn('h-3 rounded-md', w)} />
          ))}
        </div>
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} className="flex gap-2 py-2">
            {Array.from({ length: 6 }, (_, col) => (
              <Skeleton
                key={col}
                className={cn(
                  'h-4 min-w-0 flex-1 rounded-md',
                  col === 3 && 'max-w-[8rem]'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function StylingSpecialitySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-[54px] w-full rounded-lg" />
      ))}
    </div>
  )
}

function RecommendedShopsSkeleton() {
  return (
    <ul
      className="mb-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-7"
      aria-hidden
    >
      {Array.from({ length: 7 }, (_, i) => (
        <li key={i} className="min-w-0">
          <Skeleton className="h-[125px] w-full rounded-[8px]" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Loading placeholder for {@link StylistProfilePageView}: mirrors header, booking table, and form panels.
 */
export function StylistProfilePageSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading profile…</span>

      <StylistProfileHeaderSkeleton />
      <StylistBookingActivitySkeleton />

      <SkeletonPanel titleWidth="w-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonFormField key={i} />
          ))}
        </div>
      </SkeletonPanel>

      <SkeletonPanel titleWidth="w-40">
        <div className="space-y-8">
          <StylingSpecialitySkeleton />
          <SkeletonFormField />
        </div>
      </SkeletonPanel>

      <SkeletonPanel titleWidth="w-44">
        <div className="space-y-8">
          <RecommendedShopsSkeleton />
          <SkeletonFormField />
        </div>
      </SkeletonPanel>
    </div>
  )
}
