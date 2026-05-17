'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'
import { FilePlus2, Trash2 } from 'lucide-react'

import { AddFeaturedStylistModal } from '@/components/add-featured-stylist-modal'
import { DataTable } from '@/components/data-table'
import { RemoveFeaturedStylistDialog } from '@/components/remove-featured-stylist-dialog'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useFeaturedStylists } from '@/hooks/use-featured-stylists'
import { getApiErrorMessage, stylistsApi } from '@/lib/api'
import type { StylistRowDto } from '@/models/stylists'
import { toast } from 'sonner'

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

function firstLetterOfStylistName(first: string, last: string): string {
  const f = first.trim()
  const l = last.trim()
  if (f) return f.charAt(0).toUpperCase()
  if (l) return l.charAt(0).toUpperCase()
  return '?'
}

function FeaturedStylistProfileAvatar({ row }: { row: StylistRowDto }) {
  const [imageFailed, setImageFailed] = useState(false)
  const src = row.profile_picture?.trim() ?? ''

  useEffect(() => {
    setImageFailed(false)
  }, [row.id, src])
  const label =
    [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || 'Stylist'
  const letter = firstLetterOfStylistName(row.first_name, row.last_name)
  const showImage = Boolean(src) && !imageFailed

  return (
    <div className="h-14 w-14 overflow-hidden rounded-md bg-gray-100">
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={label}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-satoshi text-sm font-semibold tracking-tight text-gray-600"
          aria-label={`No profile photo for ${label}`}
        >
          {letter}
        </span>
      )}
    </div>
  )
}

export function FeaturedStylistsTable() {
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
  } = useFeaturedStylists()

  const [items, setItems] = useState<StylistRowDto[]>([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<{
    id: string
    displayName: string
  } | null>(null)

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

  const handleReorder = useCallback(
    (
      newData: unknown[],
      dragged: { id: string | number; newIndex: number; oldIndex: number }
    ) => {
      setItems(newData as StylistRowDto[])
      const stylistId = String(dragged.id)
      /** 1-based position in the full featured list (works with pagination). */
      const order = (page - 1) * perPage + dragged.newIndex + 1
      void (async () => {
        try {
          const res = await stylistsApi.updateFeaturedOrder(stylistId, order)
          if (res.success) {
            toast.success(res.message)
          } else {
            toast.error(res.message)
            await refetch()
          }
        } catch (e) {
          toast.error(getApiErrorMessage(e))
          await refetch()
        }
      })()
    },
    [page, perPage, refetch]
  )

  const openRemoveDialog = useCallback(
    (row: StylistRowDto, e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      const displayName = [row.first_name, row.last_name]
        .filter(Boolean)
        .join(' ')
        .trim() || 'Stylist'
      setRemoveTarget({ id: row.stylistId ?? row.id, displayName })
    },
    []
  )

  const columns: ColumnDef<StylistRowDto>[] = useMemo(
    () => [
      {
        accessorKey: 'profile_picture',
        header: 'Profile Picture',
        enableSorting: false,
        cell: ({ row }) => <FeaturedStylistProfileAvatar row={row.original} />,
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
            onClick={(e) => openRemoveDialog(row.original, e)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ),
      },
    ],
    [openRemoveDialog]
  )

  return (
    <div className="mt-6 rounded-xl border border-border-soft bg-white p-4 shadow-sm md:p-6">
      <RemoveFeaturedStylistDialog
        open={removeTarget != null}
        onOpenChange={(o) => {
          if (!o) setRemoveTarget(null)
        }}
        stylistName={removeTarget?.displayName ?? ''}
        onConfirm={async () => {
          if (!removeTarget) return
          const { id, displayName: name } = removeTarget
          try {
            const res = await stylistsApi.removeFeatured(id)
            if (res.success === false) {
              throw new Error('Could not remove from featured list.')
            }
            await refetch()
            toast.success(
              name
                ? `${name} was removed from featured stylists.`
                : 'Stylist removed from featured list.'
            )
          } catch (e) {
            toast.error(getApiErrorMessage(e))
            throw e
          }
        }}
      />
      <AddFeaturedStylistModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        featuredIds={items.map((s) => s.id)}
        onConfirm={() => {
          void refetch()
        }}
      />
      {error ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

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
          onClick={() => setAddModalOpen(true)}
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
            displayDragHandle
            onReorder={handleReorder}
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
