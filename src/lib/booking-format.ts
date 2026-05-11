export function formatDurationLabel(duration: string): string {
  return duration.replace(/\bmin\b/i, "Min")
}

/**
 * Formats a UTC date string in the admin's browser timezone using 24-hour format.
 * Output example: "03/10/26 · 22:00"
 */
export function formatBookingDateTime(value: string | undefined | null): string {
  if (!value?.trim()) return "—"
  const s = value.trim()
  const normalized = s.replace(" ", "T")
  const withZ = normalized.endsWith("Z") ? normalized : normalized + "Z"
  const d = new Date(withZ)
  if (isNaN(d.getTime())) return s
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  return `${get("month")}/${get("day")}/${get("year")} · ${get("hour")}:${get("minute")}`
}
