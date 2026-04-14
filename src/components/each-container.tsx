import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type EachContainerProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode
  /** Same heading pattern as `DetailSectionCard`. */
  title?: ReactNode
  titleRight?: ReactNode
}

/**
 * White rounded panel: gray-100 border and soft shadow (`box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.02)`).
 */
export function EachContainer({
  children,
  className,
  title,
  titleRight,
  ...props
}: EachContainerProps) {
  const hasBody = children != null && children !== false
  const showTitle = title != null && title !== ""

  return (
    <section
      className={cn("admin-panel-surface min-w-0", className)}
      {...props}
    >
      {showTitle ? (
        <div
          className={cn(
            "flex gap-[60px]",
            titleRight
              ? "mb-0 flex-row flex-wrap items-center justify-between"
              : "mb-2 flex-col sm:flex-row sm:items-center sm:justify-between",
            hasBody && titleRight && "mb-2"
          )}
        >
          <h3 className="shrink-0 font-satoshi text-base font-bold text-gray-900">
            {title}
          </h3>
          {titleRight ? (
            <div className="min-w-0 flex-1 sm:flex">{titleRight}</div>
          ) : null}
                   

        </div>
      ) : null}
      {showTitle ? <EachContainerDivider className="my-5" /> : null}
      {children}
    </section>
  )
}

type EachContainerDividerProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Horizontal padding (in Tailwind spacing units) that this divider cancels out.
   * Must match `EachContainer`’s horizontal padding: default `p-4` → `4`.
   */
  bleed?: 4 | 6 | 8
  /** When true (default), the line is purely decorative (`aria-hidden`). */
  decorative?: boolean
}

const bleedWidthClass: Record<NonNullable<EachContainerDividerProps["bleed"]>, string> =
  {
    4: "w-[calc(100%+2rem)]",
    6: "w-[calc(100%+3rem)]",
    8: "w-[calc(100%+4rem)]",
  }

/**
 * Horizontal rule that spans the full inner width of `EachContainer` (edge to edge
 * inside the border), ignoring the container’s horizontal padding.
 *
 * Uses centered `translate` + explicit width so the line extends evenly on both sides
 * (avoids one-sided gaps from `%` + negative margin in nested flex layouts).
 */
export function EachContainerDivider({
  className,
  bleed = 4,
  decorative = true,
  ...props
}: EachContainerDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden={decorative ? true : undefined}
      className={cn(
        "relative left-1/2 h-px shrink-0 -translate-x-1/2 bg-gray-100",
        bleedWidthClass[bleed],
        className
      )}
      {...props}
    />
  )
}
