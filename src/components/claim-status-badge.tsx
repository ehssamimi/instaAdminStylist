"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ClaimStatusDisplay = {
  label: string;
  className: string;
  showIcon: boolean;
};

/** Reusable: submitted → "Open" green; approved → "Completed" purple + icon; rejected/draft supported. */
export function getClaimStatusDisplay(status?: string | null): ClaimStatusDisplay {
  const s = status?.toLowerCase();
  if (s === "submitted") {
    return { label: "Open", className: "text-green-600 bg-white/90", showIcon: false };
  }
  if (s === "approved") {
    return { label: "Completed", className: "text-brand bg-white/90", showIcon: true };
  }
  if (s === "rejected") {
    return { label: "Rejected", className: "bg-white/90 text-squishy-600", showIcon: false };
  }
  if (s === "draft") {
    return { label: "Draft", className: "bg-gray-200 text-gray-700", showIcon: false };
  }
  const fallback = status ? status.replace(/_/g, " ") : "—";
  const label = fallback.charAt(0).toUpperCase() + fallback.slice(1);
  return { label, className: "text-gray-600 bg-gray-100", showIcon: false };
}

type ClaimStatusBadgeProps = {
  status?: string | null;
  className?: string;
  asBadge?: boolean;
};

/** Renders claim status: Open (green) or Completed (purple + icon). */
export function ClaimStatusBadge({ status, className, asBadge = true }: ClaimStatusBadgeProps) {
  const { label, className: statusClass, showIcon } = getClaimStatusDisplay(status);
  const content = (
    <>
      {showIcon && <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <path d="M11.8604 8.26816C11.9648 8.1512 12.0185 7.99754 12.0096 7.841C12.0008 7.68445 11.9301 7.53783 11.8131 7.43341C11.6962 7.32898 11.5425 7.27529 11.386 7.28415C11.2294 7.29301 11.0828 7.3637 10.9784 7.48066L8.60723 10.1377L7.9221 9.37066C7.8174 9.25495 7.67115 9.18539 7.51532 9.17716C7.35949 9.16893 7.20673 9.22271 7.09042 9.32674C6.97411 9.43078 6.9037 9.57662 6.89457 9.7324C6.88543 9.88818 6.93832 10.0412 7.04168 10.1582L8.16623 11.4182C8.22163 11.4802 8.28952 11.5299 8.36545 11.5639C8.44138 11.5979 8.52364 11.6155 8.60684 11.6155C8.69003 11.6155 8.77229 11.5979 8.84822 11.5639C8.92415 11.5299 8.99204 11.4802 9.04744 11.4182L11.8604 8.26816Z" fill="#7967CB" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.45059 0.984375C8.7127 0.984375 8.0071 1.22614 6.86995 1.61516L6.29744 1.81204C5.13115 2.21051 4.23025 2.51921 3.58607 2.78066C3.26162 2.91217 2.98206 3.04054 2.75762 3.17048C2.54106 3.29647 2.3245 3.45319 2.17724 3.66345C2.03155 3.87056 1.95595 4.12571 1.9087 4.3722C1.85909 4.62735 1.82995 4.93369 1.81026 5.2857C1.77246 5.98342 1.77246 6.94103 1.77246 8.18213V9.44291C1.77246 14.2474 5.40126 16.5509 7.55901 17.4943L7.58027 17.503C7.84802 17.6203 8.10002 17.7298 8.38904 17.8038C8.6938 17.8825 9.01825 17.9156 9.45059 17.9156C9.88371 17.9156 10.2066 17.8825 10.5121 17.8038C10.8011 17.7298 11.0531 17.6203 11.3201 17.503L11.3422 17.4943C13.4999 16.5509 17.1287 14.2474 17.1287 9.44291V8.18213C17.1287 6.94103 17.1287 5.98342 17.0909 5.28491C17.0779 4.9786 17.045 4.67346 16.9925 4.37141C16.9452 4.12571 16.8696 3.87056 16.7247 3.66266C16.5767 3.45319 16.3601 3.29647 16.1435 3.17048C15.8761 3.02282 15.5994 2.89261 15.3151 2.78066C14.6709 2.51921 13.77 2.21051 12.6037 1.81204L12.0312 1.61516C10.8941 1.22614 10.1885 0.984375 9.45059 0.984375ZM7.15109 2.76727C8.4229 2.33257 8.93241 2.16562 9.45059 2.16562C9.96876 2.16562 10.4783 2.33257 11.7501 2.76727L12.2005 2.92162C13.392 3.32955 14.2606 3.62722 14.8702 3.8745C15.1749 3.99892 15.3954 4.10287 15.5506 4.19265C15.6262 4.23675 15.6808 4.27324 15.7144 4.30211C15.7443 4.32574 15.7561 4.33991 15.7577 4.34149C15.768 4.36001 15.7765 4.37954 15.7829 4.39976C15.7986 4.44281 15.8152 4.50791 15.8325 4.59506C15.876 4.84443 15.9023 5.0965 15.9112 5.34949C15.9475 6.01178 15.9475 6.9363 15.9475 8.20339V9.44291C15.9475 13.519 12.8998 15.5248 10.8689 16.4115C10.5767 16.5391 10.4074 16.6115 10.2192 16.6596C10.0396 16.706 9.82071 16.7344 9.45059 16.7344C9.08046 16.7344 8.86154 16.706 8.68199 16.6596C8.49299 16.6123 8.32446 16.5391 8.0323 16.4115C6.00055 15.5248 2.95371 13.5182 2.95371 9.44291V8.20339C2.95371 6.9363 2.95371 6.01178 2.98994 5.34949C2.99883 5.0965 3.02514 4.84443 3.06869 4.59506C3.08549 4.50791 3.10202 4.44281 3.1183 4.39976C3.13247 4.36039 3.14192 4.34464 3.1435 4.34149C3.15668 4.32705 3.17118 4.31386 3.18681 4.30211C3.22041 4.27324 3.27501 4.23649 3.35061 4.19186C3.50575 4.10209 3.72625 3.99892 4.03101 3.87529C4.64054 3.62722 5.50915 3.32955 6.70064 2.92241L7.15109 2.76727Z" fill="#7967CB" />
      </svg>}
      {label}
    </>
  );
  if (asBadge) {
    return (
      <Badge
        variant="secondary"
        className={cn("font-medium gap-1 capitalize", statusClass, className)}
      >
        {content}
      </Badge>
    );
  }
  return (
    <span className={cn("text-base font-semibold inline-flex items-center gap-1 px-4 py-2 rounded-full", statusClass, className)}>
      {content}
    </span>
  );
}
