"use client"
// this component inspired from https://ui.shadcn.com/blocks
// to fixed rerender bugs
// https://github.com/TanStack/table/issues/4614
// https://github.com/TanStack/table/issues/4794
import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLoader,
  IconPlus,
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconArrowsSort,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function DataTable({
  data: initialData,
  columns,
  schema,
  isLoading,
  isUpdating,
  onRowClick,
  onReorder,
  disablePagination = false,
  // Server-side pagination props
  serverPagination,
  totalPages,
  /** Total rows on the server (all pages). When set, pagination shows if this exceeds the page size. */
  totalItemCount,
  currentPage,
  pageSize: externalPageSize,
  onPageChange,
  onPageSizeChange,
  displayDragHandle = false,
  /** When true, table sits inside an existing card (no inner white panel). */
  embedded = false,
  /** `plain`: light header row for dense admin tables inside a panel. */
  headerTone = "brand" as "brand" | "plain",
}: {
  data: unknown[]
  columns: ColumnDef<unknown>[]
  schema: unknown
  isLoading?: boolean
  onRowClick?: (row: unknown) => void
  onReorder?: (reorderedData: unknown[], draggedItem: { id: number | string; newIndex: number; oldIndex: number }) => void
  disablePagination?: boolean
  // Server-side pagination props
  serverPagination?: boolean
  totalPages?: number
  totalItemCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  isUpdating?: boolean
  displayDragHandle?: boolean
  embedded?: boolean
  headerTone?: "brand" | "plain"
}) {
  const [data, setData] = React.useState(() => initialData)
  // Add useEffect to sync with initialData changes
  React.useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: serverPagination ? (currentPage ?? 1) - 1 : 0,
    pageSize: externalPageSize ?? 10,
  })
  const [globalFilter, setGlobalFilter] = React.useState("")

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  function DraggableRow({ row }: { row: Row<unknown> }) {
    const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
      id: (row.original as Record<string, unknown>).id as string | number,
    })

    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className={`relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 hover:bg-bg-main text-gray-700 ${displayDragHandle ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
      >
        {displayDragHandle && <TableCell className="w-12 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <IconGripVertical className="size-5 text-muted-foreground" />
        </TableCell>}
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} onClick={() => onRowClick?.(row.original)} className={onRowClick ? "cursor-pointer" : ""}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item) => (item as Record<string, unknown>).id as UniqueIdentifier) || [],
    [data]
  )

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: serverPagination
        ? { pageIndex: (currentPage ?? 1) - 1, pageSize: externalPageSize ?? 10 }
        : pagination,
      globalFilter,
    },
    getRowId: (row) => ((row as Record<string, unknown>).id as string | number).toString(),
    enableRowSelection: true,
    enableGlobalFilter: true,
    manualPagination: serverPagination,
    pageCount: serverPagination ? totalPages : undefined,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: serverPagination
      ? (updater) => {
        const newState = typeof updater === 'function'
          ? updater({ pageIndex: (currentPage ?? 1) - 1, pageSize: externalPageSize ?? 10 })
          : updater
        onPageChange?.(newState.pageIndex + 1)
        if (newState.pageSize !== externalPageSize) {
          onPageSizeChange?.(newState.pageSize)
        }
      }
      : setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel:
      disablePagination || serverPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
  })

  const filteredRowCount = table.getFilteredRowModel().rows.length
  const clientPageCount = table.getPageCount()
  const effectivePageCount = serverPagination
    ? Math.max(1, totalPages ?? 1)
    : Math.max(1, clientPageCount)
  const serverPageSize = externalPageSize ?? 10
  const serverHasExtraPages =
    Boolean(serverPagination) &&
    totalItemCount != null &&
    totalItemCount > serverPageSize
  /**
   * Hide pagination when there is only one page (client or server). For server mode,
   * also show when `totalItemCount` exceeds the page size so controls appear even if
   * `totalPages` from the API is missing or wrong.
   */
  const shouldShowPagination =
    !disablePagination &&
    !isLoading &&
    filteredRowCount > 0 &&
    (effectivePageCount > 1 || serverHasExtraPages)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)
      const newData = arrayMove(data, oldIndex, newIndex)
      setData(newData)

      // Call the reorder callback if provided
      onReorder?.(newData, {
        id: active.id as number | string,
        newIndex,
        oldIndex
      })
    }
  }


  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4">

        <div
          className={cn(
            "relative overflow-hidden",
            embedded ? "bg-transparent" : "rounded-lg bg-white"
          )}
        >
          {isUpdating && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <IconLoader className="animate-spin size-8 text-brown-600" />
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-2">
                <IconLoader className="animate-spin size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="sticky top-0 z-10 ">
                  {table.getHeaderGroups().map((headerGroup, index, groups) => (
                    <TableRow
                      key={headerGroup.id}
                      className={cn(
                        "border-b border-gray-100",
                        headerTone === "plain" && "border-gray-200"
                      )}
                    >
                      {displayDragHandle && (
                        <TableHead
                          className={cn(
                            "w-12",
                            headerTone === "plain" ? "bg-white" : "bg-brown-600/10",
                            index === groups.length - 1 && !embedded
                              ? "rounded-bl-lg"
                              : ""
                          )}
                        />
                      )}
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort()
                        const sortDirection = header.column.getIsSorted()
                        const headBg =
                          headerTone === "plain" ? "bg-white" : "bg-brown-600/10"
                        const headHover =
                          headerTone === "plain"
                            ? "hover:bg-gray-50/80"
                            : "hover:bg-brown-600/20"
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className={cn(
                              headBg,
                              index === groups.length - 1 &&
                                !embedded &&
                                "last:rounded-br-lg",
                              canSort &&
                                `cursor-pointer select-none ${headHover}`
                            )}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center gap-2 font-satoshi text-xs font-bold text-black not-italic">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {canSort && (
                                  <span className="flex flex-col">
                                    {sortDirection === "asc" ? (
                                      <IconChevronUp className="h-4 w-4 text-brown-600" />
                                    ) : sortDirection === "desc" ? (
                                      <IconChevronDown className="h-4 w-4 text-brown-600" />
                                    ) : (
                                      <IconArrowsSort className="h-4 w-4 text-gray-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (displayDragHandle ? 1 : 0)}
                        className="h-24 text-center font-satoshi text-xs font-normal text-gray-700"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          )}
        </div>
        {shouldShowPagination && (
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected. */}
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${serverPagination ? externalPageSize : table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    if (serverPagination && onPageSizeChange) {
                      onPageSizeChange(Number(value))
                    } else {
                      table.setPageSize(Number(value))
                    }
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage() || isLoading}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage() || isLoading}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage() || isLoading}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage() || isLoading}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
