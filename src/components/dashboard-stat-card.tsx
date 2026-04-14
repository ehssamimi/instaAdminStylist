import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type DashboardStatCardProps = {
  label: ReactNode
  value: ReactNode
  icon?: ReactNode
  className?: string
  valueClassName?: string
}

export function DashboardStatCard({
  label,
  value,
  icon,
  className,
  valueClassName,
}: DashboardStatCardProps) {
  return (
    <div
      className={cn(
        "flex h-28 min-w-0 grow shrink-0 basis-0 flex-col items-start justify-between p-4",
        "rounded-[12px] border border-greyscale-100 bg-surface",
        "shadow-[0_4px_16px_0_rgba(0,0,0,0.02)]",
        className
      )}
    >
      <div className="flex w-full items-center justify-between gap-2 text-gray-900">
        {typeof label === "string" ? (
          <span className="text-sm font-medium">{label}</span>
        ) : (
          label
        )}
        {icon}
      </div>
      <div
        className={cn(
          "text-[32px] font-bold tabular-nums ",
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  )
}
