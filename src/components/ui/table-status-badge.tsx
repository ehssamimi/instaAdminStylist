"use client";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const tableStatusLabels = {
  completed: "Completed",
  scheduled: "Scheduled",
  canceled: "Canceled",
  canceled_by_stylist: "Canceled By Stylist",
  canceled_by_admin: "Canceled By Admin",
  pending_payment: "Pending Payment",
} as const;

export type TableStatus = keyof typeof tableStatusLabels;

const variantByNormalized: Record<
  string,
  "completed" | "scheduled" | "canceled" | "pending_payment" | "neutral"
> = {
  completed: "completed",
  scheduled: "scheduled",
  canceled: "canceled",
  cancelled: "canceled",
  canceled_by_stylist: "canceled",
  canceled_by_admin: "canceled",
  pending_payment: "pending_payment",
};

function normalizeStatusKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/-/g, "_");
}

export function formatBookingStatusLabel(status: string): string {
  const key = normalizeStatusKey(status) as TableStatus;
  if (key in tableStatusLabels) {
    return tableStatusLabels[key];
  }
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveVariant(
  status: string
): "completed" | "scheduled" | "canceled" | "pending_payment" | "neutral" {
  const n = normalizeStatusKey(status);
  return variantByNormalized[n] ?? "neutral";
}

const tableStatusBadgeVariants = cva(
  "inline-flex min-w-[5.5rem] justify-center rounded-full p-2.5 font-satoshi text-xs font-bold",
  {
    variants: {
      status: {
        completed: "bg-success-50 text-success-800",
        scheduled: "bg-warning-50 text-[#DC6803]",
        in_progress: "bg-warning-50 text-warning-800",
        canceled: "bg-error-50 text-error-800 ",
        pending_payment: "bg-warning-50 text-warning-800",
        /** Unknown / unlisted API statuses */
        neutral: "bg-brand-25 text-brand-800 ring-1 ring-brand-100 ring-inset",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
);


export function TableStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variant = resolveVariant(status);
  const label = formatBookingStatusLabel(status);
  return (
    <span
      className={cn(tableStatusBadgeVariants({ status: variant }), className)}
    >
      {label}
    </span>
  );
}
