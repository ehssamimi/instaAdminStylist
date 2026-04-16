"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { CustomersPageView } from "@/components/customers-page-view"
import { usePageTitle } from "@/hooks/use-page-title"
import {
  filterCustomerRows,
  mockCustomersSeed,
  type CustomerRow,
} from "@/lib/mock-customers"

export default function CustomersPage() {
  const { title } = usePageTitle()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)

  const filteredRows = useMemo(
    () => filterCustomerRows(mockCustomersSeed, searchQuery),
    [searchQuery]
  )

  const handleRowClick = useCallback(
    (row: CustomerRow) => {
      setIsNavigating(true)
      router.push(`/dashboard/customers/${encodeURIComponent(row.id)}`)
    },
    [router]
  )

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Opening profile…
            </span>
          </div>
        </div>
      )}
      <h1 className="admin-page-title mb-6">{title}</h1>
      <CustomersPageView
        rows={filteredRows}
        onSearch={setSearchQuery}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
