'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { format, isValid, parse } from 'date-fns'
import { FileText, Loader2 } from 'lucide-react'

import { DataTable } from '@/components/data-table'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import {
  TableStatusBadge,
  formatBookingStatusLabel,
} from '@/components/ui/table-status-badge'
import { usePageTitle } from '@/hooks/use-page-title'
import { useBookingsOverview } from '@/hooks/use-bookings-overview'
import { bookingRowSchema, type BookingRow } from '@/lib/booking-schema'

function formatBookingListDate(value: string): string {
  const fromPattern = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date())
  if (isValid(fromPattern)) return format(fromPattern, 'MM/dd/yy')
  const fallback = new Date(value.replace(' ', 'T'))
  if (isValid(fallback)) return format(fallback, 'MM/dd/yy')
  return value
}

export default function BookingsContent() {
  const { title } = usePageTitle()
  const router = useRouter()
  const {
    data: bookingsData,
    loading,
    error,
    page,
    perPage,
    totalPages,
    setPage,
    setPerPage,
    setSearch,
  } = useBookingsOverview()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleSearch = useCallback((query: string) => {
    setPage(1)
    setSearch(query)
  }, [setPage, setSearch])

  const handleRowClick = useCallback(
    (row: unknown) => {
      const r = row as BookingRow
      setIsNavigating(true)
      router.push(`/dashboard/bookings/${r.id}`)
    },
    [router]
  )

  const columns: ColumnDef<BookingRow>[] = useMemo(
    () => [
      {
        accessorKey: 'booking_id',
        header: 'Booking ID',
        enableSorting: false,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        enableSorting: false,
        cell: ({ row }) => formatBookingListDate(row.original.date),
      },
      {
        accessorKey: 'stylist',
        header: 'Stylist',
        enableSorting: false,
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        enableSorting: false,
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        enableSorting: false,
      },
      {
        accessorKey: 'total_cost',
        header: 'Total Cost',
        enableSorting: false,
      },
      {
        accessorKey: 'service_fee',
        header: 'Service Fee',
        enableSorting: false,
      },
      {
        accessorKey: 'call_type',
        header: 'Call Type',
        enableSorting: false,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => (
          <TableStatusBadge status={row.original.status} />
        ),
      },
    ],
    []
  )

  const exportCsv = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      if (bookingsData.length === 0) return
      const headers = [
        'Booking ID',
        'Date',
        'Stylist',
        'Customer',
        'Duration',
        'Total Cost',
        'Service Fee',
        'Call Type',
        'Status',
      ]
      const csvContent = [
        headers.join(','),
        ...bookingsData.map((row) =>
          [
            row.booking_id,
            formatBookingListDate(row.date),
            `"${row.stylist}"`,
            `"${row.customer}"`,
            row.duration,
            row.total_cost,
            row.service_fee,
            `"${row.call_type}"`,
            formatBookingStatusLabel(row.status),
          ].join(',')
        ),
      ].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `booking_history_${new Date().toISOString().split('T')[0]}.csv`
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
            <span className="text-sm text-muted-foreground">Opening booking…</span>
          </div>
        </div>
      )}
      <h1 className="admin-page-title mb-6">{title}</h1>
      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

      <div className="admin-panel-surface">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-1 items-center gap-3">
            <SearchInput onSearch={handleSearch} placeholder="Search" className="h-[var(--height-form-field)]" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
            onClick={exportCsv}
            disabled={isExporting || bookingsData.length === 0}
          >
            {isExporting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <FileText className="h-6 w-6" />
            )}
            <span>{isExporting ? 'Exporting…' : 'Export'}</span>
          </Button>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Loading bookings...
            </div>
          ) : (
            <DataTable
              data={bookingsData}
              schema={bookingRowSchema}
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
