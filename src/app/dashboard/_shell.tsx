'use client'

import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import PrivateRoute from '@/components/PrivateRoute'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { SelectedSchoolProvider } from '@/contexts/selected-school-context'

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <PrivateRoute>
      <SelectedSchoolProvider>
        <div className="antialiased font-satoshi">
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <div className="flex min-h-svh w-full flex-col">
              <SiteHeader />
              <div className="flex min-h-0 flex-1 w-full pt-16">
                <AppSidebar
                  variant="inset"
                  className="top-16 bottom-0 h-auto max-h-none"
                />
                <SidebarInset>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="@container/main flex min-h-0 flex-1 flex-col gap-2 bg-bg-main">
                      <div className="p-4 md:p-10">
                        {children}
                      </div>
                    </div>
                  </div>
                </SidebarInset>
              </div>
            </div>
          </SidebarProvider>
        </div>
      </SelectedSchoolProvider>
    </PrivateRoute>
  )
}
