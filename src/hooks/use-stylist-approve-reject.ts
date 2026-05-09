"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { getApiErrorMessage, stylistApplicationsApi } from "@/lib/api"

export function useStylistApproveReject(
  stylistId: string,
  backHref: string,
  onAfterApprove?: () => void
) {
  const router = useRouter()
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [approveSubmitting, setApproveSubmitting] = useState(false)
  const [rejectSubmitting, setRejectSubmitting] = useState(false)

  const handleApprove = useCallback(async () => {
    if (!stylistId || approveSubmitting) return
    setApproveSubmitting(true)
    try {
      await stylistApplicationsApi.approve(stylistId)
      toast.success("Stylist approved.")
      if (onAfterApprove) {
        onAfterApprove()
      } else {
        router.push(backHref)
      }
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    } finally {
      setApproveSubmitting(false)
    }
  }, [stylistId, approveSubmitting, router, backHref, onAfterApprove])

  const handleRejectConfirm = useCallback(
    async ({
      reason,
      attachment,
    }: {
      reason: string
      attachment: File | null
    }) => {
      if (!stylistId) return
      setRejectSubmitting(true)
      try {
        const fd = new FormData()
        fd.append("reason", reason)
        if (attachment) {
          fd.append("attachment", attachment)
        }
        await stylistApplicationsApi.reject(stylistId, fd)
        toast.success("Application rejected.")
        setRejectModalOpen(false)
        router.push(backHref)
      } catch (e) {
        toast.error(getApiErrorMessage(e))
      } finally {
        setRejectSubmitting(false)
      }
    },
    [stylistId, router, backHref]
  )

  return {
    rejectModalOpen,
    setRejectModalOpen,
    approveSubmitting,
    rejectSubmitting,
    handleApprove,
    handleRejectConfirm,
  }
}
