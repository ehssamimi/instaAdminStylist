import React, { useState, useCallback, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { IconLoader, IconSearch } from "@tabler/icons-react"

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
      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        className={`pl-10  ${className} border-[0.66px] border-gray-200 rounded-lg bg-gray-25`}
      />
      {(isSearching || isLoading) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <IconLoader className="animate-spin size-4" />
        </div>
      )}
    </div>
  )
})

SearchInput.displayName = "SearchInput"
