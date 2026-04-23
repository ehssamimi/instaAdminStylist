import React, { useState, useCallback, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { IconLoader, IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

export const SearchInput = React.memo(({
  onSearch,
  placeholder = "Search...",
  disabled = false,
  isLoading = false,
  className = ""
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true)
    try {
      onSearch(query)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }, [onSearch])

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(localValue)
    }, 400)

    return () => {
      clearTimeout(handler)
    }
  }, [localValue, handleSearch])

  return (
    <div className="relative flex-1 bg-surface-soft">
      <IconSearch
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
        aria-hidden
      />
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        disabled={disabled}
        className={cn(
          "min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-10 text-sm text-gray-600 shadow-form-field outline-none transition-[color,box-shadow,border-color]",
          "placeholder:font-[Inter,ui-sans-serif,system-ui,sans-serif] placeholder:text-xs placeholder:font-[450] placeholder:leading-4 placeholder:text-gray-400 placeholder:opacity-100",
          "placeholder:[font-feature-settings:'liga'_off,'clig'_off]",
          "focus:border-brand focus:shadow-form-field focus:ring-2 focus:ring-brand/20 focus-visible:border-brand focus-visible:shadow-form-field focus-visible:ring-2 focus-visible:ring-brand/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
      {(isSearching || isLoading) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <IconLoader className="size-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  )
})

SearchInput.displayName = "SearchInput"
