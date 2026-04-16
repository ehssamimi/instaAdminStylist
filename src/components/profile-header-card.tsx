"use client"

import { Mail } from "lucide-react"

export type ProfileHeaderActivityItem = {
  label?: string
  value?: string
}

export type ProfileHeaderCardProps = {
  imageUrl?: string | null
  displayName: string
  email: string
  /** e.g. “Stylist Name” / “Customer Name” */
  nameFieldLabel?: string
  /** e.g. “Stylist Email” / “Customer Email” */
  emailFieldLabel?: string
  /** Defaults to two “No activity yet” placeholders if omitted */
  activities?: ProfileHeaderActivityItem[]
}

function ActivityMetricCard({
  label = "No activity yet",
  value = "—",
}: {
  label?: string
  value?: string
}) {
  return (
    <div className="flex min-h-[112px] min-w-[140px] flex-1 flex-col rounded-xl border border-gray-100 bg-white p-3">
      <p className="font-satoshi text-sm text-gray-900">{label}</p>
      <p className="mt-auto flex flex-1 items-end justify-start font-satoshi text-[32px] font-bold text-neutral-black_03">
        {value}
      </p>
    </div>
  )
}

export function ProfileHeaderCard({
  imageUrl,
  displayName,
  email,
  nameFieldLabel = "Name",
  emailFieldLabel = "Email",
  activities,
}: ProfileHeaderCardProps) {
  const items =
    activities && activities.length > 0
      ? activities
      : ([{}, {}] satisfies ProfileHeaderActivityItem[])

  return (
    <section className="mb-6 admin-panel-surface">
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="flex w-full shrink-0 flex-col gap-10 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-satoshi text-xs text-gray-400">
                No photo
              </div>
            )}
          </div>
          <div className="flex min-w-0 gap-5 gap-10">
            <div>
              <p className="mb-1 font-satoshi text-lg font-bold">{nameFieldLabel}</p>
              <p className="mb-1 font-normal text-gray-600">{displayName}</p>
            </div>
            <div>
              <p className="mb-1 font-satoshi text-lg font-bold">{emailFieldLabel}</p>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-black-40" aria-hidden />
                <span className="mb-1 truncate font-satoshi font-normal text-gray-600">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-3xl min-w-0 gap-3 lg:flex-1">
          {items.map((item, index) => (
            <ActivityMetricCard
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
