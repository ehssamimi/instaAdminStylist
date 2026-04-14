"use client"
import { usePathname } from "next/navigation"
import { matchNavItem } from "@/config/navigation"
function fallbackTitle(pathname: string): string {
  const overrides: Record<string, string> = {
    "": "Home",
    "forgot-password": "Forgot Password",
    login: "Login",
  }
  const segments = pathname.split("/").filter(Boolean)
  const last = segments[segments.length - 1] ?? ""
  if (overrides[last]) return overrides[last]
  if (!last) return overrides[""]
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function usePageTitle(customOverrides?: Record<string, string>) {
  const pathname = usePathname()
  const navItem = matchNavItem(pathname)
  
  // Merge custom overrides with default ones if provided
  const title = navItem?.pageTitle || navItem?.title || fallbackTitle(pathname)
  
  return { title, pathname, navItem }
}