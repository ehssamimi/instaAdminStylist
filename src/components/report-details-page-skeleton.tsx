import { EachContainer, EachContainerDivider } from "@/components/each-container"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading placeholder for {@link ReportDetailsPageView} — matches avatar grid,
 * “reported by” row, and “Reporting reason” block.
 */
export function ReportDetailsPageSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading report details…</span>

      <EachContainer>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <Skeleton
            className="size-[97px] shrink-0 rounded-lg"
            aria-hidden
          />
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="min-w-0 space-y-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-full max-w-[10rem] rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <EachContainerDivider className="my-5" />

        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="size-9 shrink-0 rounded-full" aria-hidden />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>
      </EachContainer>

      <EachContainer title="Reporting reason">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-3xl rounded-md" />
          <Skeleton className="h-4 w-full max-w-2xl rounded-md" />
          <Skeleton className="h-4 w-[85%] max-w-xl rounded-md" />
        </div>
      </EachContainer>
    </div>
  )
}
