import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, format: string = "MM/dd/yyyy"): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // Handle invalid dates
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.error("Invalid date provided:", date)
    return "Invalid Date"
  }

  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return ""
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return ""
  return num.toLocaleString("en-US")
}

export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = "USD"
): string {
  if (value === null || value === undefined || value === "") return ""
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return ""
  return num.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  })
}

export type StatusBadgeResult = {
  label: string
  className: string
  icon: string // SVG path d attribute
  viewBox?: string
}

export function getStatusBadgeStyles(status?: string): StatusBadgeResult {
  const normalized = status?.toLowerCase()
  const shieldIcon = `/active.png`
  const cancelledIcon = `/canceled.png`
  const soonIcon = `/soon.png`

  switch (normalized) {
    case "cancelled":
    case "canceled":
      return {
        label: "Cancelled",
        className: "bg-squishy-100 text-danger-600",
        icon: cancelledIcon,
      }
    case "covered":
      return {
        label: "Covered",
        className: "bg-success/10 text-success-600",
        icon: shieldIcon,
      }
    case "expired":
      return {
        label: "Expired",
        className: "bg-squishy-100 text-danger-600",
        icon: cancelledIcon,
      }
    case "expiring_soon":
      return {
        label: "Expiring Soon",
        className: "bg-[#FFC670]/10 text-[#FFC670]",
        icon: soonIcon,
      }
    default:
      return {
        label: status
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : "Unknown",
        className: "bg-gray-100 text-gray-600",
        icon: "",
        viewBox: "0 0 24 24",
      }
  }
}
