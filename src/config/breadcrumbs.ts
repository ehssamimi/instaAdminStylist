export interface HeaderBreadcrumbItem {
  label: string
  /** Omit on the last (current) segment */
  href?: string
}

/**
 * Breadcrumb trail for the admin site header, keyed off the pathname (and optional query when needed).
 * Return null when the header should not show a breadcrumb.
 */
export function getHeaderBreadcrumbs(
  pathname: string,
  searchParams?: Pick<URLSearchParams, "get"> | null
): HeaderBreadcrumbItem[] | null {
  if (/^\/dashboard\/my-coverage\/\d+$/.test(pathname)) {
    return [
      { label: "Dashboard", href: "/dashboard/my-coverage" },
      { label: "Details" },
    ]
  }

  const applicationsDetail = pathname.match(/^\/dashboard\/applications\/([^/]+)$/)
  if (applicationsDetail?.[1]) {
    return [
      { label: "Applications", href: "/dashboard/applications" },
      { label: "Stylist Profile" },
    ]
  }

  const bookingDetail = pathname.match(/^\/dashboard\/bookings\/([^/]+)$/)
  if (bookingDetail?.[1]) {
    const from = searchParams?.get("from")
    const stylistId = searchParams?.get("stylistId")
    if (from === "stylist" && stylistId) {
      return [
        { label: "Stylists", href: "/dashboard/stylists" },
        { label: "Stylist Profile", href: `/dashboard/stylist/${stylistId}` },
        { label: "Booking Details" },
      ]
    }
    return [
      { label: "Booking History", href: "/dashboard/bookings" },
      { label: "Booking Details" },
    ]
  }

  const reportDetail = pathname.match(/^\/dashboard\/report\/([^/]+)$/)
  if (reportDetail?.[1]) {
    return [
      { label: "Report", href: "/dashboard/report" },
      { label: "Report Details" },
    ]
  }

  const stylistDetail = pathname.match(/^\/dashboard\/stylist\/([^/]+)$/)
  if (stylistDetail?.[1]) {
    return [
      { label: "Stylists", href: "/dashboard/stylists" },
      { label: "Stylist Profile" },
    ]
  }

  return null
}
