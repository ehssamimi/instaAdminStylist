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
import { bookingRowSchema } from "@/lib/booking-schema"
import type { BookingRowDto } from "@/models/bookings"

export type BookingActivityRowClickContext =
  | { kind: "stylist"; stylistId: string }
  | { kind: "customer"; customerId: string }
  | { kind: "plain" }

export type BookingActivitySectionProps = {
  bookings: BookingRowDto[]
  title?: string
  exportFileNamePrefix?: string
  /** Stylist profile: show Customer. Customer profile: show Stylist. */
  counterpartColumn: "customer" | "stylist"
  costColumnHeader?: "Total Cost" | "Cost"
  rowClickContext?: BookingActivityRowClickContext
}

export function BookingActivitySection({
  bookings,
  title = "Booking Activity",
  exportFileNamePrefix = "booking_activity",
  counterpartColumn,
  costColumnHeader = "Total Cost",
  rowClickContext = { kind: "plain" },
}: BookingActivitySectionProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return bookings

    return bookings.filter((row) => {
      const counterpart =
        counterpartColumn === "customer" ? row.customer : row.stylist
      const haystack = [
        row.date,
        row.duration,
        row.total_cost,
        counterpart,
        row.call_type,
        formatBookingStatusLabel(row.status),
        row.status,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [bookings, counterpartColumn, searchQuery])

  const columns: ColumnDef<BookingRowDto>[] = useMemo(() => {
    const costCol = {
      accessorKey: "total_cost" as const,
      header: costColumnHeader,
      enableSorting: false,
    }
    const callTypeCol = {
      accessorKey: "call_type" as const,
      header: "Call Type",
      enableSorting: false,
    }
    const statusCol: ColumnDef<BookingRowDto> = {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => <TableStatusBadge status={row.original.status} />,
    }

    const start = [
      { accessorKey: "date" as const, header: "Date", enableSorting: false },
      {
        accessorKey: "duration" as const,
        header: "Duration",
        enableSorting: false,
      },
      costCol,
    ]

    if (counterpartColumn === "customer") {
      return [
        ...start,
        {
          accessorKey: "customer" as const,
          header: "Customer",
          enableSorting: false,
        },
        callTypeCol,
        statusCol,
      ]
    }

    return [
      ...start,
      {
        accessorKey: "stylist" as const,
        header: "Stylist",
        enableSorting: false,
      },
      callTypeCol,
      statusCol,
    ]
  }, [counterpartColumn, costColumnHeader])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleRowClick = useCallback(
    (row: unknown) => {
      const r = row as BookingRowDto
      const base = `/dashboard/bookings/${encodeURIComponent(r.id)}`
      if (rowClickContext.kind === "stylist") {
        router.push(
          `${base}?from=stylist&stylistId=${encodeURIComponent(rowClickContext.stylistId)}`
        )
      } else if (rowClickContext.kind === "customer") {
        router.push(
          `${base}?from=customer&customerId=${encodeURIComponent(rowClickContext.customerId)}`
        )
      } else {
        router.push(base)
      }
    },
    [router, rowClickContext]
  )

  const exportCsv = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      if (filteredRows.length === 0) return
      const counterpartHeader = counterpartColumn === "customer" ? "Customer" : "Stylist"
      const headers = [
        "Date",
        "Duration",
        costColumnHeader,
        counterpartHeader,
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
            `"${counterpartColumn === "customer" ? row.customer : row.stylist}"`,
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
