"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { FileText, Loader2 } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { SearchInput } from "@/components/search-input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePageTitle } from "@/hooks/use-page-title"
import { useStylistApplications } from "@/hooks/use-stylist-applications"
import type { StylistApplicationListItem } from "@/models/stylistApplication"
import type { StylistApplicationsQueryParams } from "@/lib/api"
import { EachContainer } from "@/components/each-container"
import { ADMIN_DASHBOARD_TABS_TRIGGER_CLASS } from "@/lib/admin-dashboard-tabs"

const applicationSchema = z.object({
  id: z.string(),
  /** User/stylist id for `GET /api/stylist/details/:id` (not the application row id). */
  stylist_id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  experience: z.string(),
  speciality: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
})

type ApplicationRow = z.infer<typeof applicationSchema>

const API_STATUS_TO_ROW: Record<
  StylistApplicationListItem["status"],
  ApplicationRow["status"]
> = {
  PENDING_REVIEW: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
}

function mapApiItemToRow(item: StylistApplicationListItem): ApplicationRow {
  const y = item.yearsOfExperience
  const experienceDisplay =
    y == null ? "—" : y === 1 ? "1 year" : `${y} years`
  const specialityDisplay = item.speciality?.trim() || "—"

  return {
    id: item.userId,
    stylist_id: item.userId,
    last_name: item.lastName?.trim() || "—",
    first_name: item.firstName?.trim() || "—",
    experience: experienceDisplay,
    speciality: specialityDisplay,
    status: API_STATUS_TO_ROW[item.status] ?? "pending",
  }
}

const tabToApiStatus = {
  "needs-review": "review",
  approved: "approved",
  rejected: "rejected",
} as const satisfies Record<string, StylistApplicationsQueryParams["status"]>

type TabValue = keyof typeof tabToApiStatus

export default function ApplicationsPage() {
  const { title } = usePageTitle()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabValue>("needs-review")
  const [isNavigating, setIsNavigating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isExporting, setIsExporting] = useState(false)

  const apiStatus = tabToApiStatus[activeTab]

  const { data, isLoading, isError, error, refetch } = useStylistApplications({
    status: apiStatus,
    page,
    pageSize,
    search: searchQuery,
  })

  const tableRows = useMemo(
    () => (data?.data ?? []).map(mapApiItemToRow),
    [data?.data]
  )

  const totalPages = data?.meta.totalPages ?? 1
  const totalItemCount = data?.meta.total


  const handleSearch = useCallback((query: string) => {
    setPage(1)
    setSearchQuery(query)
  }, [])

  const handleTabChange = useCallback((v: string) => {
    setActiveTab(v as TabValue)
    setPage(1)
  }, [])

  const handleRowClick = useCallback(
    (row: unknown) => {
      const r = row as ApplicationRow
      setIsNavigating(true)
      router.push(`/dashboard/applications/${r.stylist_id}`)
    },
    [router]
  )

  const columns: ColumnDef<ApplicationRow>[] = useMemo(
    () => [
      {
        accessorKey: "last_name",
        header: "Last Name",
        enableSorting: false,
      },
      {
        accessorKey: "first_name",
        header: "First Name",
        enableSorting: false,
      },
      {
        accessorKey: "experience",
        header: "Experience",
        enableSorting: false,
      },
      {
        accessorKey: "speciality",
        header: "Speciality",
        enableSorting: false,
      },
    ],
    []
  )

  const exportCsv = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      if (tableRows.length === 0) return
      const headers = ["Last Name", "First Name", "Experience", "Speciality", "Status"]
      const statusLabel =
        activeTab === "needs-review"
          ? "Needs Review"
          : activeTab === "approved"
            ? "Approved"
            : "Rejected"
      const csvContent = [
        headers.join(","),
        ...tableRows.map((row) =>
          [
            `"${row.last_name}"`,
            `"${row.first_name}"`,
            `"${row.experience}"`,
            `"${row.speciality}"`,
            `"${statusLabel}"`,
          ].join(",")
        ),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `applications_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Opening profile…</span>
          </div>
        </div>
      )}
      <h1 className="admin-page-title mb-11">{title}</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-0 ">
        <div className="w-full border-0 border-b border-gray-200">
          <TabsList className="mb-0 h-auto   justify-start gap-8 rounded-none  bg-transparent p-0">
            <TabsTrigger
              value="needs-review"
              className={ADMIN_DASHBOARD_TABS_TRIGGER_CLASS}
            >
              Needs Review
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className={ADMIN_DASHBOARD_TABS_TRIGGER_CLASS}
            >
              Approved
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className={ADMIN_DASHBOARD_TABS_TRIGGER_CLASS}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {isError && (
        <div
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error instanceof Error ? error.message : "Failed to load applications."}{" "}
          <button
            type="button"
            className="ml-2 underline underline-offset-2"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      <EachContainer className="mt-6">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-1 items-center gap-3">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search first name, last name, email, or speciality labels"
                disabled={isLoading}
                className="h-[var(--height-form-field)]"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
              onClick={exportCsv}
              disabled={isExporting || tableRows.length === 0}
            >
              {isExporting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              <span>{isExporting ? "Exporting…" : "Export"}</span>
            </Button>
          </div>

          <div className="mt-4">
            <DataTable
              data={tableRows}
              schema={applicationSchema}
              columns={columns as ColumnDef<unknown>[]}
              isLoading={isLoading}
              onRowClick={handleRowClick}
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
        </div>
      </EachContainer>
    </div>
  )
}
