"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { HeaderActionButton } from "./header-action-button"

type RemoveFeaturedStylistDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Full display name, e.g. "Jane Smith" */
  stylistName: string
  onConfirm: () => void | Promise<void>
}

export function RemoveFeaturedStylistDialog({
  open,
  onOpenChange,
  stylistName,
  onConfirm,
}: RemoveFeaturedStylistDialogProps) {
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!open) setPending(false)
  }, [open])

  const displayName = stylistName.trim() || "this stylist"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-xl border-0 p-0 shadow-lg sm:max-w-md",
          "bg-white"
        )}
        onPointerDownOutside={(e) => {
          if (pending) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (pending) e.preventDefault()
        }}
        aria-describedby="remove-featured-desc"
      >
        <p id="remove-featured-desc" className="sr-only">
          Confirm removing {displayName} from the featured list. This will not
          delete their account.
        </p>

        <div className="grid justify-items-center gap-4 px-10 py-8 font-satoshi sm:px-10 sm:py-8 text-center">
          <div
            className="flex size-12 items-center justify-center rounded-full bg-warning-100"
            aria-hidden
          >
            <AlertTriangle
              className="size-6 text-warning-500"
              strokeWidth={1.75}
            />
          </div>
          <DialogHeader className="w-full space-y-4 p-0 text-center">
            <DialogTitle className="text-xl font-bold leading-tight text-black-100 text-center">
              Remove Stylist from Featured List
            </DialogTitle>
            <p className="text-base leading-relaxed text-gray-500 text-center">
              Are you sure you want to remove{" "}
              <span className="font-medium text-gray-800">{displayName}</span>{" "}
              from the featured stylists?
            </p>
          </DialogHeader>

          <div className="grid w-full max-w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">

          <HeaderActionButton
              type="button"
              variant="neutral"
              disabled={pending}
              onClick={() => onOpenChange(false)}
             >
              Cancel
            </HeaderActionButton>
            {/* <Button
              type="button"
              variant="outline"
              disabled={pending}
              className="h-11 w-full min-w-0 border-gray-200 bg-white font-satoshi text-sm font-bold text-black-100 shadow-none hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button> */}
          <HeaderActionButton
            type="button"
            variant="primary"
           
            onClick={() =>
              void (async () => {
                if (pending) return
                setPending(true)
                try {
                  await Promise.resolve(onConfirm())
                  onOpenChange(false)
                } finally {
                  setPending(false)
                }
              })()
            }
            disabled={pending}
          >
             {pending ? (
                <Loader2 className="mx-auto size-5 animate-spin" aria-hidden />
              ) : (
                "Yes, remove"
              )}
          </HeaderActionButton>


            {/* <Button
              type="button"
              disabled={pending}
              className="h-11 w-full min-w-0 border-0 bg-black font-satoshi text-sm font-bold text-white shadow-none hover:bg-black/90"
              onClick={() =>
                void (async () => {
                  if (pending) return
                  setPending(true)
                  try {
                    await Promise.resolve(onConfirm())
                    onOpenChange(false)
                  } finally {
                    setPending(false)
                  }
                })()
              }
            >
              {pending ? (
                <Loader2 className="mx-auto size-5 animate-spin" aria-hidden />
              ) : (
                "Yes, remove"
              )}
            </Button> */}
          </div>

          <p className="text-center text-xs leading-relaxed text-gray-500">
            This action won&apos;t delete their account, only remove them from
            the featured list.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
