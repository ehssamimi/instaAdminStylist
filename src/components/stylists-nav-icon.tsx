import * as React from "react"

import { cn } from "@/lib/utils"

export function StylistsNavIcon({
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
        d="M12 3C9.10875 3 6.75 5.35875 6.75 8.25C6.75 10.0342 7.6575 11.613 9.02325 12.5625C5.9445 13.764 3.75 16.764 3.75 20.25H5.25C5.25 16.9515 7.64325 14.1945 10.7812 13.617L11.25 15H12.75L13.2188 13.617C16.3568 14.1945 18.75 16.9515 18.75 20.25H20.25C20.25 16.764 18.0555 13.764 14.9767 12.5625C16.3418 11.613 17.25 10.0342 17.25 8.25C17.25 5.35875 14.8912 3 12 3ZM12 4.5C14.0798 4.5 15.75 6.17025 15.75 8.25C15.75 10.3298 14.0798 12 12 12C9.92025 12 8.25 10.3298 8.25 8.25C8.25 6.17025 9.92025 4.5 12 4.5ZM11.25 15.75L10.5 20.25H13.5L12.75 15.75H11.25Z"
        fill="currentColor"
      />
    </svg>
  )
}
