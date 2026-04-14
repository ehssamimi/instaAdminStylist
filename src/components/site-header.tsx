"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell, Loader2 } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useIsSuperAdmin } from "@/hooks/use-is-super-admin"
import { formatDistanceToNow } from "date-fns"
import { useSelectedSchool } from "@/contexts/selected-school-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import Image from "next/image"
import { getHeaderBreadcrumbs } from "@/config/breadcrumbs"


export function SiteHeader() {
  const { selectedSchoolUrl, setSelectedSchoolUrl } = useSelectedSchool()
  const isSuperAdmin = useIsSuperAdmin()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const headerBreadcrumbs = getHeaderBreadcrumbs(pathname, searchParams)

  // Type assertion since the API returns ProductResponse but school districts have different structure

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-card transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:pr-10 lg:pl-2">
      <div className="">
          <Link href="/" className='flex justify-start items-center w-[calc(var(--sidebar-width))]'>
            <Image src="/logo.svg" alt="Insta Styling" width={180} height={32} />
          </Link>
        </div>
        {/* <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        /> */}
        {headerBreadcrumbs && headerBreadcrumbs.length > 0 && (
          <div className="mr-auto flex items-center gap-2">
            <Breadcrumb>
              <BreadcrumbList className="gap-2 text-base font-satoshi not-italic sm:gap-2">
                {headerBreadcrumbs.map((item, index) => (
                  <React.Fragment key={`${item.label}-${index}`}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="w-auto font-light px-0.5 font-normal text-black-40 [&>svg]:hidden">
                        /
                      </BreadcrumbSeparator>
                    )}
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink
                          asChild
                          className="text-base font-normal text-black-40 not-italic font-satoshi hover:text-black-100/70"
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-base font-bold text-black-100 not-italic font-satoshi">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        <h1 className="text-lg font-semibold text-neutral-black_03 ml-auto">Admin</h1>

      </div>
    </header>
  )
}
