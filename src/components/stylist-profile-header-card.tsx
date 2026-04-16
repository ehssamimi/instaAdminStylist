"use client"

import {
  ProfileHeaderCard,
  type ProfileHeaderActivityItem,
  type ProfileHeaderCardProps,
} from "@/components/profile-header-card"

export type StylistProfileActivityItem = ProfileHeaderActivityItem

export type StylistProfileHeaderCardProps = Omit<
  ProfileHeaderCardProps,
  "displayName" | "email" | "nameFieldLabel" | "emailFieldLabel"
> & {
  stylistName: string
  stylistEmail: string
}

export function StylistProfileHeaderCard({
  stylistName,
  stylistEmail,
  ...rest
}: StylistProfileHeaderCardProps) {
  return (
    <ProfileHeaderCard
      displayName={stylistName}
      email={stylistEmail}
      nameFieldLabel="Stylist Name"
      emailFieldLabel="Stylist Email"
      {...rest}
    />
  )
}
