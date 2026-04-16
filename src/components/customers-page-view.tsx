"use client"

import React, { useCallback, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format, isValid, parseISO } from "date-fns"

import { DataTable } from "@/components/data-table"
import { SearchInput } from "@/components/search-input"
import { EachContainer } from "@/components/each-container"
import { customerRowSchema, type CustomerRow } from "@/lib/mock-customers"

function formatLastBooking(value: string): string {
  const d = parseISO(value)
  if (isValid(d)) return format(d, "MM/dd/yyyy")
  const fallback = new Date(value)
  if (isValid(fallback)) return format(fallback, "MM/dd/yyyy")
  return value
}

export type CustomersPageViewProps = {
  rows: CustomerRow[]
  onSearch: (query: string) => void
  onRowClick?: (row: CustomerRow) => void
}

export function CustomersPageView({
  rows,
  onSearch,
  onRowClick,
}: CustomersPageViewProps) {
  const columns: ColumnDef<CustomerRow>[] = useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.customer}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "total_bookings",
        header: "Total Bookings",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.total_bookings}
          </span>
        ),
      },
      {
        accessorKey: "last_booking",
        header: "Last Booking",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {formatLastBooking(row.original.last_booking)}
          </span>
        ),
      },
    ],
    []
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
      </div>

      <div className="mt-4">
        <DataTable
          data={rows}
          schema={customerRowSchema}
          columns={columns as ColumnDef<unknown>[]}
          onRowClick={
            onRowClick ? (r) => onRowClick(r as CustomerRow) : undefined
          }
        />
      </div>
    </EachContainer>
  )
}
