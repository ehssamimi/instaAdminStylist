"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { format, isValid, parseISO } from "date-fns"
import { Loader2 } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { SearchInput } from "@/components/search-input"
import { usePageTitle } from "@/hooks/use-page-title"
import { useReportsOverview } from "@/hooks/use-reports-overview"
import {
  reportRowSchema,
  type ReportRow,
} from "@/lib/mock-reports"
import type { ReportStatus } from "@/models/reports"
import { cn } from "@/lib/utils"

const tabToStatus = {
  "to-review": "OPEN" as const,
  removed: "REMOVED_USER" as const,
  ignored: "IGNORED" as const,
}

type TabValue = keyof typeof tabToStatus

const tabLabels: Record<TabValue, string> = {
  "to-review": "Reports to Review",
  removed: "Removed Users",
  ignored: "Ignored Reports",
}

function formatListDate(iso: string): string {
  const d = parseISO(iso)
  if (!isValid(d)) return iso
  return format(d, "MM/dd/yyyy")
}

export default function ReportsPage() {
  const { title } = usePageTitle()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabValue>("to-review")
  const status: ReportStatus = tabToStatus[activeTab]

  const {
    data,
    loading,
    page,
    perPage,
    totalPages,
    setPage,
    setPerPage,
    setSearch,
  } = useReportsOverview(status)

  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [activeTab, setPage])

  const handleSearch = useCallback(
    (query: string) => {
      setPage(1)
      setSearch(query)
    },
    [setPage, setSearch]
  )

  const handleRowClick = useCallback(
    (row: unknown) => {
      const r = row as ReportRow
      setIsNavigating(true)
      router.push(`/dashboard/report/${r.id}`)
    },
    [router]
  )

  const columns: ColumnDef<ReportRow>[] = useMemo(
    () => [
      {
        accessorKey: "reported_user",
        header: "Reported User",
        enableSorting: false,
      },
      {
        accessorKey: "user_type",
        header: "User Type",
        enableSorting: false,
      },
      {
        accessorKey: "reasoning",
        header: "Report Reasoning",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="line-clamp-3 max-w-md whitespace-pre-wrap font-satoshi text-sm font-normal leading-snug text-gray-700">
            {row.original.reasoning}
          </span>
        ),
      },
      {
        accessorKey: "report_date",
        header: "Report Date",
        enableSorting: false,
        cell: ({ row }) => formatListDate(row.original.report_date),
      },
      {
        accessorKey: "reported_by",
        header: "Reported by",
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const open = row.original.status === "OPEN"
          return (
            <div
              className="flex flex-wrap items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {open ? (
                <>
                  <button
                    type="button"
                    className="font-satoshi text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    onClick={() => {
                      /* wire PATCH ignore when API exists */
                    }}
                  >
                    Ignore Report
                  </button>
                  <button
                    type="button"
                    className="font-satoshi text-sm font-semibold text-destructive underline-offset-4 transition-colors hover:underline"
                    onClick={() => {
                      /* wire remove user when API exists */
                    }}
                  >
                    Remove User
                  </button>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      {isNavigating ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Opening report…
            </span>
          </div>
        </div>
      ) : null}

      <h1 className="admin-page-title mb-6">{title}</h1>

      <div className="rounded-xl border border-border-soft bg-white p-4 shadow-sm md:p-6">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search"
          className="h-[var(--height-form-field)] w-full max-w-none"
        />

        <div className="mt-4 inline-flex max-w-full flex-nowrap items-start gap-1 rounded-[8px] bg-[#FAFAFA] p-1">
          {(Object.keys(tabToStatus) as TabValue[]).map((key) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-[6px] px-[23px] py-[9px] pr-[18.039px] text-center font-satoshi text-[12px] font-normal leading-[130%] text-[#414651] transition-[color,box-shadow,background-color]",
                  isActive
                    ? "bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
                    : "bg-transparent hover:bg-black/[0.02]"
                )}
              >
                {tabLabels[key]}
              </button>
            )
          })}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Loading reports…
            </div>
          ) : (
            <DataTable
              data={data}
              schema={reportRowSchema}
              columns={columns as ColumnDef<unknown>[]}
              onRowClick={handleRowClick}
              serverPagination
              currentPage={page}
              pageSize={perPage}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPage(1)
                setPerPage(size)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
