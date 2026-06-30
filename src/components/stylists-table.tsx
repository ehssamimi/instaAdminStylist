"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { useStylists } from "@/hooks/use-stylists";
import { stylistsApi } from "@/lib/api";
import type { StylistRowDto } from "@/models/stylists";
import { EachContainer } from "./each-container";

function stylistAvatarInitials(first: string, last: string): string {
  const f = first.trim().charAt(0).toUpperCase();
  const l = last.trim().charAt(0).toUpperCase();
  if (f && l) return `${f}${l}`;
  if (f) return f;
  if (l) return l;
  return "—";
}

const stylistSchema = z.object({
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
});

export function StylistsTable() {
  const router = useRouter();

  const {
    data,
    loading,
    page,
    perPage,
    totalPages,
    search,
    setPage,
    setPerPage,
    setSearch,
  } = useStylists();

  const [exporting, setExporting] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      setPage(1);
      setSearch(query);
    },
    [setPage, setSearch]
  );

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await stylistsApi.exportList({
        page,
        per_page: perPage,
        search: search || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "stylists.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to export stylists.");
    } finally {
      setExporting(false);
    }
  }, [page, perPage, search]);

  const handleRowClick = useCallback(
    (row: unknown) => {
      const stylist = row as StylistRowDto;
      router.push(`/dashboard/stylist/${stylist.id}`);
    },
    [router]
  );

  const columns: ColumnDef<StylistRowDto>[] = useMemo(
    () => [
      {
        accessorKey: "profile_picture",
        header: "Profile Picture",
        enableSorting: false,
        cell: ({ row }) => {
          const url = row.original.profile_picture?.trim();
          return (
            <div className="relative h-14 w-14 overflow-hidden rounded-md bg-gray-100">
              {url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={url}
                  alt={`${row.original.first_name} ${row.original.last_name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center font-satoshi text-sm font-semibold tracking-tight text-gray-600"
                  aria-label={`No profile photo for ${row.original.first_name} ${row.original.last_name}`}
                >
                  {stylistAvatarInitials(
                    row.original.first_name,
                    row.original.last_name
                  )}
                </span>
              )}
            </div>
          );
        },
      },
      { accessorKey: "last_name", header: "Last Name", enableSorting: false },
      { accessorKey: "first_name", header: "First Name", enableSorting: false },
      {
        accessorKey: "accountStatus",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => {
          const status = row.original.accountStatus;
          if (status === "BANNED") {
            return (
              <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 font-satoshi text-xs font-semibold text-red-700">
                Banned
              </span>
            );
          }
          if (status === "SUSPENDED") {
            return (
              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 font-satoshi text-xs font-semibold text-amber-700">
                Suspended
              </span>
            );
          }
          return (
            <span className="font-satoshi text-sm text-[#535862]">Active</span>
          );
        },
      },
      {
        accessorKey: "speciality",
        header: "Speciality",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="block w-[12rem] max-w-[12rem] whitespace-normal break-normal leading-snug">
            {row.original.speciality}
          </span>
        ),
      },
      { accessorKey: "bookings", header: "Bookings", enableSorting: false },
      {
        accessorKey: "total_revenue",
        header: "Total Sales",
        enableSorting: false,
      },
      {
        accessorKey: "stylist_since",
        header: "Stylists Since",
        enableSorting: false,
      },
      {
        accessorKey: "avg_weekly_availability",
        header: "Avg. Weekly Avail.",
        enableSorting: false,
      },
      {
        accessorKey: "avg_weekly_drop_in",
        header: "Avg. Weekly Drop-in",
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <EachContainer>
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
          disabled={exporting}
          className="h-[var(--height-form-field)] shrink-0 shadow-[var(--shadow-outline-inset)]"
          onClick={() => void handleExport()}
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-6 w-6" />
          )}
          <span>{exporting ? "Exporting…" : "Export"}</span>
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
              setPage(1);
              setPerPage(size);
            }}
          />
        )}
      </div>
    </EachContainer>
  );
}
