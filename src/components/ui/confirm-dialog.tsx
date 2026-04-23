"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Body copy under the title */
  description: string
  title?: string
  /** Called when the user confirms. Dialog closes after this resolves; stays open if it rejects. */
  onConfirm: () => void | Promise<void>
  /** Optional; defaults to closing the dialog without calling `onConfirm`. */
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  showCloseButton?: boolean
  className?: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Yes",
  cancelLabel = "Go Back",
  showCloseButton = false,
  className,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) setPending(false)
  }, [open])

  function handleCancel() {
    if (pending) return
    onCancel?.()
    onOpenChange(false)
  }

  async function handleConfirm() {
    if (pending) return
    setPending(true)
    try {
      await Promise.resolve(onConfirm())
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "grid grid-cols-1 content-start justify-items-center gap-4 p-0 px-[40px] py-[32px] font-satoshi sm:max-w-md",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <div
          className="flex size-12 items-center justify-center rounded-full bg-warning-100"
          aria-hidden
        >
          <AlertTriangle className="size-6 text-warning-500" strokeWidth={1.75} />
        </div>
        <DialogHeader className="w-full space-y-4 text-center sm:text-center">
          <DialogTitle className="font-satoshi text-xl font-bold text-black mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="font-satoshi text-sm leading-relaxed text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid w-full max-w-full grid-cols-2 gap-3 p-0 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="w-full min-h-11 border-black bg-white font-satoshi font-bold text-black hover:bg-gray-50"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={pending}
            className="w-full min-h-11 bg-black font-satoshi font-bold text-white hover:bg-neutral-800"
            onClick={() => void handleConfirm()}
          >
            {pending ? (
              <Loader2 className="mx-auto size-5 animate-spin" aria-hidden />
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
