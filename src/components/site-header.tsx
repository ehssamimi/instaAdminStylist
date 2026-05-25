"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useIsSuperAdmin } from "@/hooks/use-is-super-admin";
import { formatDistanceToNow } from "date-fns";
import { useSelectedSchool } from "@/contexts/selected-school-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { getHeaderBreadcrumbs } from "@/config/breadcrumbs";

export function SiteHeader() {
  const { selectedSchoolUrl, setSelectedSchoolUrl } = useSelectedSchool();
  const isSuperAdmin = useIsSuperAdmin();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const headerBreadcrumbs = getHeaderBreadcrumbs(pathname, searchParams);

  // Type assertion since the API returns ProductResponse but school districts have different structure

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const breadcrumbContent = headerBreadcrumbs && headerBreadcrumbs.length > 0 && (
    <Breadcrumb>
      <BreadcrumbList className="gap-2 text-sm sm:text-base font-satoshi not-italic sm:gap-2">
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
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex w-full shrink-0 bg-card transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full flex-col lg:flex-row lg:items-center">
        {/* Main row — hamburger, logo, (desktop breadcrumb), admin */}
        <div className="flex w-full items-center gap-2 h-16 px-4 lg:pr-10 lg:pl-2">
          <SidebarTrigger className="flex shrink-0 lg:hidden" />

          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex justify-start items-center lg:w-[calc(var(--sidebar-width))]"
            >
              <Image
                src="/logo.svg"
                alt="Insta Styling"
                width={180}
                height={32}
                className="h-6 w-auto lg:h-8"
              />
            </Link>
          </div>

          {/* Breadcrumb inline — desktop only */}
          {headerBreadcrumbs && headerBreadcrumbs.length > 0 && (
            <div className="hidden lg:flex mr-auto items-center gap-2">
              {breadcrumbContent}
            </div>
          )}

          <h1 className="ml-auto flex shrink-0 items-center text-base font-semibold text-neutral-black_03 lg:text-lg">
            Admin
            <span className="ml-1 text-[10px] text-gray-300 lg:text-xs">
              (v-0.0.9)
            </span>
          </h1>
        </div>

        {/* Breadcrumb row — mobile only, sits below the logo */}
        {headerBreadcrumbs && headerBreadcrumbs.length > 0 && (
          <div className="flex lg:hidden items-center gap-2 px-4 pb-2">
            {breadcrumbContent}
          </div>
        )}
      </div>
    </header>
  );
}
