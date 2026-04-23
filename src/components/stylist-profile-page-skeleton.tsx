import { EachContainer } from "@/components/each-container"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading placeholder for {@link StylistProfileView} — profile header, booking
 * block, and the three “Styling” panels.
 */
export function StylistProfilePageSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading stylist profile…</span>

      <section className="admin-panel-surface" aria-hidden>
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="flex w-full shrink-0 flex-col gap-10 sm:flex-row sm:items-center lg:w-auto">
            <Skeleton className="size-24 shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:gap-10">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-40 max-w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-4 w-48 max-w-full rounded-md" />
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-3xl min-w-0 gap-3 lg:flex-1">
            <Skeleton className="min-h-[112px] min-w-[140px] flex-1 rounded-xl" />
            <Skeleton className="min-h-[112px] min-w-[140px] flex-1 rounded-xl" />
          </div>
        </div>
      </section>

      <section className="admin-panel-surface" aria-hidden>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-[var(--height-form-field)] min-w-[220px] flex-1 max-w-md rounded-md" />
          <Skeleton className="h-[var(--height-form-field)] w-24 shrink-0 rounded-md" />
        </div>
        <div className="mt-4 space-y-2 border border-gray-100 rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-2 border-b border-gray-100 bg-gray-50/80 p-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-3 w-full rounded" />
            ))}
          </div>
          {Array.from({ length: 4 }, (__, row) => (
            <div
              key={row}
              className="grid grid-cols-6 gap-2 border-b border-gray-100 p-3 last:border-b-0"
            >
              {Array.from({ length: 6 }, (_, j) => (
                <Skeleton key={j} className="h-4 w-full rounded" />
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <EachContainer title="Styling Info">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-[var(--radius-form-field)]" />
              </div>
            ))}
          </div>
        </EachContainer>

        <EachContainer title="Styling Speciality">
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-[54px] w-full rounded-lg"
                aria-hidden
              />
            ))}
          </div>
        </EachContainer>

        <EachContainer title="Recommended Shops">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-12 w-full rounded-lg"
                aria-hidden
              />
            ))}
          </div>
        </EachContainer>
      </div>
    </div>
  )
}
