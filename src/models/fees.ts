/** Row from `GET /api/admin/fees` (same-origin; proxied to backend) */
export interface AdminFeeDto {
  id: string
  minMonthlyCalls: number
  maxMonthlyCalls: number | null
  stylistFeePercent: number
  userFeePercent: number
  stylistFeeMinimumAmount: number
  currency: string
  version?: number
}

/** Item shape for `PUT /api/admin/fees` (bulk replace) */
export interface AdminFeePutItem {
  id: string
  minMonthlyCalls: number
  maxMonthlyCalls: number | null
  stylistFeePercent: number
  userFeePercent: number
  stylistFeeMinimumAmount: number
  currency: string
}

export function formatMonthlyCallsLabel(
  minMonthlyCalls: number,
  maxMonthlyCalls: number | null
): string {
  if (maxMonthlyCalls == null) {
    return `${minMonthlyCalls}+`
  }
  return `${minMonthlyCalls}–${maxMonthlyCalls}`
}

export function feeRowToPutItem(row: AdminFeeDto): AdminFeePutItem {
  return {
    id: row.id,
    minMonthlyCalls: row.minMonthlyCalls,
    maxMonthlyCalls: row.maxMonthlyCalls,
    stylistFeePercent: row.stylistFeePercent,
    userFeePercent: row.userFeePercent,
    stylistFeeMinimumAmount: row.stylistFeeMinimumAmount,
    currency: row.currency,
  }
}
