"use client"

import { useState, type ReactNode } from "react"
import { format, isValid, parseISO } from "date-fns"
import { Mail, Phone, X, ZoomIn } from "lucide-react"

import { EachContainer, EachContainerDivider } from "@/components/each-container"
import { HeaderActionButton } from "@/components/header-action-button"
import { PageBackHeading } from "@/components/page-back-heading"
import { NameAvatar } from "@/components/detail-info-card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AdminReportDetail, ReportStatus } from "@/models/reports"

const statusLabels: Record<ReportStatus, string> = {
  OPEN: "Reports to review",
  REMOVED_USER: "Removed user",
  IGNORED: "Ignored",
}

function formatReportDate(iso: string): string {
  const d = parseISO(iso)
  if (!isValid(d)) return iso
  return format(d, "MM/dd/yyyy")
}

function ReportFieldCell({
  label,
  value,
  valueIcon,
}: {
  label: string
  value: ReactNode
  valueIcon?: ReactNode
}) {
  return (
    <div className="min-w-0">
      <p className="font-satoshi text-lg font-bold text-black">{label}</p>
      <div className="mt-1 flex min-w-0 items-center gap-1 font-satoshi text-sm font-normal text-gray-700">
        {valueIcon ? (
          <span className="flex shrink-0 items-center text-gray-400 [&_svg]:size-4">
            {valueIcon}
          </span>
        ) : null}
        <span className="min-w-0 break-all font-normal text-gray-600">{value}</span>
      </div>
    </div>
  )
}

type ReportDetailsPageViewProps = {
  report: AdminReportDetail | null
  backHref: string
  backAriaLabel?: string
}

export function ReportDetailsPageView({
  report,
  backHref,
  backAriaLabel = "Back to reports",
}: ReportDetailsPageViewProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [ignoreDialogOpen, setIgnoreDialogOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const email = report?.reportedUserEmail?.trim()
  const phone = report?.reportedUserPhone?.trim()
  const attachments = report?.attachmentImageUrls?.filter(Boolean) ?? []

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 [&>div]:mb-0">
          <PageBackHeading
            title="Report Details"
            backHref={backHref}
            backAriaLabel={backAriaLabel}
          />
        </div>
        {report?.status === "OPEN" ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:mt-1">
            <HeaderActionButton
              type="button"
              variant="errorSoft"
              onClick={() => setRemoveDialogOpen(true)}
            >
              Remove {report.reportedUserName}
            </HeaderActionButton>
            <HeaderActionButton
              type="button"
              variant="primary"
              onClick={() => setIgnoreDialogOpen(true)}
            >
              Ignore Report
            </HeaderActionButton>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove user?"
        description={`This will remove ${report?.reportedUserName ?? "this user"} from the platform. This action should align with your moderation policy.`}
        confirmLabel="Remove user"
        onConfirm={() => {
          /* wire remove user when API exists */
        }}
      />

      <ConfirmDialog
        open={ignoreDialogOpen}
        onOpenChange={setIgnoreDialogOpen}
        title="Ignore this report?"
        description="The report will be marked as ignored and no further action will be taken."
        confirmLabel="Ignore report"
        onConfirm={() => {
          /* wire PATCH ignore when API exists */
        }}
      />

      <Dialog
        open={lightboxSrc != null}
        onOpenChange={(open) => {
          if (!open) setLightboxSrc(null)
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[95vh] w-[min(95vw,1200px)] max-w-[min(95vw,1200px)] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-[min(95vw,1200px)]"
        >
          <DialogTitle className="sr-only">Attachment preview</DialogTitle>
          {lightboxSrc ? (
            <div className="relative inline-block max-h-[90vh] max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxSrc}
                alt=""
                className="w-full h-full object-cover"
              />
              <DialogClose
                type="button"
                className="absolute rounded-full right-10 top-10 z-10 flex size-[54px] items-center justify-center    border-0 bg-[rgba(0,0,0,0.25)] text-white outline-none transition-colors hover:bg-[rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-0"
                aria-label="Close"
              >
                <X className="size-7" strokeWidth={2} aria-hidden /> 
              </DialogClose>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {!report ? (
        <p className="font-satoshi text-sm text-muted-foreground" role="status">
          Report not found.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <EachContainer> 
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <NameAvatar
                name={report.reportedUserName}
                imageSrc={report.reportedUserAvatarUrl ?? null}
                className="size-[97px] shrink-0 rounded-lg text-base ring-gray-200"
              />
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
                <ReportFieldCell
                  label="Reported User"
                  value={report.reportedUserName}
                />
                <ReportFieldCell label="User Type" value={report.userType} />
                <ReportFieldCell
                  label="Report Date"
                  value={formatReportDate(report.reportDate)}
                />
                <ReportFieldCell
                  label="User Email"
                  value={email || "—"}
                  valueIcon={<Mail aria-hidden />}
                />
                <ReportFieldCell
                  label="Phone Number"
                  value={phone || "—"}
                  valueIcon={<Phone aria-hidden />}
                />
              </div>
            </div>

            <EachContainerDivider className="my-5" />

            <div className="flex flex-wrap items-center gap-2 font-satoshi text-sm font-normal text-gray-400">
              <NameAvatar
                name={report.reportedByName}
                imageSrc={null}
                className="size-9 rounded-full text-[11px]"
              />
              <p>
                Reported by{" "}
                <span className="font-bold text-gray-900">
                  {report.reportedByName}
                </span>
              </p>
            </div>
          </EachContainer>
          

          <EachContainer title="Reporting reason">
            <p className="font-satoshi text-sm font-normal leading-relaxed whitespace-pre-wrap text-gray-700">
              {report.reasoning}
            </p>
            {attachments.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-4">
                {attachments.map((src) => (
                  <div
                    key={src}
                    className="relative h-[196px] w-[218px] shrink-0 overflow-hidden rounded-2xl bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/25 text-gray-700 shadow-md transition-colors hover:bg-black"
                      aria-label="View full size"
                      onClick={() => setLightboxSrc(src)}
                    >
                      <ZoomIn className="size-5 text-white" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </EachContainer>

       
        </div>
      )}
    </div>
  )
}
