'use client'

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'
import { FilePlus2, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/data-table'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useStylists } from '@/hooks/use-stylists'
import type { StylistRowDto } from '@/models/stylists'

const featuredStylistRowSchema = z.object({
  id: z.string(),
  profile_picture: z.string().nullable(),
  last_name: z.string(),
  first_name: z.string(),
  speciality: z.string(),
  bookings: z.number(),
  total_revenue: z.string(),
  stylist_since: z.string(),
  avg_weekly_availability: z.string(),
  avg_weekly_drop_in: z.string(),
})

export function FeaturedStylistsTable() {
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

  const [items, setItems] = useState<StylistRowDto[]>([])

  useEffect(() => {
    setItems(data)
  }, [data])

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

  const handleRemove = useCallback((id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setItems((prev) => prev.filter((s) => s.id !== id))
  }, [])

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
      {
        id: 'stylist',
        header: 'Stylist',
        enableSorting: false,
        cell: ({ row }) => (
          <span>
            {row.original.first_name} {row.original.last_name}
          </span>
        ),
      },
      { accessorKey: 'speciality', header: 'Speciality', enableSorting: false },
      { accessorKey: 'bookings', header: 'Total Bookings', enableSorting: false },
      {
        accessorKey: 'total_revenue',
        header: 'Total Sales',
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            className="inline-flex rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove from featured"
            onClick={(e) => handleRemove(row.original.id, e)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ),
      },
    ],
    [handleRemove]
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
          type="button"
          variant="outline"
          size="sm"
          className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
          onClick={() => router.push('/dashboard/stylists')}
        >
          <FilePlus2 className="h-5 w-5" />
          <span>Add Stylist</span>
        </Button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading stylists…
          </div>
        ) : (
          <DataTable
            data={items}
            schema={featuredStylistRowSchema}
            columns={columns as ColumnDef<unknown>[]}
            onRowClick={handleRowClick}
            displayDragHandle
            onReorder={(newData) => setItems(newData as StylistRowDto[])}
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
