'use client'

import { useState } from 'react'
import { Clock, FileText, Mail, Wallet } from 'lucide-react'
import { BookingRatingStars } from '@/components/booking-rating-stars'
import {
  DetailInfoCard,
  DetailSectionCard,
  NameAvatar,
} from '@/components/detail-info-card'
import { HeaderActionButton } from '@/components/header-action-button'
import { BookingDetailsPageSkeleton } from '@/components/booking-details-page-skeleton'
import { PageBackHeading } from '@/components/page-back-heading'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  TableStatusBadge,
  tableStatusLabels,
} from '@/components/ui/table-status-badge'
import { formatDurationLabel } from '@/lib/booking-format'
import type { BookingDetailDto } from '@/models/bookings'

type BookingDetailsPageViewProps = {
  booking: BookingDetailDto | null
  backHref: string
  backAriaLabel: string
  loading?: boolean
  errorMessage?: string | null
}

function reviewBody(text: string | null) {
  const t = text?.trim()
  if (!t) {
    return (
      <span className="text-muted-foreground">No response yet.</span>
    )
  }
  return (
    <span className="font-satoshi text-sm font-normal leading-relaxed text-gray-700">
      {t}
    </span>
  )
}

export function BookingDetailsPageView({
  booking,
  backHref,
  backAriaLabel,
  loading = false,
  errorMessage = null,
}: BookingDetailsPageViewProps) {
  const [cancelCallDialogOpen, setCancelCallDialogOpen] = useState(false)

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 [&>div]:mb-0">
          <PageBackHeading
            title="Booking Details"
            backHref={backHref}
            backAriaLabel={backAriaLabel}
          />
        </div>
        {booking ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:mt-1">
            <HeaderActionButton
              type="button"
              variant="neutral"
              onClick={() => setCancelCallDialogOpen(true)}
            >
              Cancel Call
            </HeaderActionButton>
            <HeaderActionButton type="button" variant="error">
              Refund Service Fee
            </HeaderActionButton>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={cancelCallDialogOpen}
        onOpenChange={setCancelCallDialogOpen}
        description="Are you sure you want to cancel the call? The customer receives a full refund."
        onConfirm={() => {
          // TODO: cancel booking via API
        }}
      />

      {errorMessage ? (
        <p className="mb-4 font-satoshi text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {loading ? (
        <BookingDetailsPageSkeleton />
      ) : booking ? (
        <>
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            <div className="flex flex-col gap-0.5">
              <p className="font-satoshi font-bold text-sm text-gray-900">
                ID: {booking.stringId}
              </p>
              {/* <p className="font-satoshi text-xs text-muted-foreground">
                {booking.dateDisplay}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/80">
                {booking.bookingId}
              </p> */}
            </div>
            {booking.status === 'completed' ? (
              <Badge variant="success">{tableStatusLabels.completed}</Badge>
            ) : (
              <TableStatusBadge status={booking.status} />
            )}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailInfoCard
              label="Customer Name"
              value={booking.customerName}
              leading={
                <NameAvatar
                  name={booking.customerName}
                  imageSrc={booking.customerProfilePicture}
                />
              }
            />
            <DetailInfoCard
              label="Customer Email"
              value={booking.customerEmail}
              valueIcon={<Mail aria-hidden />}
            />
            <DetailInfoCard
              label="Stylist Name"
              value={booking.stylistName}
              leading={
                <NameAvatar
                  name={booking.stylistName}
                  imageSrc={booking.stylistProfilePicture}
                />
              }
            />
            <DetailInfoCard
              label="Stylist Email"
              value={booking.stylistEmail}
              valueIcon={<Mail aria-hidden />}
            />
            <DetailInfoCard
              label="Call Duration"
              value={formatDurationLabel(booking.durationLabel)}
              valueIcon={<Clock aria-hidden />}
            />
            <DetailInfoCard
              label="Call Type"
              value={booking.callTypeDisplay}
              valueIcon={<FileText aria-hidden />}
            />
            <DetailInfoCard
              label="Total Cost"
              value={booking.totalCostDisplay}
              valueIcon={<Wallet aria-hidden />}
            />
            <DetailInfoCard
              label="Service Fee"
              value={booking.serviceFeeDisplay}
              valueIcon={<Wallet aria-hidden />}
            />
          </div>

          <div className="flex flex-col gap-4">
            <DetailSectionCard title="Booking Details">
              {booking.bookingDetailsQa.length === 0 ? (
                <p className="font-satoshi text-sm text-muted-foreground">
                  No questionnaire responses for this booking.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {booking.bookingDetailsQa.map((qa, i) => (
                    <li
                      key={`${qa.question}-${i}`}
                      className="border-b border-border-soft pb-4 last:border-b-0 last:pb-0"
                    >
                      <p className="font-satoshi text-sm font-semibold text-gray-900">
                        {qa.question || '—'}
                      </p>
                      <p className="mt-1 font-satoshi text-sm font-normal leading-relaxed text-gray-700">
                        {qa.answer?.trim() ? qa.answer : '—'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </DetailSectionCard>

            {booking.whatYouWillNeedText ? (
              <DetailSectionCard title="What You Will Need">
                <p className="font-satoshi text-sm font-normal leading-relaxed text-gray-700">
                  {booking.whatYouWillNeedText}
                </p>
              </DetailSectionCard>
            ) : null}

            <DetailSectionCard
              title="Rating"
              titleRight={<BookingRatingStars value={booking.rating} />}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <DetailSectionCard title="Public Review">
                <p className="font-satoshi text-sm leading-relaxed">
                  {reviewBody(booking.publicReview)}
                </p>
              </DetailSectionCard>
              <DetailSectionCard title="Private Feedback (Only visible to you)">
                <p className="font-satoshi text-sm leading-relaxed">
                  {reviewBody(booking.privateFeedback)}
                </p>
              </DetailSectionCard>
            </div>
          </div>
        </>
      ) : (
        <p className="font-satoshi text-sm text-black-40">
          No booking found for this id. Open from Booking History or use a valid
          booking id.
        </p>
      )}
    </div>
  )
}
