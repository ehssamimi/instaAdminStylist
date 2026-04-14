"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const RATING_LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"] as const

/** 1–5: number of filled (amber) stars from the left. */
export function BookingRatingStars({
  value,
  className,
}: {
  value: number | null
  className?: string
}) {
  if (value == null) {
    return (
      <p className={cn("font-satoshi text-sm text-muted-foreground", className)}>
        No rating yet.
      </p>
    )
  }

  const filled = Math.min(5, Math.max(0, Math.round(value)))

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 sm:gap-6",
        className
      )}
    >
      {RATING_LABELS.map((label, i) => {
        const isFilled = i < filled
        return (
          <div
            key={label}
            className="flex min-w-0 items-center gap-6"
          >
            <Star
              className={cn(
                "size-12 shrink-0",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-gray-300"
              )}
              strokeWidth={isFilled ? 0 : 1.5}
              aria-hidden
            />
            <span className="font-satoshi text-xs text-gray-600">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
