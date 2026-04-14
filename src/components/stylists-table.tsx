'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'
import { FileText } from 'lucide-react'

import { DataTable } from '@/components/data-table'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useStylists } from '@/hooks/use-stylists'
import type { StylistRowDto } from '@/models/stylists'

const stylistSchema = z.object({
  id: z.string(),
  profile_picture: z.string().nullable(),
  last_name: z.string(),
  first_name: z.string(),
  speciality: z.string(),
  bookings: z.number(),
  total_sales: z.string(),
  stylist_since: z.string(),
  avg_weekly_availability: z.string(),
  avg_weekly_drop_in: z.string(),
})

export function StylistsTable() {
  const router = useRouter()

  const {
    data,
    loading,
    page,
    perPage,
    totalPages,
    setPage,
    setPerPage,
    setSearch,
  } = useStylists()

  const handleSearch = useCallback(
    (query: string) => {
      setPage(1)
      setSearch(query)
    },
    [setPage, setSearch]
  )

  const handleRowClick = useCallback(
    (row: unknown) => {
      const stylist = row as StylistRowDto
      router.push(`/dashboard/stylist/${stylist.id}`)
    },
    [router]
  )

  const columns: ColumnDef<StylistRowDto>[] = useMemo(
    () => [
      {
        accessorKey: 'profile_picture',
        header: 'Profile Picture',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="h-14 w-14 overflow-hidden rounded-md bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.original.profile_picture ?? ''}
              alt={`${row.original.first_name} ${row.original.last_name}`}
              className="h-full w-full object-cover"
            />
          </div>
        ),
      },
      { accessorKey: 'last_name', header: 'Last Name', enableSorting: false },
      { accessorKey: 'first_name', header: 'First Name', enableSorting: false },
      { accessorKey: 'speciality', header: 'Speciality', enableSorting: false },
      { accessorKey: 'bookings', header: 'Bookings', enableSorting: false },
      { accessorKey: 'total_revenue', header: 'Total Revenue', enableSorting: false },
      { accessorKey: 'stylist_since', header: 'Stylists Since', enableSorting: false },
      {
        accessorKey: 'avg_weekly_availability',
        header: 'Avg. Weekly Avail.',
        enableSorting: false,
      },
      {
        accessorKey: 'avg_weekly_drop_in',
        header: 'Avg. Weekly Drop-in',
        enableSorting: false,
      },
    ],
    []
  )

  return (
    <div className="mt-6 rounded-xl border border-border-soft bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-3">
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
        >
          <FileText className="h-6 w-6" />
          <span>Export</span>
        </Button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading stylists…
          </div>
        ) : (
          <DataTable
            data={data}
            schema={stylistSchema}
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
  )
}
