"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { CustomersPageView } from "@/components/customers-page-view"
import { usePageTitle } from "@/hooks/use-page-title"
import { useAdminUsers } from "@/hooks/use-admin-users"
import type { CustomerRow } from "@/models/customersList"
import { getApiErrorMessage } from "@/lib/api"

export default function CustomersPage() {
  const { title } = usePageTitle()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isNavigating, setIsNavigating] = useState(false)

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    page,
    pageSize,
    search: searchQuery,
  })

  const tableRows = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1
  const totalItemCount = data?.meta.total

  const handleSearch = useCallback((query: string) => {
    setPage(1)
    setSearchQuery(query)
  }, [])

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

      {isError && (
        <div
          className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {getApiErrorMessage(error)}{" "}
          <button
            type="button"
            className="ml-2 underline underline-offset-2"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </div>
      )}

      <CustomersPageView
        rows={tableRows}
        onSearch={handleSearch}
        onRowClick={handleRowClick}
        isLoading={isLoading}
        serverPagination
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItemCount={totalItemCount}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1)
          setPageSize(size)
        }}
      />
    </div>
  )
}
