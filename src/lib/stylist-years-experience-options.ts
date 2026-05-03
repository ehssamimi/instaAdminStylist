const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Canonical labels for the stylist “Years of experience” control (API + admin UI). */
export const STYLIST_YEARS_EXPERIENCE_OPTIONS = [
  "Less than a Year",
  "1-3 Years",
  "4-6 Years",
  "7-10 Years",
  "10+ Years",
] as const

const OPTION_SET = new Set<string>(STYLIST_YEARS_EXPERIENCE_OPTIONS)

/**
 * Map API / free-text `experience` onto a dropdown value, or `""` when unknown.
 */
export function experienceToYearsSelectValue(
  raw: string | null | undefined
): string {
  const t = raw?.trim() ?? ""
  if (!t || t === "—" || UUID_RE.test(t)) return ""
  if (OPTION_SET.has(t)) return t
  const lower = t.toLowerCase()
  for (const o of STYLIST_YEARS_EXPERIENCE_OPTIONS) {
    if (o.toLowerCase() === lower) return o
  }
  return ""
}
