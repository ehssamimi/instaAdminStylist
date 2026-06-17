"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFees } from "@/hooks/use-fees";
import { feesApi } from "@/lib/api";
import {
  feeRowToPutItem,
  formatMonthlyCallsLabel,
  type AdminFeeDto,
} from "@/models/fees";
import { cn } from "@/lib/utils";
import { EachContainer } from "./each-container";

// ─── Parsing ──────────────────────────────────────────────────────────────────

function parseOptionalNumber(raw: string): number {
  if (raw.trim() === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

// ─── Local draft hook ─────────────────────────────────────────────────────────
// Keeps a raw string in the input so clearing the field shows "" instead of "0",
// preventing the "022" leading-zero issue with controlled number inputs.

function useFieldDraft(externalValue: number) {
  const [draft, setDraft] = useState(() =>
    String(Number.isFinite(externalValue) ? externalValue : 0)
  )
  const isFocusedRef = useRef(false)

  useEffect(() => {
    // Only sync from parent when the field is not focused (e.g., after reload)
    if (!isFocusedRef.current) {
      setDraft(String(Number.isFinite(externalValue) ? externalValue : 0))
    }
  }, [externalValue])

  return { draft, setDraft, isFocusedRef }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidPercent(v: number): boolean {
  return Number.isFinite(v) && v >= 0 && v <= 100;
}

function isValidCurrency(v: number): boolean {
  return Number.isFinite(v) && v >= 0;
}

type RowErrors = {
  stylistFeePercent: boolean;
  userFeePercent: boolean;
  stylistFeeMinimumAmount: boolean;
};

function getRowErrors(row: AdminFeeDto): RowErrors {
  return {
    stylistFeePercent: !isValidPercent(row.stylistFeePercent),
    userFeePercent: !isValidPercent(row.userFeePercent),
    stylistFeeMinimumAmount: !isValidCurrency(row.stylistFeeMinimumAmount),
  };
}

function hasAnyErrors(rows: AdminFeeDto[]): boolean {
  return rows.some((row) => {
    const e = getRowErrors(row);
    return e.stylistFeePercent || e.userFeePercent || e.stylistFeeMinimumAmount;
  });
}

// ─── Dirty detection ──────────────────────────────────────────────────────────

function isDirtyRows(current: AdminFeeDto[], original: AdminFeeDto[]): boolean {
  if (current.length !== original.length) return true;
  const origMap = new Map(original.map((r) => [r.id, r]));
  return current.some((row) => {
    const orig = origMap.get(row.id);
    if (!orig) return true;
    return (
      row.stylistFeePercent !== orig.stylistFeePercent ||
      row.userFeePercent !== orig.userFeePercent ||
      row.stylistFeeMinimumAmount !== orig.stylistFeeMinimumAmount
    );
  });
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const feeInputShell =
  "flex min-h-9 items-center gap-1 rounded-[var(--radius-form-field)] border-[0.66px] border-[#B5B5B5] bg-gray-25 py-2 px-4 text-sm shadow-none outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50";

const feeInputShellError =
  "border-destructive focus-within:border-destructive focus-within:ring-destructive/30";

const feeInputInner =
  "min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none focus-visible:ring-0 disabled:cursor-not-allowed";

// ─── Field components ─────────────────────────────────────────────────────────

function PercentField({
  value,
  onChange,
  disabled,
  hasError,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const { draft, setDraft, isFocusedRef } = useFieldDraft(value)

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          feeInputShell,
          disabled && "pointer-events-none opacity-60",
          hasError && feeInputShellError
        )}
      >
        <input
          type="number"
          min={0}
          max={100}
          step="0.01"
          disabled={disabled}
          className={feeInputInner}
          value={draft}
          onFocus={() => { isFocusedRef.current = true }}
          onBlur={() => {
            isFocusedRef.current = false
            const n = parseOptionalNumber(draft)
            setDraft(String(n))
            onChange(n)
          }}
          onChange={(e) => {
            setDraft(e.target.value)
            onChange(parseOptionalNumber(e.target.value))
          }}
        />
        <span className="shrink-0 text-sm text-muted-foreground">%</span>
      </div>
      {hasError && (
        <p className="text-xs text-destructive">Must be 0 – 100</p>
      )}
    </div>
  );
}

function CurrencyField({
  value,
  onChange,
  disabled,
  hasError,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const { draft, setDraft, isFocusedRef } = useFieldDraft(value)

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          feeInputShell,
          disabled && "pointer-events-none opacity-60",
          hasError && feeInputShellError
        )}
      >
        <span className="shrink-0 text-sm text-muted-foreground">$</span>
        <input
          type="number"
          min={0}
          step="0.01"
          disabled={disabled}
          className={feeInputInner}
          value={draft}
          onFocus={() => { isFocusedRef.current = true }}
          onBlur={() => {
            isFocusedRef.current = false
            const n = parseOptionalNumber(draft)
            setDraft(String(n))
            onChange(n)
          }}
          onChange={(e) => {
            setDraft(e.target.value)
            onChange(parseOptionalNumber(e.target.value))
          }}
        />
      </div>
      {hasError && (
        <p className="text-xs text-destructive">Must be ≥ 0</p>
      )}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

const FEES_SKELETON_ROWS = 3;

const FEES_COLUMN_HEADERS = [
  "Monthly Total Calls",
  "Stylist Fee %",
  "User Fee %",
  "Stylist Fee Minimum",
] as const;

const feesTableClass =
  "w-full min-w-[640px] border-collapse text-left text-sm";

const feesThClass =
  "border-b border-gray-100 px-6 py-4 text-xs font-bold text-black";

const feesTdClass = "border-b border-gray-100 px-6 py-4 align-top";

const feesTdLabelClass = `${feesTdClass} pt-[18px] text-sm text-gray-700`;

const skeletonFieldClass =
  "h-9 w-full max-w-[180px] rounded-[var(--radius-form-field)]";

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
  );
}

function FeesTableSection({
  loading,
  rows,
  saving,
  updateRow,
}: {
  loading: boolean;
  rows: AdminFeeDto[];
  saving: boolean;
  updateRow: (id: string, patch: Partial<AdminFeeDto>) => void;
}) {
  return (
    <EachContainer>
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
              rows.map((row) => {
                const rowErrors = getRowErrors(row);
                return (
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
                        hasError={rowErrors.stylistFeePercent}
                        onChange={(n) =>
                          updateRow(row.id, { stylistFeePercent: n })
                        }
                      />
                    </td>
                    <td className={feesTdClass}>
                      <PercentField
                        value={row.userFeePercent}
                        disabled={saving}
                        hasError={rowErrors.userFeePercent}
                        onChange={(n) =>
                          updateRow(row.id, { userFeePercent: n })
                        }
                      />
                    </td>
                    <td className={feesTdClass}>
                      <CurrencyField
                        value={row.stylistFeeMinimumAmount}
                        disabled={saving}
                        hasError={rowErrors.stylistFeeMinimumAmount}
                        onChange={(n) =>
                          updateRow(row.id, { stylistFeeMinimumAmount: n })
                        }
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </EachContainer>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function FeesSettingsForm() {
  const { rows, originalRows, loading, saving, error, reload, updateRow, setSaving } =
    useFees();

  const isDirty = !loading && isDirtyRows(rows, originalRows);
  const hasErrors = hasAnyErrors(rows);
  const canSave = isDirty && !hasErrors && !saving && rows.length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const body = rows.map((r) => feeRowToPutItem(r));
      await feesApi.putAll(body);
      toast.success("Fees saved successfully");
      await reload();
    } catch (e) {
      let message = "Failed to save fees";
      if (typeof e === "object" && e !== null) {
        const maybeAxios = e as { response?: { data?: { message?: string } } };
        message = maybeAxios.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error.message}
      </div>
    );
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
            disabled={!canSave}
            className="min-w-[80px] rounded-lg px-6"
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
  );
}
