"use client"

import { FeaturedStylistsTable } from "@/components/featured-stylists-table"
import { usePageTitle } from "@/hooks/use-page-title"

export default function FeaturedStylistsPage() {
  const { title } = usePageTitle()

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title">{title}</h1>
      <FeaturedStylistsTable />
    </div>
  )
}
