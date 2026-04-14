"use client"

import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFees } from "@/hooks/use-fees"
import { feesApi } from "@/lib/api"
import {
  feeRowToPutItem,
  formatMonthlyCallsLabel,
  type AdminFeeDto,
} from "@/models/fees"
import { cn } from "@/lib/utils"

function parseOptionalNumber(raw: string): number {
  if (raw.trim() === "") return 0
  const n = Number(raw)
  return Number.isFinite(n) ? n : 0
}

const feeInputShell =
  "flex min-h-9 items-center gap-1 rounded-[var(--radius-form-field)] border-[0.66px] border-[#B5B5B5] bg-gray-25 py-2 px-4 text-sm shadow-none outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"

const feeInputInner =
  "min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none focus-visible:ring-0 disabled:cursor-not-allowed"

function PercentField({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (n: number) => void
  disabled?: boolean
}) {
  return (
    <div
      className={cn(
        feeInputShell,
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <input
        type="number"
        min={0}
        step="0.01"
        disabled={disabled}
        className={feeInputInner}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseOptionalNumber(e.target.value))}
      />
      <span className="shrink-0 text-sm text-muted-foreground">%</span>
    </div>
  )
}

function CurrencyField({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (n: number) => void
  disabled?: boolean
}) {
  return (
    <div
      className={cn(
        feeInputShell,
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <span className="shrink-0 text-sm text-muted-foreground">$</span>
      <input
        type="number"
        min={0}
        step="0.01"
        disabled={disabled}
        className={feeInputInner}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseOptionalNumber(e.target.value))}
      />
    </div>
  )
}

const FEES_SKELETON_ROWS = 3

const FEES_COLUMN_HEADERS = [
  "Monthly Total Calls",
  "Stylist Fee %",
  "User Fee %",
  "Stylist Fee Minimum",
] as const

const feesTableClass =
  "w-full min-w-[640px] border-collapse border border-gray-100 text-left text-sm"

const feesThClass =
  "border-b border-gray-100 px-6 py-4 text-xs font-bold text-black"

const feesTdClass = "border-b border-gray-100 px-6 py-4 align-middle"

const feesTdLabelClass = `${feesTdClass} text-sm text-gray-700`

const skeletonFieldClass =
  "h-9 w-full max-w-[180px] rounded-[var(--radius-form-field)]"

function FeesTableBodySkeleton({ rowCount }: { rowCount: number }) {
  return (
    <>
      {Array.from({ length: rowCount }, (_, i) => (
        <tr key={i} className="last:[&>td]:border-b-0">
          <td className={feesTdClass}>
            <Skeleton className="h-4 w-24 rounded-[var(--radius-form-field)]" />
          </td>
          {[0, 1, 2].map((j) => (
            <td key={j} className={feesTdClass}>
              <Skeleton className={skeletonFieldClass} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function FeesTableSection({
  loading,
  rows,
  saving,
  updateRow,
}: {
  loading: boolean
  rows: AdminFeeDto[]
  saving: boolean
  updateRow: (id: string, patch: Partial<AdminFeeDto>) => void
}) {
  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className={feesTableClass}>
            <thead>
              <tr className="bg-card">
                {FEES_COLUMN_HEADERS.map((title) => (
                  <th key={title} className={feesThClass}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <FeesTableBodySkeleton rowCount={FEES_SKELETON_ROWS} />
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="last:[&>td]:border-b-0">
                    <td className={feesTdLabelClass}>
                      {formatMonthlyCallsLabel(
                        row.minMonthlyCalls,
                        row.maxMonthlyCalls
                      )}
                    </td>
                    <td className={feesTdClass}>
                      <PercentField
                        value={row.stylistFeePercent}
                        disabled={saving}
                        onChange={(n) =>
                          updateRow(row.id, { stylistFeePercent: n })
                        }
                      />
                    </td>
                    <td className={feesTdClass}>
                      <PercentField
                        value={row.userFeePercent}
                        disabled={saving}
                        onChange={(n) =>
                          updateRow(row.id, { userFeePercent: n })
                        }
                      />
                    </td>
                    <td className={feesTdClass}>
                      <CurrencyField
                        value={row.stylistFeeMinimumAmount}
                        disabled={saving}
                        onChange={(n) =>
                          updateRow(row.id, { stylistFeeMinimumAmount: n })
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeesSettingsForm() {
  const { rows, loading, saving, error, reload, updateRow, setSaving } =
    useFees()

  const handleSave = async () => {
    if (rows.length === 0) return
    setSaving(true)
    try {
      const body = rows.map((r) => feeRowToPutItem(r))
      await feesApi.putAll(body)
      toast.success("Fees saved successfully")
      await reload()
    } catch (e) {
      let message = "Failed to save fees"
      if (typeof e === "object" && e !== null) {
        const maybeAxios = e as { response?: { data?: { message?: string } } }
        message = maybeAxios.response?.data?.message || message
      }
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error.message}
      </div>
    )
  }

  return (
    <>
      <div
        aria-busy={loading}
        aria-label={loading ? "Loading fees" : undefined}
      >
        <FeesTableSection
          loading={loading}
          rows={rows}
          saving={saving}
          updateRow={updateRow}
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <Skeleton className="h-9 min-w-[120px] max-w-[120px] rounded-lg" />
        ) : (
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || rows.length === 0}
            className="min-w-[120px] rounded-lg px-6"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        )}
      </div>
    </>
  )
}
