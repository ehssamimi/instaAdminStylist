"use client"

import Link from "next/link"
import { MoveLeft } from "lucide-react"
import {
 IconArrowNarrowLeft
} from "@tabler/icons-react"

type PageBackHeadingProps = {
  title: string
  backHref: string
  backAriaLabel?: string
}

export function PageBackHeading({
  title,
  backHref,
  backAriaLabel = "Go back",
}: PageBackHeadingProps) {
  return (
    <div className="flex items-center gap-3 mb-4 font-satoshi">
      <Link
        href={backHref}
        className="flex shrink-0 items-center text-black-100 transition-opacity hover:opacity-70 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={backAriaLabel}
      >
        <IconArrowNarrowLeft className="size-5 stroke-[1.5]" aria-hidden />
      </Link>
      <h1 className="font-satoshi text-[32px] font-bold not-italic leading-[110%] text-black-100 ml-2">
        {title}
      </h1>
    </div>
  )
}
