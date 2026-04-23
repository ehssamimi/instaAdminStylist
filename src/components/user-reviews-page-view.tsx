"use client"

import React, { useCallback, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format, isValid, parseISO } from "date-fns"

import { DataTable } from "@/components/data-table"
import { SearchInput } from "@/components/search-input"
import { Button } from "@/components/ui/button"
import { EachContainer } from "@/components/each-container"
import {
  userReviewRowSchema,
  type UserReviewRow,
  type UserReviewStatus,
} from "@/lib/mock-user-reviews"
import { cn } from "@/lib/utils"

function formatReviewDate(value: string): string {
  const d = parseISO(value)
  if (isValid(d)) return format(d, "MM/dd/yyyy")
  const fallback = new Date(value)
  if (isValid(fallback)) return format(fallback, "MM/dd/yyyy")
  return value
}

const approveButtonClass =
  "h-8 shrink-0 rounded-md border border-emerald-300 bg-emerald-50 px-3 text-xs font-medium text-emerald-800 shadow-none hover:bg-emerald-100/90"

const rejectButtonClass =
  "h-8 shrink-0 rounded-md border border-rose-300 bg-rose-50 px-3 text-xs font-medium text-rose-700 shadow-none hover:bg-rose-100/90"

const TAB_DEFS: { id: UserReviewStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
]

export type UserReviewsPageViewProps = {
  rows: UserReviewRow[]
  activeTab: UserReviewStatus
  onTabChange: (tab: UserReviewStatus) => void
  counts: { pending: number; approved: number; rejected: number }
  onSearch: (query: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onApproveAll: () => void
  disableApproveAll?: boolean
}

export function UserReviewsPageView({
  rows,
  activeTab,
  onTabChange,
  counts,
  onSearch,
  onApprove,
  onReject,
  onApproveAll,
  disableApproveAll = false,
}: UserReviewsPageViewProps) {
  const showRowActions = activeTab === "pending"

  const columns: ColumnDef<UserReviewRow>[] = useMemo(() => {
    const cols: ColumnDef<UserReviewRow>[] = [
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
        accessorKey: "date",
        header: "Date",
        enableSorting: false,
        cell: ({ row }) => formatReviewDate(row.original.date),
      },
      {
        accessorKey: "review",
        header: "Review",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="block max-w-[min(28rem,50vw)] whitespace-normal text-gray-700">
            {row.original.review}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: () => (
          <span className="flex w-full justify-center font-satoshi text-xs font-bold text-black">
            Rating
          </span>
        ),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="flex w-full justify-center tabular-nums text-gray-700">
            {row.original.rating}
          </span>
        ),
      },
      {
        accessorKey: "stylist",
        header: "Stylist",
        enableSorting: false,
      },
    ]

    if (showRowActions) {
      cols.push({
        id: "actions",
        header: "Approve or Reject",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={approveButtonClass}
              onClick={() => onApprove(row.original.id)}
            >
              Approve
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={rejectButtonClass}
              onClick={() => onReject(row.original.id)}
            >
              Reject
            </Button>
          </div>
        ),
      })
    }

    return cols
  }, [onApprove, onReject, showRowActions])

  const handleSearch = useCallback(
    (q: string) => {
      onSearch(q)
    },
    [onSearch]
  )

  return (
    <EachContainer className="mt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-3">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search"
            className="h-[var(--height-form-field)] border-gray-200"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-[var(--height-form-field)] shrink-0 rounded-lg border-gray-200 bg-white font-semibold text-gray-900 shadow-none hover:bg-gray-50"
          onClick={onApproveAll}
          disabled={disableApproveAll}
        >
          Approve All Reviews
        </Button>
      </div>

      <nav
        className="mt-6 flex w-full flex-wrap gap-x-8 gap-y-2 border-b border-gray-200"
        aria-label="Review status"
      >
        {TAB_DEFS.map(({ id, label }) => {
          const active = activeTab === id
          const count = counts[id]
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "relative -mb-px flex items-center gap-2 pb-3 text-sm  transition-colors",
                active ? "text-gray-900 font-semibold " : "text-gray-400 hover:text-gray-600"
              )}
            >
              {label}
              <span
                className={cn(
                  "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs  text-white",
                  active ? "bg-neutral-900 font-semibold" : "bg-gray-100 text-gray-500 "
                )}
              >
                {count}
              </span>
              {active ? (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-neutral-900"
                  aria-hidden
                />
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="mt-4">
        <DataTable
          data={rows}
          schema={userReviewRowSchema}
          columns={columns as ColumnDef<unknown>[]}
          embedded
          headerTone="plain"
        />
      </div>
    </EachContainer>
  )
}
