"use client"

import { usePageTitle } from "@/hooks/use-page-title"

/** Minimal shell for dashboard sections that are not built yet. */
export function DashboardPlaceholderPage() {
  const { title } = usePageTitle()
  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title">{title}</h1>
      <p className="mt-4 font-satoshi text-sm text-black-40">
        This section is coming soon.
      </p>
    </div>
  )
}
