"use client"

import { HeaderActionButton } from "@/components/header-action-button"
import { Skeleton } from "@/components/ui/skeleton"

export type StylistProfileHeaderActionsProps = {
  loading: boolean
  /** When true, show Reject + Approve; when false, show Ban/Unban + Update. */
  stylingFormLocked: boolean
  banButton: {
    isBanned: boolean
    disabled: boolean
    onClick: () => void
    stylistName: string
  }
  removeButton: {
    disabled: boolean
    onClick: () => void
  }
  updateButton: {
    disabled: boolean
    onClick: () => void
  }
  pendingVerification: {
    rejectDisabled: boolean
    approveDisabled: boolean
    onReject: () => void
    onApprove: () => void
    approveSubmitting: boolean
  }
}

export function StylistProfileHeaderActions({
  loading,
  stylingFormLocked,
  banButton,
  removeButton: _removeButton,
  updateButton,
  pendingVerification,
}: StylistProfileHeaderActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 sm:shrink-0 sm:justify-end">
      {loading ? (
        <>
          <Skeleton
            className="h-12 w-[132px] shrink-0 rounded-[8px]"
            aria-hidden
          />
          <Skeleton
            className="h-12 w-[160px] shrink-0 rounded-[8px]"
            aria-hidden
          />
        </>
      ) : !stylingFormLocked ? (
        <>
          {/* <HeaderActionButton
            type="button"
            variant="errorSoft"
            disabled={removeButton.disabled}
            onClick={removeButton.onClick}
          >
            Remove {banButton.stylistName}
          </HeaderActionButton> */}
          <HeaderActionButton
            type="button"
            variant="errorSoft"
            disabled={banButton.disabled}
            onClick={banButton.onClick}
          >
            {banButton.isBanned
              ? `Reinstate ${banButton.stylistName}`
              : `Ban ${banButton.stylistName}`}
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            variant="primary"
            disabled={updateButton.disabled}
            onClick={updateButton.onClick}
          >
            Update Stylist
          </HeaderActionButton>
        </>
      ) : (
        <>
          <HeaderActionButton
            type="button"
            variant="errorSoft"
            disabled={pendingVerification.rejectDisabled}
            onClick={pendingVerification.onReject}
          >
            Reject Stylist
          </HeaderActionButton>
          <HeaderActionButton
            type="button"
            variant="primary"
            disabled={pendingVerification.approveDisabled}
            onClick={pendingVerification.onApprove}
          >
            {pendingVerification.approveSubmitting
              ? "Approving…"
              : "Approve Stylist"}
          </HeaderActionButton>
        </>
      )}
    </div>
  )
}
