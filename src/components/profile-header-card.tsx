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
  nameFieldLabel?: string;
  emailFieldLabel?: string;
  activities?: ProfileHeaderActivityItem[];
};

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
        {/* Profile info: photo + name + email */}
        <div className="flex min-w-0 shrink-0 items-center gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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

        {/* Stat cards */}
        <div className="flex gap-4 lg:flex-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex h-[112px] flex-1 flex-col items-start justify-between rounded-[12px] border border-[#F5F5F5] bg-white p-4 shadow-panel"
            >
              <p className="font-satoshi text-sm text-gray-500">
                {item.label ?? "No activity yet"}
              </p>
              <p className="font-satoshi text-[28px] font-bold text-neutral-black_03">
                {item.value ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
