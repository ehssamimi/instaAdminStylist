import { LayoutPanelLeft, ShieldEllipsis, LayoutDashboard, Package, Users, Coins, User ,FileText,
   Calendar,
  Scissors,
  Star,
  DollarSign,
  Percent,
  Bell,

} from "lucide-react"

export interface NavMainItem {
  title: string
  pageTitle?: string
  url: string
  icon?: NavIcon
}

// Infer the shared icon component type from one imported icon
export type NavIcon = typeof LayoutPanelLeft

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
    icon: Scissors,
  },
  {
    title: "Featured Stylists",
    pageTitle: "Featured Stylists",
    url: "/dashboard/featured-stylists",
    icon: Star,
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
    icon: DollarSign,
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
    icon: Users,
  },
  {
    title: "Reports",
    pageTitle: "Reports",
    url: "/dashboard/report",
    icon: Bell,
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

// Utility to find a nav item for a given pathname (exact or nested match)
export function matchNavItem(pathname: string): NavMainItem | undefined {
  // Singular /dashboard/stylist/:id is a detail view for the Stylists section
  const resolvedPath = /^\/dashboard\/stylist(?:\/|$)/.test(pathname)
    ? "/dashboard/stylists"
    : pathname
  // Prefer longest match for nested routes
  return navMainAdmin
    .filter(
      (item) =>
        resolvedPath === item.url || resolvedPath.startsWith(item.url + "/")
    )
    .sort((a, b) => b.url.length - a.url.length)[0]
}
