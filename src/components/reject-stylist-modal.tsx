"use client"

import * as React from "react"
import { UploadCloud } from "lucide-react"

import { HeaderActionButton } from "@/components/header-action-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024

export type RejectStylistModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (payload: { reason: string; attachment: File | null }) => Promise<void>
  isSubmitting?: boolean
}

export function RejectStylistModal({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
}: RejectStylistModalProps) {
  const [reason, setReason] = React.useState("")
  const [attachment, setAttachment] = React.useState<File | null>(null)
  const [attachmentError, setAttachmentError] = React.useState<string | null>(
    null
  )
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!open) {
      setReason("")
      setAttachment(null)
      setAttachmentError(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [open])

  const canSubmit = reason.trim().length > 0 && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-xl border-gray-200 p-0 sm:max-w-lg",
          "[&_[data-slot=dialog-close]]:top-[37.5px] [&_[data-slot=dialog-close]]:translate-y-[-50%]"
        )}
        showCloseButton
        onPointerDownOutside={(e) => {
          if (isSubmitting) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault()
        }}
      >
        <DialogHeader
          className={cn(
            "h-[75px] shrink-0 justify-center space-y-0 border-b border-greyscale-100 bg-greyscale-50 px-6 pr-14 text-left"
          )}
        >
          <DialogTitle className="font-satoshi text-lg font-bold text-black-100">
            Reason for Rejection
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="px-6 pt-4 font-satoshi text-sm font-normal leading-[130%]  ">
          Please provide a reason for rejecting this application. This will help
          the stylist understand what they need to improve.
        </DialogDescription>

        <div className="flex flex-col gap-5 px-6 pb-6 pt-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="reject-reason"
              className="font-satoshi text-sm font-normal "
            >
              Reason for Rejection
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Enter the reason…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className={cn(
                "min-h-[120px] resize-y rounded-lg border border-gray-300 bg-white font-satoshi text-sm text-gray-600 shadow-form-field outline-none transition-[color,box-shadow,border-color]",
                "placeholder:text-gray-500",
                "focus:border-brand focus:shadow-form-field focus:ring-2 focus:ring-brand/20 focus-visible:ring-2 focus-visible:ring-brand/20"
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-satoshi text-sm font-medium text-black-100">
              Attachment (optional, max 5 MB)
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              tabIndex={-1}
              disabled={isSubmitting}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                if (!f) {
                  setAttachment(null)
                  setAttachmentError(null)
                  return
                }
                if (f.size > MAX_ATTACHMENT_BYTES) {
                  setAttachment(null)
                  setAttachmentError("File must be 5 MB or smaller.")
                  e.target.value = ""
                  return
                }
                setAttachment(f)
                setAttachmentError(null)
              }}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 font-satoshi text-base font-bold text-black-100 shadow-form-field outline-none transition-[background-color,border-color]",
                "hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/20",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <UploadCloud className="size-5 shrink-0 text-gray-600" aria-hidden />
              <span>{attachment ? attachment.name : "Choose file"}</span>
            </button>
            {attachmentError ? (
              <p className="font-satoshi text-sm text-red-600" role="alert">
                {attachmentError}
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="flex flex-row flex-wrap gap-3 px-6 pb-6 pt-0 sm:justify-end">
          <HeaderActionButton
            type="button"
            variant="neutral"
            className="min-w-[120px]"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            variant="primary"
            className="min-w-[160px]"
            disabled={!canSubmit}
            onClick={async () => {
              if (!canSubmit) return
              await onConfirm({
                reason: reason.trim(),
                attachment,
              })
            }}
          >
            {isSubmitting ? "Submitting…" : "Confirm Rejection"}
          </HeaderActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
