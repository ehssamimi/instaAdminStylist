"use client";

import { Mail } from "lucide-react";

export type ProfileHeaderActivityItem = {
  label?: string;
  value?: string;
};

export type ProfileHeaderCardProps = {
  imageUrl?: string | null;
  displayName: string;
  email: string;
  /** e.g. “Stylist Name” / “Customer Name” */
  nameFieldLabel?: string;
  /** e.g. “Stylist Email” / “Customer Email” */
  emailFieldLabel?: string;
  /** Defaults to two “No activity yet” placeholders if omitted */
  activities?: ProfileHeaderActivityItem[];
};

function ActivityMetricCard({
  label = "No activity yet",
  value = "—",
}: {
  label?: string;
  value?: string;
}) {
  return (
    <div className="flex min-h-[96px] w-[140px] flex-col rounded-xl border border-gray-100 bg-white p-3">
      <p className="font-satoshi text-sm text-gray-900">{label}</p>
      <p className="mt-auto font-satoshi text-[28px] font-bold text-neutral-black_03">
        {value}
      </p>
    </div>
  );
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
      : ([{}, {}] satisfies ProfileHeaderActivityItem[]);

  return (
    <section className="mb-2 admin-panel-surface">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-4 sm:gap-y-3">
        {/* Profile info: photo + name + email */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center font-satoshi text-xs text-gray-400">
                No photo
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-0">
              <p className="mb-0.5 font-satoshi text-base font-bold">
                {nameFieldLabel}
              </p>
              <p className="font-normal text-gray-600">{displayName}</p>
            </div>
            <div className="min-w-0">
              <p className="mb-0.5 font-satoshi text-base font-bold">
                {emailFieldLabel}
              </p>
              <div className="flex min-w-0 items-start gap-1.5">
                <Mail
                  className="mt-0.5 size-3.5 shrink-0 text-black-40"
                  aria-hidden
                />
                <span className="min-w-0 break-all font-satoshi text-sm font-normal text-gray-600">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer: pushes cards to the right on the same row */}
        <div className="hidden sm:block sm:flex-1" />

        {/* Cards grouped so they always stay together and never split rows */}
        <div className="flex gap-3">
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
  );
}
