"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ChevronDown, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getMockStylistApplicationsPage } from "@/lib/mock-stylist-applications"
import { getApiErrorMessage, stylistApplicationsApi, stylistsApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { StylistApplicationListItem } from "@/models/stylistApplication"
import { HeaderActionButton } from "./header-action-button"

const APPROVED_PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300

function displayNameForApplication(item: StylistApplicationListItem): string {
  const parts = [item.firstName, item.lastName]
    .map((s) => s?.trim())
    .filter((s) => s && s.length > 0) as string[]
  return parts.join(" ").trim() || "—"
}

function flattenApprovedPages(
  pages: { data: StylistApplicationListItem[] }[] | undefined,
  featured: Set<string>
): StylistApplicationListItem[] {
  if (!pages?.length) return []
  const byId = new Map<string, StylistApplicationListItem>()
  for (const p of pages) {
    for (const row of p.data) {
      if (featured.has(row.userId)) continue
      if (!byId.has(row.userId)) byId.set(row.userId, row)
    }
  }
  return [...byId.values()]
}

export type AddFeaturedStylistModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Stylists already shown in the featured list — excluded from the dropdown. */
  featuredIds: readonly string[]
  /** Called after the stylist is added on the server (list refetch, etc.). */
  onConfirm: () => void | Promise<void>
}

export function AddFeaturedStylistModal({
  open,
  onOpenChange,
  featuredIds,
  onConfirm,
}: AddFeaturedStylistModalProps) {
  const formId = useId()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selected, setSelected] = useState<StylistApplicationListItem | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)

  const featured = useMemo(
    () => new Set(featuredIds),
    [featuredIds]
  )

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS
    )
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    if (!open) {
      setSearchInput("")
      setDebouncedSearch("")
      setSelected(null)
      setSuggestionsOpen(false)
      setSubmitting(false)
    }
  }, [open])

  useEffect(() => {
    if (!suggestionsOpen) return
    const onDocDown = (e: MouseEvent) => {
      const el = comboboxRef.current
      if (el && !el.contains(e.target as Node)) {
        setSuggestionsOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocDown)
    return () => document.removeEventListener("mousedown", onDocDown)
  }, [suggestionsOpen])

  const approvedQuery = useInfiniteQuery({
    queryKey: [
      "add-featured",
      "approved-stylists",
      debouncedSearch,
    ] as const,
    enabled: open && suggestionsOpen,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = {
        status: "approved" as const,
        page: pageParam,
        pageSize: APPROVED_PAGE_SIZE,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }
      try {
        return await stylistApplicationsApi.getPendingList(params)
      } catch {
        return getMockStylistApplicationsPage(params)
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1
      }
      return undefined
    },
  })

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = approvedQuery
  const showInputSpinner =
    suggestionsOpen && (isPending || (isFetching && !isFetchingNextPage))

  const listRows = useMemo(
    () => flattenApprovedPages(data?.pages, featured),
    [data?.pages, featured]
  )

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    void fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const onListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const rest = el.scrollHeight - el.scrollTop - el.clientHeight
      if (rest < 64) {
        loadMore()
      }
    },
    [loadMore]
  )

  const canSubmit = Boolean(selected) && !submitting

  const listEmpty =
    suggestionsOpen &&
    !isPending &&
    !isFetching &&
    listRows.length === 0 &&
    !isError

  const handleSelect = (item: StylistApplicationListItem) => {
    const name = displayNameForApplication(item)
    setSearchInput(name)
    setDebouncedSearch(name.trim())
    setSelected(item)
    setSuggestionsOpen(false)
  }

  const handleConfirm = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await stylistsApi.addFeatured({ stylistId: selected.userId })
      toast.success("Stylist added to the featured list.")
      await Promise.resolve(onConfirm())
      setSelected(null)
      onOpenChange(false)
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "w-full max-w-[calc(100%-2rem)] gap-0 overflow-visible rounded-xl border-0 p-0 shadow-lg sm:max-w-md",
          "bg-white"
        )}
      >
        <DialogDescription className="sr-only">
          Search approved stylists to add to the featured list.
        </DialogDescription>
        <div className=" bg-gray-50  rounded-t-xl flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <DialogTitle className=" font-satoshi text-left text-lg font-bold leading-none text-black-100">
            Add Stylist
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-gray-500 outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </DialogClose>
        </div>

        <div className="px-6 py-5">
          <label
            htmlFor={formId}
            className="mb-2 block font-satoshi text-sm font-bold text-gray-700"
          >
            Select Stylist
          </label>
          <div ref={comboboxRef} className="relative">
          {suggestionsOpen && isError ? (
            <p className="mb-2 font-satoshi text-sm text-error-600" role="alert">
              {error instanceof Error
                ? error.message
                : "Could not load approved stylists. "}
              <button
                type="button"
                className="ml-1 underline underline-offset-2"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </p>
          ) : null}
            <div
              className="relative"
              onClick={() => setSuggestionsOpen(true)}
            >
              <Input
                ref={inputRef}
                id={formId}
                value={searchInput}
                onChange={(e) => {
                  setSuggestionsOpen(true)
                  setSearchInput(e.target.value)
                  setSelected(null)
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault()
                    setSuggestionsOpen(false)
                  }
                }}
                autoComplete="off"
                autoCorrect="off"
                placeholder="Select Stylist"
                role="combobox"
                aria-expanded={suggestionsOpen}
                aria-controls={suggestionsOpen ? listId : undefined}
                aria-autocomplete="list"
                className={cn(
                  "h-[var(--height-form-field)] w-full rounded-lg border-gray-200 bg-white pr-9 font-satoshi placeholder:text-gray-400",
                  suggestionsOpen ? "cursor-text" : "cursor-pointer"
                )}
              />
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden
              >
                {showInputSpinner ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ChevronDown
                    className={cn("size-4 transition-transform", suggestionsOpen && "rotate-180")}
                  />
                )}
              </span>
            </div>

          {suggestionsOpen ? (
          <div
            id={listId}
            onScroll={onListScroll}
            className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm"
            role="listbox"
            aria-label="Approved stylists"
          >
            {isPending && !data ? (
              <div className="flex items-center justify-center gap-2 py-8 font-satoshi text-sm text-gray-500">
                <Loader2 className="size-4 shrink-0 animate-spin" />
                Loading…
              </div>
            ) : null}

            {listEmpty ? (
              <p className="px-3 py-6 text-center font-satoshi text-sm text-gray-500">
                {featured.size > 0
                  ? "No more approved stylists to add, or none match your search."
                  : "No approved stylists found."}
              </p>
            ) : null}

            {listRows.map((item) => {
              const id = item.userId
              const name = displayNameForApplication(item)
              const isActive = selected?.userId === id
              return (
                <button
                  key={id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full border-b border-gray-100 px-3 py-2.5 text-left font-satoshi text-sm last:border-b-0",
                    "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    isActive && "bg-gray-100"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                >
                  <span className="text-black-100">{name}</span>
                </button>
              )
            })}

            {isFetchingNextPage ? (
              <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-2 font-satoshi text-xs text-gray-500">
                <Loader2 className="size-3.5 animate-spin" />
                Loading more…
              </div>
            ) : null}
            {hasNextPage && !isFetchingNextPage && listRows.length > 0 ? (
              <div className="flex justify-center border-t border-gray-100 py-1 text-gray-400">
                <ChevronDown className="size-4" aria-hidden />
              </div>
            ) : null}
          </div>
          ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-gray-100 px-6 py-4 sm:grid-cols-2">
          <DialogClose asChild>
            <HeaderActionButton
              type="button"
              variant="neutral"
             >
              Cancel
            </HeaderActionButton>
          </DialogClose>
          <HeaderActionButton
            type="button"
            variant="primary"
            className="h-11 w-full min-w-0"
            onClick={() => void handleConfirm()}
            disabled={!canSubmit}
          >
            {submitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Adding…
              </span>
            ) : (
              "Add Stylist"
            )}
          </HeaderActionButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
