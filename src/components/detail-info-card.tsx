import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Circular photo or initials fallback for person names. */
export function NameAvatar({
  name,
  imageSrc,
  className,
}: {
  name: string
  imageSrc?: string | null
  /** Merged onto the frame; use for size, radius (e.g. `rounded-full`), etc. */
  className?: string
}) {
  const trimmed = imageSrc?.trim()
  if (trimmed) {
    return (
      <div
        className={cn(
          "relative size-[38px] shrink-0 overflow-hidden rounded-[8px] bg-gray-200 ring-1 ring-gray-200",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={trimmed} alt="" className="size-full object-cover" />
      </div>
    )
  }

  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials =
    parts.length >= 2
      ? `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase()
      : (parts[0]?.slice(0, 2).toUpperCase() ?? "?")

  return (
    <div
      className={cn(
        "flex size-[37px] shrink-0 items-center justify-center rounded-[8px] bg-gray-200 font-satoshi text-xs font-semibold text-gray-700",
        className
      )}
    >
      {initials}
    </div>
  )
}

/** Small white stat card: optional `leading` (e.g. avatar column) or `valueIcon` (icon beside the value). */
export function DetailInfoCard({
  label,
  value,
  leading,
  valueIcon,
  className,
}: {
  label: string
  value: ReactNode
  leading?: ReactNode
  /** Renders inline before `value`, on the row below the label (e.g. mail, clock). */
  valueIcon?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-h-16 rounded-[12px] border-2 border-gray-100 bg-white p-3 shadow-panel",
        className
      )}
    >
      <div className="flex gap-3">
        {leading ? (
          <div className="flex shrink-0 items-start pt-0.5">{leading}</div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-satoshi text-xs font-bold text-black">{label}</p>
          <div className=" mt-1 flex min-w-0 items-start gap-1 font-satoshi text-sm font-normal text-gray-700">
            {valueIcon ? (
              <span className="mt-0.5 flex shrink-0 items-center text-gray-400 [&_svg]:size-4">
                {valueIcon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
              {value}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Full-width content block with title (e.g. Booking Details, Rating). */
export function DetailSectionCard({
  title,
  titleRight,
  children,
  className,
}: {
  title: string
  titleRight?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const hasBody = children != null && children !== false

  return (
    <section
      className={cn(
        "rounded-[12px] border border-gray-100 bg-white px-4 py-5 shadow-panel",
        className
      )}
    >
      <div
        className={cn(
          "flex gap-[60px]",
          titleRight
            ? "mb-0 flex-row flex-wrap items-center justify-between"
            : cn("mb-2 flex-col sm:flex-row sm:items-center sm:justify-between"),
          hasBody && titleRight && "mb-2"
        )}
      >
        <h3 className="shrink-0 font-satoshi text-base font-bold text-gray-900">
          {title}
        </h3>
        {titleRight ? (
          <div className="min-w-0 flex-1 sm:flex  ">{titleRight}</div>
        ) : null}
      </div>
      {hasBody ? children : null}
    </section>
  )
}
