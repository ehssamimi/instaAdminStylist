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
} from "@/lib/mock-user-reviews"

function formatReviewDate(value: string): string {
  const d = parseISO(value)
  if (isValid(d)) return format(d, "MM/dd/yyyy")
  const fallback = new Date(value)
  if (isValid(fallback)) return format(fallback, "MM/dd/yyyy")
  return value
}

const approveButtonClass =
  "h-8 shrink-0 border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-800 shadow-none hover:bg-emerald-100/80"

const rejectButtonClass =
  "h-8 shrink-0 border border-rose-200 bg-rose-50 px-3 text-xs font-medium text-rose-700 shadow-none hover:bg-rose-100/80"

export type UserReviewsPageViewProps = {
  rows: UserReviewRow[]
  onSearch: (query: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onApproveAll: () => void
  disableApproveAll?: boolean
}

export function UserReviewsPageView({
  rows,
  onSearch,
  onApprove,
  onReject,
  onApproveAll,
  disableApproveAll = false,
}: UserReviewsPageViewProps) {
  const columns: ColumnDef<UserReviewRow>[] = useMemo(
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
          <span className="block max-w-[min(28rem,50vw)] whitespace-normal text-muted-foreground">
            {row.original.review}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        enableSorting: false,
      },
      {
        accessorKey: "stylist",
        header: "Stylist",
        enableSorting: false,
      },
      {
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
      },
    ],
    [onApprove, onReject]
  )

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
            className="h-[var(--height-form-field)]"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
          onClick={onApproveAll}
          disabled={disableApproveAll || rows.length === 0}
        >
          Approve All Reviews
        </Button>
      </div>

      <div className="mt-4">
        <DataTable
          data={rows}
          schema={userReviewRowSchema}
          columns={columns as ColumnDef<unknown>[]}
        />
      </div>
    </EachContainer>
  )
}
