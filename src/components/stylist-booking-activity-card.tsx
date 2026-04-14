"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { FileText, Loader2 } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { SearchInput } from "@/components/search-input"
import { Button } from "@/components/ui/button"
import {
  TableStatusBadge,
  formatBookingStatusLabel,
} from "@/components/ui/table-status-badge"
import { bookingRowSchema } from "@/lib/mock-bookings"
import type { BookingRowDto } from "@/models/bookings"

export type StylistBookingActivityCardProps = {
  /** Full list; search + export run inside this component (same shape as bookings list API). */
  bookings: BookingRowDto[]
  /** When set, row clicks go to booking detail with `?from=stylist&stylistId=` for nested breadcrumbs */
  stylistId?: string
  /** Shown in the card heading */
  title?: string
  /** CSV download filename prefix (date appended automatically in export) */
  exportFileNamePrefix?: string
}

export function StylistBookingActivityCard({
  bookings,
  stylistId,
  title = "Booking Activity",
  exportFileNamePrefix = "stylist_booking_activity",
}: StylistBookingActivityCardProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return bookings

    return bookings.filter((row) => {
      const haystack = [
        row.date,
        row.duration,
        row.total_cost,
        row.customer,
        row.call_type,
        formatBookingStatusLabel(row.status),
        row.status,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [bookings, searchQuery])

  const columns: ColumnDef<BookingRowDto>[] = useMemo(
    () => [
      { accessorKey: "date", header: "Date", enableSorting: false },
      { accessorKey: "duration", header: "Duration", enableSorting: false },
      { accessorKey: "total_cost", header: "Total Cost", enableSorting: false },
      { accessorKey: "customer", header: "Customer", enableSorting: false },
      { accessorKey: "call_type", header: "Call Type", enableSorting: false },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => <TableStatusBadge status={row.original.status} />,
      },
    ],
    []
  )

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleRowClick = useCallback(
    (row: unknown) => {
      const r = row as BookingRowDto
      const base = `/dashboard/bookings/${encodeURIComponent(r.id)}`
      const href =
        stylistId != null && stylistId !== ""
          ? `${base}?from=stylist&stylistId=${encodeURIComponent(stylistId)}`
          : base
      router.push(href)
    },
    [router, stylistId]
  )

  const exportCsv = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      if (filteredRows.length === 0) return
      const headers = [
        "Date",
        "Duration",
        "Total Cost",
        "Customer",
        "Call Type",
        "Status",
      ]
      const csvContent = [
        headers.join(","),
        ...filteredRows.map((row) =>
          [
            row.date,
            row.duration,
            row.total_cost,
            `"${row.customer}"`,
            `"${row.call_type}"`,
            formatBookingStatusLabel(row.status),
          ].join(",")
        ),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${exportFileNamePrefix}_${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="mb-6 admin-panel-surface">
      <div className="flex w-full flex-wrap items-center gap-4">
        <h2 className="font-satoshi text-base font-bold text-neutral-black_03">
          {title}
        </h2>
        <div className="min-w-[220px] flex-1">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search"
            className="h-[var(--height-form-field)]"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
          onClick={exportCsv}
          disabled={isExporting || filteredRows.length === 0}
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
          data={filteredRows}
          schema={bookingRowSchema}
          columns={columns as ColumnDef<unknown>[]}
          onRowClick={handleRowClick}
        />
      </div>
    </section>
  )
}
