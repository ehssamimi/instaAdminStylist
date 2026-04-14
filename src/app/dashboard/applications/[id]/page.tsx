"use client"

import { StylistProfileView } from "@/components/stylist-profile-view"

export default function StylistProfilePage() {
  return <StylistProfileView backHref="/dashboard/applications" />
}
export const runtime = 'edge';