'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClaimStatusBadge } from '@/components/claim-status-badge'
import { ClaimNotesModal } from '@/components/claim-notes-modal'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useUpdateClaimStatus, useClaimAdmin } from '@/hooks/use-claims'
import { formatDate } from 'date-fns'
import { toast } from 'sonner'

export default function ClaimDetailsContent() {
  const { id } = useParams()
  const router = useRouter()
  const updateClaimStatus = useUpdateClaimStatus()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [notes, setNotes] = useState('')
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const claimId = typeof id === 'string' ? parseInt(id, 10) : 0
  const { data: claimData } = useClaimAdmin(claimId)
  const status = claimData?.data?.claim_header?.status
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard/claims')
    }
  }

  const handleApprove = () => {
    setModalType('approve')
    setIsModalOpen(true)
  }

  const handleSendNote = () => {
    setModalType('note')
    setIsModalOpen(true)
  }

  const openRejectModal = () => {
    setModalType('reject')
    setIsModalOpen(true)
  }

  const handleSubmitNote = async (files: File[]) => {
    const data: FormData = new FormData()
    data.append('admin_notes', notes)
    if (modalType === 'approve') {
      data.append('approved_amount', approvedAmount.toString())
    }
    files.forEach((file) => {
      data.append('files', file)
    })
    try {
      if (modalType === 'approve') {
        data.append('status', 'approved')
        await updateClaimStatus.mutateAsync({ id: claimId, params: data })
        toast.success('Claim approved successfully.', {
          description: 'The user has been notified, and the claim is now marked as "Approved."'
        })
        router.push('/dashboard/claims')
      } else if (modalType === 'reject') {
        data.append('status', 'rejected')
        await updateClaimStatus.mutateAsync({ id: claimId, params: data })
        toast.success('Claim rejected successfully.', {
          description: 'The user has been notified, and the claim is now marked as "Rejected."'
        })
        router.push('/dashboard/claims')
      } else if (modalType === 'note') {
        data.append('status', claimData?.data?.claim_header?.status || '')
        await updateClaimStatus.mutateAsync({ id: claimId, params: data })
        toast.success('Note sent successfully.', {
          description: 'The user has been notified'
        })
        router.push('/dashboard/claims')
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
    setIsModalOpen(false)
    setNotes('')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setNotes('')
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  return (
    <div className="min-h-screen ">
      <div className="py-3 flex flex-wrap items-center justify-between">
        <div className='flex items-center gap-4 mb-5'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            onClick={handleBack}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <path d="M7.21973 6.46973C7.51262 6.17683 7.98738 6.17683 8.28027 6.46973C8.57317 6.76262 8.57317 7.23738 8.28027 7.53027L6.56055 9.25H15.25C15.6642 9.25 16 9.58579 16 10C16 10.4142 15.6642 10.75 15.25 10.75H6.56055L8.28027 12.4697C8.57317 12.7626 8.57317 13.2374 8.28027 13.5303C7.98738 13.8232 7.51262 13.8232 7.21973 13.5303L4.21973 10.5303C3.92683 10.2374 3.92683 9.76262 4.21973 9.46973L7.21973 6.46973Z" fill="#4A4A4A" />
          </svg>
          <h1 className="text-2xl font-semibold">Review Claim</h1>
        </div>

        <div className="flex flex-wrap gap-4 space-y-3">
          {status !== 'rejected' && <Button
            onClick={openRejectModal}
            variant="outline"
            className="rounded-full border-danger-600 text-danger-600 hover:bg-gray-50"
            size="lg"
          >
            Reject Claim
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" rx="5" transform="matrix(-1 0 0 1 22 2)" stroke="#FF291A" strokeWidth="1.5" />
              <path d="M11.5 17L11.5 11" stroke="#FF291A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.5 11L11.5 11" stroke="#FF291A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.5 8L11.5 7" stroke="#FF291A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>}
          {status !== 'approved' && <Button
            onClick={handleApprove}
            className="rounded-full text-white bg-success-600"
            size="lg"
          >
            Approve Claim
          </Button>}
          <Button
            onClick={handleSendNote}
            className="rounded-full text-white"
            size="lg"
          >
            Send a Note
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2 mx-auto mb-5">
        <div className='grid md:grid-cols-2 gap-2'>
          <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
            <p className="text-sm font-semibold text-neutral-black_03">Claim Number:</p>
            <p className="text-xs text-gray-600">{claimData?.data?.claim_header?.claim_number}</p>
          </div>
          <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
            <p className="text-sm font-semibold text-neutral-black_03">Policy Number:</p>
            <p className="text-xs text-gray-600">{claimData?.data?.claim_header?.policy_number}</p>
          </div>
        </div>
        <div>
          <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
            <p className="text-sm font-semibold text-neutral-black_03">Status</p>
            <div className="flex items-center gap-2">
              <ClaimStatusBadge status={claimData?.data?.claim_header?.status} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-2 mx-auto mb-5">
        <div className="border-border-soft border-2 bg-surface rounded-lg">
          <div className="px-4 pt-5 pb-2 border-b border-gray-100 mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Device Info</h2>
          </div>
          <div className='px-4'>
            <div className='flex mb-4 gap-4 border-b border-gray-100 pb-4'>
              {claimData?.data?.device_info?.receipt_photos?.[0] && (
                <div onClick={() => openImageModal(claimData.data.device_info.receipt_photos[0])} className="cursor-pointer hover:opacity-90 transition-opacity">
                  <Image src={claimData?.data?.device_info?.receipt_photos?.[0]} className='rounded' alt="Device" width={72} height={72} />
                </div>
              )}
              <div>
                <div className="text-base font-semibold text-neutral-black_03">{claimData?.data?.device_info?.device_name}</div>
                <span className="text-sm text-gray-600">{claimData?.data?.device_info?.device_name}</span>
              </div>
            </div>
            <div className='mb-4 border-b border-gray-100'>
              <div className="flex gap-10 flex-wrap pb-4">
                <div>
                  <div className="text-sm font-semibold text-neutral-black_03">Serial Number</div>
                  <span className="text-sm text-greyscale-600">{claimData?.data?.device_info?.serial_number}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-black_03">Date of Purchase</div>
                  <span className="text-sm text-gray-600">
                    {claimData?.data?.device_info?.purchase_date
                      ? formatDate(new Date(claimData.data.device_info.purchase_date), 'MM/dd/yyyy')
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <div className="text-base font-semibold text-neutral-black_03">Color</div>
                  <span className="text-sm text-gray-600">{claimData?.data?.device_info?.color ?? 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className='flex mb-4 gap-4'>
                {claimData?.data?.device_info?.receipt_photos?.[0] && (
                  <div onClick={() => openImageModal(claimData.data.device_info.receipt_photos[0])} className="cursor-pointer hover:opacity-90 transition-opacity">
                    <Image src={claimData?.data?.device_info?.receipt_photos?.[0]} className='rounded' alt="Receipt" width={48} height={48} />
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-neutral-black_03">Receipt</div>
                  <span className="text-sm text-gray-600">image.jpg</span>
                </div>
              </div>
              <Button
                onClick={() => claimData?.data?.device_info?.receipt_photos?.[0] && openImageModal(claimData.data.device_info.receipt_photos[0])}
                variant="outline"
                className="bg-surface-muted text-brand rounded-full"
                size="lg"
              >
                View Receipt
              </Button>
            </div>
          </div>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg">
          <div className="px-4 pt-5 pb-2 border-b border-gray-100 mb-4">
            <h2 className="text-sm font-semibold text-neutral-black_03">Incident Details</h2>
          </div>
          <div className='px-4'>
            <div className='mb-4 border-b border-gray-100'>
              <div className="flex gap-10 flex-wrap pb-4">
                <div>
                  <div className="text-sm font-semibold text-neutral-black_03">Date of Incident</div>
                  <span className="text-sm text-gray-600">
                    {claimData?.data?.incident_details?.incident_date
                      ? formatDate(new Date(claimData.data.incident_details.incident_date), 'MM/dd/yyyy')
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-black_03">Location of incident</div>
                  <span className="text-sm text-gray-600">{claimData?.data?.incident_details?.incident_location ?? 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className='mb-4 border-b border-gray-100'>
              <div className="flex gap-10 flex-wrap pb-4">
                <div>
                  <div className="text-sm font-semibold text-neutral-black_03">Description of incident</div>
                  <span className="text-sm text-gray-600">
                    {claimData?.data?.incident_details?.incident_description}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between items-center mb-5">
              <div>
                <span className="text-sm font-semibold text-neutral-black_03">Uploaded Files</span>
                <div className="text-sm text-gray-600">{claimData?.data?.incident_details?.uploaded_files?.count} images</div>
              </div>
              <div className='flex flex-wrap gap-2'>
                {claimData?.data?.incident_details?.uploaded_files?.files.map((attachment) => (
                  <div key={attachment.id} onClick={() => openImageModal(attachment.file_url)} className="cursor-pointer hover:opacity-90 transition-opacity">
                    <Image src={attachment.file_url} alt={attachment.file_name} className='rounded' width={109} height={72} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        <h1 className="text-lg font-semibold text-gray-900 mb-5">Coverage Plan</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Plan</p>
          <p className="text-xs text-gray-600">{claimData?.data?.coverage_plan?.plan}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Coverage Start</p>
          <p className="text-xs text-gray-600">{claimData?.data?.coverage_plan?.coverage_start}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Coverage End</p>
          <p className="text-xs text-gray-600">{claimData?.data?.coverage_plan?.coverage_end}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Service Fee</p>
          <p className="text-xs text-gray-600">{claimData?.data?.coverage_plan?.service_fee_deduction}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Claim Cost</p>
          <p className="text-xs text-gray-600">{claimData?.data?.coverage_plan?.claim_cost}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Payment Method</p>
          <p className="text-xs text-gray-600">{claimData?.data?.coverage_plan?.payment_method}</p>
        </div>
      </div>

      <div className='flex items-center'>
        <h1 className="text-lg font-semibold text-gray-900 mb-5">Customer Info</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Name</p>
          <p className="text-xs text-gray-600">{claimData?.data?.customer?.name}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Email</p>
          <p className="text-xs text-gray-600">{claimData?.data?.customer?.email}</p>
        </div>
        <div className="border-border-soft border-2 bg-surface rounded-lg py-2 px-4">
          <p className="text-sm font-semibold text-neutral-black_03">Phone Number</p>
          <p className="text-xs text-gray-600">{claimData?.data?.customer?.phone || 'N/A'}</p>
        </div>
      </div>

      <ClaimNotesModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        modalType={modalType}
        approvedAmount={approvedAmount}
        setApprovedAmount={setApprovedAmount}
        notes={notes}
        onNotesChange={setNotes}
        onSubmit={handleSubmitNote}
        onCancel={handleCancel}
        claimNumber={claimData?.data?.claim_header?.claim_number}
        policyNumber={claimData?.data?.claim_header?.policy_number}
        isLoading={updateClaimStatus.isPending}
      />

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedImage}
                alt="Full Size Image"
                width={800}
                height={1000}
                className="rounded-lg object-contain max-h-[85vh] w-auto mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
