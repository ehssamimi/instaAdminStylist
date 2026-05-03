import type { ComponentType, SVGProps } from "react"
import { LayoutPanelLeft, ShieldEllipsis, LayoutDashboard, Package, Coins, FileText,
   Calendar,
  Star,
  DollarSign,
  Percent,
  Medal,
  Banknote,
} from "lucide-react"
import { CustomersNavIcon } from "@/components/customers-nav-icon"
import { ReportsNavIcon } from "@/components/reports-nav-icon"
import { StylistsNavIcon } from "@/components/stylists-nav-icon"

export interface NavMainItem {
  title: string
  pageTitle?: string
  url: string
  icon?: NavIcon
}

// Lucide icons or custom SVG components used in the sidebar
export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>

// Central navigation definition so both sidebar & header can stay in sync.
export const navMainAdmin: NavMainItem[] = [
  {
    title: "Dashboard",
    pageTitle: "Dashboard",
    url: "/dashboard",
    icon: LayoutPanelLeft,
  },
  {
    title: "Booking History",
    pageTitle: "Booking History",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Stylists",
    pageTitle: "Stylists",
    url: "/dashboard/stylists",
    icon: StylistsNavIcon,
  },
  {
    title: "Featured Stylists",
    pageTitle: "Featured Stylists",
    url: "/dashboard/featured-stylists",
    icon: Medal,
  },
  {
    title: "Applications",
    pageTitle: "Applications",
    url: "/dashboard/applications",
    icon: FileText,
  },
  {
    title: "User Reviews",
    pageTitle: "User Reviews",
    url: "/dashboard/reviews",
    icon: Star,
  },
  {
    title: "Revenue",
    pageTitle: "Revenue",
    url: "/dashboard/revenue",
    icon: Banknote,
  },
  {
    title: "Fees",
    pageTitle: "Fees",
    url: "/dashboard/fees",
    icon: Percent,
  },
  {
    title: "Customers",
    pageTitle: "Customers",
    url: "/dashboard/customers",
    icon: CustomersNavIcon,
  },
  {
    title: "Reports",
    pageTitle: "Reports",
    url: "/dashboard/report",
    icon: ReportsNavIcon,
  },
  // {
  //   title: "Claims",
  //   pageTitle: "Claims Management",
  //   url: "/dashboard/claims",
  //   icon: ShieldEllipsis,
  // },
  // {
  //   title: "Categories",
  //   pageTitle: "Categories",
  //   url: "/dashboard/categories",
  //   icon: LayoutDashboard,
  // },
  // {
  //   title: "Products",
  //   pageTitle: "Products",
  //   url: "/dashboard/products",
  //   icon: Package,
  // },
  // {
  //   title: "Warranty Pricing",
  //   pageTitle: "Warranty Pricing",
  //   url: "/dashboard/warranty-pricing",
  //   icon: Coins,
  // },
]

type NavSearchParams = Pick<URLSearchParams, "get"> | null | undefined

// Utility to find a nav item for a given pathname (exact or nested match)
export function matchNavItem(
  pathname: string,
  searchParams?: NavSearchParams
): NavMainItem | undefined {
  let resolvedPath = pathname

  /** Booking detail reached from customer or stylist profile — highlight that section, not Booking History. */
  if (/^\/dashboard\/bookings\/[^/]+$/.test(pathname) && searchParams) {
    if (
      searchParams.get("from") === "customer" &&
      searchParams.get("customerId")
    ) {
      resolvedPath = "/dashboard/customers"
    } else if (
      searchParams.get("from") === "stylist" &&
      searchParams.get("stylistId")
    ) {
      resolvedPath = "/dashboard/stylists"
    }
  }

  // Singular /dashboard/stylist/:id is a detail view for the Stylists section
  if (/^\/dashboard\/stylist(?:\/|$)/.test(resolvedPath)) {
    resolvedPath = "/dashboard/stylists"
  } else if (/^\/dashboard\/customers\/[^/]+/.test(resolvedPath)) {
    resolvedPath = "/dashboard/customers"
  }

  // Prefer longest match for nested routes
  return navMainAdmin
    .filter(
      (item) =>
        resolvedPath === item.url ||
        resolvedPath.startsWith(item.url + "/")
    )
    .sort((a, b) => b.url.length - a.url.length)[0]
}
