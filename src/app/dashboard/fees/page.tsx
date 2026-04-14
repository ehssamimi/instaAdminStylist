"use client"

import { FeesSettingsForm } from "@/components/fees-settings-form"
import { usePageTitle } from "@/hooks/use-page-title"

export default function FeesPage() {
  const { title } = usePageTitle()

  return (
    <div className="relative -m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <h1 className="admin-page-title">{title}</h1>
      <FeesSettingsForm />
    </div>
  )
}
