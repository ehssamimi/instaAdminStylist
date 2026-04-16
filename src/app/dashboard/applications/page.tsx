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
import { usePendingStylistApplications } from "@/hooks/use-stylist-applications"
import type { PendingStylistApplication } from "@/models/stylistApplication"
import { EachContainer } from "@/components/each-container"
import { ADMIN_DASHBOARD_TABS_TRIGGER_CLASS } from "@/lib/admin-dashboard-tabs"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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

function mapPendingToRow(item: PendingStylistApplication): ApplicationRow {
  const last = item.lastName ?? item.user?.lastName ?? ""
  const first = item.firstName ?? item.user?.firstName ?? ""
  const exp = item.experience?.trim() ?? ""
  const experienceDisplay =
    exp && !UUID_RE.test(exp) ? exp : "—"

  const specs = item.speciality ?? []
  let specialityDisplay = "—"
  if (specs.length === 1) {
    specialityDisplay = UUID_RE.test(specs[0]) ? "1 specialty" : specs[0]
  } else if (specs.length > 1) {
    specialityDisplay = `${specs.length} specialties`
  }

  return {
    id: item.id,
    stylist_id: item.userId,
    last_name: last || "—",
    first_name: first || "—",
    experience: experienceDisplay,
    speciality: specialityDisplay,
    status: "pending",
  }
}

const tabToStatus = {
  "needs-review": "pending" as const,
  approved: "approved" as const,
  rejected: "rejected" as const,
}

type TabValue = keyof typeof tabToStatus

function filterRows(
  rows: ApplicationRow[],
  status: ApplicationRow["status"],
  query: string
): ApplicationRow[] {
  const q = query.trim().toLowerCase()
  return rows.filter((row) => {
    if (row.status !== status) return false
    if (!q) return true
    const hay = [row.last_name, row.first_name, row.experience, row.speciality]
      .join(" ")
      .toLowerCase()
    return hay.includes(q)
  })
}

export default function ApplicationsPage() {
  const { title } = usePageTitle()
  const router = useRouter()
  const { data: pendingList, isLoading, isError, error, refetch } =
    usePendingStylistApplications()

  const [activeTab, setActiveTab] = useState<TabValue>("needs-review")
  const [isNavigating, setIsNavigating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchKey, setSearchKey] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  const status = tabToStatus[activeTab]

  const pendingRows = useMemo(
    () => (pendingList ?? []).map(mapPendingToRow),
    [pendingList]
  )

  const tabSourceRows = useMemo(() => {
    if (activeTab === "needs-review") return pendingRows
    return [] as ApplicationRow[]
  }, [activeTab, pendingRows])

  const filteredData = useMemo(
    () => filterRows(tabSourceRows, status, searchQuery),
    [tabSourceRows, status, searchQuery]
  )

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
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
      if (filteredData.length === 0) return
      const headers = ["Last Name", "First Name", "Experience", "Speciality", "Status"]
      const statusLabel =
        activeTab === "needs-review"
          ? "Needs Review"
          : activeTab === "approved"
            ? "Approved"
            : "Rejected"
      const csvContent = [
        headers.join(","),
        ...filteredData.map((row) =>
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

  const listLoading = activeTab === "needs-review" && isLoading

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
      <h1 className="admin-page-title mb-6">{title}</h1>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
        className="gap-0 "
      >
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

      {isError && activeTab === "needs-review" && (
        <div
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error instanceof Error ? error.message : "Failed to load pending applications."}{" "}
          <button
            type="button"
            className="ml-2 underline underline-offset-2"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

  <EachContainer className="mt-4">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-1 items-center gap-3">
            <SearchInput
              key={searchKey}
              onSearch={handleSearch}
              placeholder="Search"
              disabled={listLoading}
              className="h-[var(--height-form-field)]"

            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
            onClick={exportCsv}
            disabled={isExporting || filteredData.length === 0}
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
            data={filteredData}
            schema={applicationSchema}
            columns={columns as ColumnDef<unknown>[]}
            isLoading={listLoading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
     
    </EachContainer>
    </div>
  )
}
