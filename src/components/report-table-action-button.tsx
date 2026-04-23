import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const baseClass =
  "inline-flex items-center justify-center gap-[10px] rounded-[60px] px-[10px] py-1 font-satoshi text-[11px] font-normal leading-[130%] transition-[background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/35 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"

const variantClass = {
  /** Greyscale-700 on Brand-25 — Ignore, Reopen, Restore */
  neutral: "bg-brand-25 text-gray-700 hover:bg-brand-50 active:bg-brand-100",
  /** Error-600 on #FFFBFA (Error-25) — Remove user */
  danger:
    "bg-[#FFFBFA] text-error-600 hover:bg-error-50 active:bg-error-100",
} as const

export type ReportTableActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClass
}

export function ReportTableActionButton({
  className,
  variant = "neutral",
  type = "button",
  ...props
}: ReportTableActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClass, variantClass[variant], className)}
      {...props}
    />
  )
}
