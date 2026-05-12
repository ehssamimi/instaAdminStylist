import * as React from "react"

import { cn } from "@/lib/utils"

export function ReportsNavIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path
        d="M17.3 16.8992H6.5V10.5992C6.5 7.61707 8.91785 5.19922 11.9 5.19922C14.8822 5.19922 17.3 7.61707 17.3 10.5992V16.8992Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M4.70039 20.0492H19.1004M2.90039 6.99922L4.25039 7.44922M6.95039 2.94922L7.40039 4.29922M5.60039 5.64922L4.25039 4.29922"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
