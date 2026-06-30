"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { HeaderActionButton } from "@/components/header-action-button";

type BanStylistModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "ban" | "unban";
  onConfirm: (reason: string) => Promise<void>;
};

const MIN_BAN_REASON_LENGTH = 3;

export function BanStylistModal({
  open,
  onOpenChange,
  action,
  onConfirm,
}: BanStylistModalProps) {
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isBan = action === "ban";

  useEffect(() => {
    if (!open) {
      setReason("");
      setPending(false);
    } else {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  async function handleConfirm() {
    if (pending) return;
    const trimmedReason = reason.trim();
    if (isBan && trimmedReason.length < MIN_BAN_REASON_LENGTH) {
      return;
    }
    setPending(true);
    try {
      await onConfirm(trimmedReason);
      onOpenChange(false);
    } catch {
      // keep modal open on error
    } finally {
      setPending(false);
    }
  }

  const banReasonTooShort =
    isBan && reason.trim().length > 0 && reason.trim().length < MIN_BAN_REASON_LENGTH;
  const confirmDisabled =
    pending || (isBan && reason.trim().length < MIN_BAN_REASON_LENGTH);

  return (
    <Dialog open={open} onOpenChange={pending ? undefined : onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 font-satoshi sm:max-w-[560px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F5F5F5] bg-[#FAFAFA] px-5 py-4">
          <DialogTitle className="font-lufga text-xl font-semibold text-[#121417]">
            {isBan ? "Ban Stylist" : "Unban Stylist"}
          </DialogTitle>
          <button
            type="button"
            aria-label="Close"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            className="flex size-6 items-center justify-center text-gray-500 transition-colors hover:text-gray-800 disabled:pointer-events-none"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-5">
          <p className="font-satoshi text-sm font-bold leading-relaxed text-black">
            {isBan
              ? "Are you sure you want to ban this stylist? All active bookings will be cancelled."
              : "Are you sure you want to unban this stylist? They will be able to receive bookings again."}
          </p>

          {isBan && (
            <p className="font-satoshi text-sm font-normal leading-relaxed text-black">
              Please provide a reason for banning this stylist. This reason will be shared with the stylist.
            </p>
          )}

          {isBan && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ban-reason"
                className="font-satoshi text-sm font-normal text-black"
              >
                Enter ban reason
              </label>
              <Textarea
                ref={textareaRef}
                id="ban-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Textarea input"
                disabled={pending}
                className="h-[154px] resize-none rounded-lg border border-[#D5D7DA] bg-white px-3.5 py-2.5 text-sm text-black shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680] focus-visible:border-gray-400 focus-visible:ring-0"
              />
              {banReasonTooShort ? (
                <p className="font-satoshi text-xs text-red-600">
                  Ban reason must be at least {MIN_BAN_REASON_LENGTH} characters.
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-[#F5F5F5] px-5 py-5">
          <HeaderActionButton
            type="button"
            variant="neutral"
            disabled={pending}
            className="h-[49px] flex-1 border-[#717680] text-black"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            variant="primary"
            disabled={confirmDisabled}
            className="h-[49px] flex-1"
            onClick={() => void handleConfirm()}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : isBan ? (
              "Confirm Ban"
            ) : (
              "Confirm Unban"
            )}
          </HeaderActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
