"use client"

import React, { useCallback, useState } from 'react'
import { DataTable } from "@/components/data-table"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { ClaimStatusBadge } from "@/components/claim-status-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

import {
  IconDownload,
} from "@tabler/icons-react"
import { useAllClaims } from '@/hooks/use-claims'
import { claimsApi } from '@/lib/api'
import { usePageTitle } from '@/hooks/use-page-title'
import { SearchInput } from '@/components/search-input'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'

const schema = z.object({
  id: z.number().optional(),
  claim_number: z.string(),
  date: z.string(),
  category: z.string(),
  device_name: z.string(),
  product_cost: z.number(),
  deductible: z.number(),
  claim_cost: z.number(),
  status: z.string(),

})
const ClaimsPage = () => {
  const { title } = usePageTitle();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchKey, setSearchKey] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { data: claimsData, isLoading } = useAllClaims(searchQuery, page, perPage);
  const pagination = claimsData?.data;
  // Memoize the search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query)
    setSearchQuery(query)
    setPage(1)
    setPerPage(10)
  }, [])
  // Define columns specific to claims page
  const columns: ColumnDef<z.infer<typeof schema>>[] = React.useMemo(() => [
    {
      accessorKey: "claim_number",
      header: "Claim Number",
      cell: ({ row }) => {
        return <div >
          {row.original.claim_number}
        </div>
      },
      enableSorting: false,
    },
    {
      accessorKey: "incident_date",
      header: "Date",
      cell: ({ row }) => (
        <div className="w-32">
          {row.original.date && typeof row.original.date === 'string'
            ? formatDate(new Date(row.original.date), 'MM/dd/yyyy')
            : '-'}
        </div>
      ),
      enableSorting: false,

    },
    {
      accessorKey: "device_name",
      header: "Device Name",
      cell: ({ row }) => (
        <form >
          <Label htmlFor={`${row.original.id}-target`} className="sr-only">
            Device Name
          </Label>
          {row.original.device_name}
        </form>
      ),
      enableSorting: false,

    },
    {
      accessorKey: "category_id",
      header: "Category",
      cell: ({ row }) => (
        <div>
          {row.original.category}
        </div>
      ),
      enableSorting: false,

    },
    {
      accessorKey: "product_cost",
      header: () => "Product Cost",
      cell: ({ row }) => (
        <form>
          <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
            Product Cost
          </Label>
          {formatCurrency(row.original.product_cost)}
        </form>
      ),
      enableSorting: false,

    },
    {
      accessorKey: "deductible",
      header: () => "Deductible",
      cell: ({ row }) => (
        <>
          <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
            Deductible
          </Label>
          {formatCurrency(row.original.deductible)}
        </>
      ),
      enableSorting: false,

    },
    {
      accessorKey: "claim_cost",
      header: () => "Claim Cost",
      cell: ({ row }) => (
        <>
          <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
            Claim Cost
          </Label>
          {formatCurrency(row.original.claim_cost)}
        </>
      ),
      enableSorting: false,

    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ClaimStatusBadge status={row.original.status} />,
      enableSorting: false,

    }
  ], [])

  const statusComponents: { [key: string]: React.ReactNode } = {
    "In Review": <div className="text-brand bg-surface-muted text-center px-3 py-1 rounded-full">In Review</div>,
    "Approved": <div className="text-brand bg-surface-muted text-center px-3 py-1 rounded-full">Approved</div>,
    "Denied": <div className="text-brand bg-surface-muted text-center px-3 py-1 rounded-full">Denied</div>,
    "Done": <div className="text-brand bg-surface-muted text-center px-3 py-1 rounded-full text-[11px]">Done</div>,
  };

  // Handle row click to navigate to detail page
  const handleRowClick = useCallback((row: unknown) => {
    const familyRow = row as z.infer<typeof schema>
    setIsNavigating(true)
    router.push(`/dashboard/claims/${familyRow.id}`)
  }, [router])

  const [isExporting, setIsExporting] = useState(false);

  const exportUsers = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const res = await claimsApi.getClaims(searchQuery, 1, 10000);
      const dataToExport = res?.data?.data || [];

      if (dataToExport.length === 0) {
        console.log("No data to export");
        return;
      }

      const headers = ["Claim Number", "Date", "Device Name", "Category", "Product Cost", "Deductible", "Claim Cost", "Status"];

      const csvContent = [
        headers.join(","),
        ...dataToExport.map((row: unknown) => {
          const claim = row as z.infer<typeof schema>
          return [
            `"${claim.claim_number || ''}"`,
            `"${claim.date ? formatDate(new Date(claim.date), 'MM/dd/yyyy') : ''}"`,
            `"${claim.device_name || ''}"`,
            `"${claim.category || ''}"`,
            `"${claim.product_cost ?? ''}"`,
            `"${claim.deductible ?? ''}"`,
            `"${claim.claim_cost ?? ''}"`,
            `"${claim.status || ''}"`,
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `claims_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Exported ${dataToExport.length} claims to CSV`);
    } catch (err) {
      console.error("Failed to export claims:", err);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="relative">
      {isNavigating && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading claim details...</span>
          </div>
        </div>
      )}
      <h1 className="admin-page-title">{title}</h1>
      <div className='bg-surface p-4 rounded-xl border-2 border-border-soft'>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 w-full">
            <SearchInput
              key={searchKey}
              onSearch={handleSearch}
              placeholder="Search ..."
              disabled={isLoading}
              isLoading={false}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleSearch("")
                setSearchKey(prev => prev + 1)
              }}
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportUsers}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <IconDownload />}
              <span className="hidden lg:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
            </Button>
          </div>
        </div>
        <DataTable
          data={claimsData?.data?.data || []}
          schema={schema}
          columns={columns as ColumnDef<unknown>[]}
          onRowClick={handleRowClick}
          serverPagination
          totalPages={pagination?.last_page ?? 1}
          currentPage={pagination?.current_page ?? page}
          pageSize={perPage}
          onPageChange={setPage}
          onPageSizeChange={setPerPage}
        />
      </div>

    </div>
  )
}

export default ClaimsPage
