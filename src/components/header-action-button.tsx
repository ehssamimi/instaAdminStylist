import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headerActionShadow =
  "shadow-[0_1px_2px_0_rgba(10,13,18,0.05)]" as const

/**
 * Page-header action buttons (detail views): shared padding, radius, typography, and shadow.
 *
 * - `error` — solid Error-600 (e.g. Refund Service Fee)
 * - `primary` — Primary-Depth fill (e.g. Ignore Report)
 * - `neutral` — Greyscale-500 outline (e.g. Cancel Call)
 * - `errorSoft` — Error-300 border, Error-600 text, light surface (e.g. Remove user)
 */
export const headerActionButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[8px] px-5 py-3",
    "font-satoshi text-base font-bold leading-[130%]",
    "outline-none transition-[color,background-color,border-color,box-shadow]",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    headerActionShadow,
  ],
  {
    variants: {
      variant: {
        error: [
          "border border-error-600 bg-error-600 text-white",
          "hover:bg-error-600/92 hover:border-error-600/92",
        ],
        primary: [
          "border border-black-100 bg-black-100 text-white",
          "hover:bg-black-100/92 hover:border-black-100/92",
        ],
        neutral: [
          "border border-gray-500 bg-transparent text-black-100",
          "hover:bg-gray-50",
        ],
        errorSoft: [
          "border border-error-300 bg-transparent text-error-600",
          "hover:bg-error-100/80",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export type HeaderActionButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof headerActionButtonVariants> & {
    asChild?: boolean
  }

export function HeaderActionButton({
  className,
  variant,
  asChild = false,
  ...props
}: HeaderActionButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="header-action-button"
      className={cn(headerActionButtonVariants({ variant }), className)}
      {...props}
    />
  )
}
