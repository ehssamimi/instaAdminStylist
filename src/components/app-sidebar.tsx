"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useRouter } from "next/navigation"
import { removeToken } from "@/lib/jwt-utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { matchNavItem, navMainAdmin } from "@/config/navigation"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react"


export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter()
  const [navItems, setNavItems] = React.useState<typeof navMainAdmin>([])
  const queryClient = useQueryClient();
  React.useEffect(() => {
    setNavItems(navMainAdmin)
  }, [])

  console.log("User from token in AppSidebar:", user)

  const normalize = (url: string) => {
    if (!url) return "/"
    if (url === "/") return "/"
    const withLeading = url.startsWith("/") ? url : `/${url}`
    return withLeading !== "/" ? withLeading.replace(/\/+$/, "") : withLeading
  }

  const matchedNav = matchNavItem(pathname)
  const activeHref = matchedNav ? normalize(matchedNav.url) : undefined

  return (
    <Sidebar collapsible="offcanvas" {...props} className={cn("border-r", className)}>
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src="/logo.svg" alt="Insta Styling" width={180} height={32} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup data-nav-main>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {navItems.map((item) => {
                const href = normalize(item.url)
                const isActive = href === activeHref
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="gap-3 py-6 font-normal !text-gray-500 data-[active=true]:!font-medium data-[active=true]:!text-neutral-black_03 [&>svg]:!size-6"
                    >
                      <Link href={href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <a className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => {
            try {
              removeToken()
              // invalidate all queryies
              queryClient.invalidateQueries()
            } catch { }
            router.push("/admin-login")
          }}>
       <LogOutIcon className="size-4 ml-2" />
          <span>Log out</span>
        </a>
      </SidebarFooter>
    </Sidebar >
  )
}
