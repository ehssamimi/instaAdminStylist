import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20  aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-error-500 text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20  ",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        /** Success-500 bg, Success-25 text; pill padding per design spec */
        success:
          "rounded-full border-transparent bg-success-500 px-4 py-1 font-satoshi text-success-25 [a&]:hover:bg-success-500/90",
        /** Warning-500 bg (#F79009), Success-25 text (#F6FEF9) */
        scheduled:
          "rounded-full border-transparent bg-warning-500 px-4 py-1 font-satoshi text-success-25 [a&]:hover:bg-warning-500/90",
        /** Destructive bg; covers canceled / canceled_by_stylist / canceled_by_admin */
        canceled:
          "rounded-full border-transparent bg-destructive px-4 py-1 font-satoshi text-white [a&]:hover:bg-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
