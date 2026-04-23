"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { format, isValid, parseISO } from "date-fns"
import { Loader2 } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { ReportTableActionButton } from "@/components/report-table-action-button"
import { SearchInput } from "@/components/search-input"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { usePageTitle } from "@/hooks/use-page-title"
import { useReportsOverview } from "@/hooks/use-reports-overview"
import { getApiErrorMessage, reportsApi } from "@/lib/api"
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
    error,
    page,
    perPage,
    totalPages,
    setPage,
    setPerPage,
    setSearch,
    refetch,
  } = useReportsOverview(status)

  const [isNavigating, setIsNavigating] = useState(false)
  const [confirmAction, setConfirmAction] = useState<
    | null
    | {
        type: "ignore" | "remove" | "reopen" | "restore"
        row: ReportRow
      }
  >(null)
  const [actionError, setActionError] = useState<string | null>(null)

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
          const st = row.original.status
          return (
            <div
              className="flex flex-wrap items-center gap-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {st === "OPEN" ? (
                <div className="flex   items-center gap-2.5">
                  <ReportTableActionButton
                    variant="neutral"
                    onClick={() => {
                      setActionError(null)
                      setConfirmAction({
                        type: "ignore",
                        row: row.original,
                      })
                    }}
                  >
                    Ignore Report
                  </ReportTableActionButton>
                  <ReportTableActionButton
                    variant="danger"
                    onClick={() => {
                      setActionError(null)
                      setConfirmAction({
                        type: "remove",
                        row: row.original,
                      })
                    }}
                  >
                    Remove User
                  </ReportTableActionButton>
                </div>
              ) : null}
              {st === "IGNORED" ? (
                <ReportTableActionButton
                  variant="neutral"
                  onClick={() => {
                    setActionError(null)
                    setConfirmAction({
                      type: "reopen",
                      row: row.original,
                    })
                  }}
                >
                  Reopen report
                </ReportTableActionButton>
              ) : null}
              {st === "REMOVED_USER" ? (
                <ReportTableActionButton
                  variant="neutral"
                  onClick={() => {
                    setActionError(null)
                    setConfirmAction({
                      type: "restore",
                      row: row.original,
                    })
                  }}
                >
                  Restore user
                </ReportTableActionButton>
              ) : null}
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

      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

      {actionError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      {confirmAction ? (
        <ConfirmDialog
          open
          onOpenChange={(o) => {
            if (!o) setConfirmAction(null)
          }}
          title={
            confirmAction.type === "ignore"
              ? "Ignore this report?"
              : confirmAction.type === "remove"
                ? "Remove user?"
                : confirmAction.type === "reopen"
                  ? "Reopen this report?"
                  : "Restore user?"
          }
          description={
            confirmAction.type === "ignore"
              ? "The report will be marked as ignored and no further action will be taken."
              : confirmAction.type === "remove"
                ? `This will suspend ${confirmAction.row.reported_user} and mark the report as removed.`
                : confirmAction.type === "reopen"
                  ? "The report will return to open status for review."
                  : `This will restore ${confirmAction.row.reported_user} and set the report back to open.`
          }
          confirmLabel={
            confirmAction.type === "ignore"
              ? "Ignore report"
              : confirmAction.type === "remove"
                ? "Remove user"
                : confirmAction.type === "reopen"
                  ? "Reopen report"
                  : "Restore user"
          }
          onConfirm={() =>
            (async () => {
              const { type, row } = confirmAction
              try {
                if (type === "ignore") await reportsApi.ignore(row.id)
                else if (type === "remove")
                  await reportsApi.removeUser(row.id)
                else if (type === "reopen") await reportsApi.reopen(row.id)
                else await reportsApi.restoreUser(row.id)
                setActionError(null)
                await refetch()
              } catch (e) {
                setActionError(getApiErrorMessage(e))
                throw e
              }
            })()
          }
        />
      ) : null}

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
