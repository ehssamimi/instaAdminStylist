"use client";

import { useState } from "react";
import { Check, Clock, FileText, Loader2, Mail, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { BookingRatingStars } from "@/components/booking-rating-stars";
import {
  DetailInfoCard,
  DetailSectionCard,
  NameAvatar,
} from "@/components/detail-info-card";
import { HeaderActionButton } from "@/components/header-action-button";
import { BookingDetailsPageSkeleton } from "@/components/booking-details-page-skeleton";
import { PageBackHeading } from "@/components/page-back-heading";
import { Badge } from "@/components/ui/badge";
import { CancelBookingModal } from "@/components/cancel-booking-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  formatBookingStatusLabel,
} from "@/components/ui/table-status-badge";

type BadgeStatusVariant = "success" | "scheduled" | "canceled" | "secondary"

function statusToBadgeVariant(status: string): BadgeStatusVariant {
  const s = status.trim().toLowerCase().replace(/-/g, "_")
  if (s === "completed") return "success"
  if (s === "scheduled") return "scheduled"
  if (s.startsWith("cancel")) return "canceled"
  return "secondary"
}
import { bookingsApi, getApiErrorMessage } from "@/lib/api";
import { formatDurationLabel } from "@/lib/booking-format";
import type { BookingDetailDto } from "@/models/bookings";

type BookingDetailsPageViewProps = {
  booking: BookingDetailDto | null;
  backHref: string;
  backAriaLabel: string;
  loading?: boolean;
  errorMessage?: string | null;
  onRefetch?: () => void;
};

function reviewBody(text: string | null) {
  const t = text?.trim();
  if (!t) {
    return <span className="text-muted-foreground">Not Yet Rated</span>;
  }
  return (
    <span className="font-satoshi text-sm font-normal leading-relaxed text-gray-700">
      {t}
    </span>
  );
}

function canCancelBookingStatus(status: string) {
  const normalizedStatus = status.trim().toLowerCase().replace(/-/g, "_");
  return (
    normalizedStatus === "scheduled" ||
    normalizedStatus === "in_progress" ||
    normalizedStatus === "pending_payment"
  );
}

export function BookingDetailsPageView({
  booking,
  backHref,
  backAriaLabel,
  loading = false,
  errorMessage = null,
  onRefetch,
}: BookingDetailsPageViewProps) {
  const [cancelCallDialogOpen, setCancelCallDialogOpen] = useState(false);
  const [refundServiceFeeDialogOpen, setRefundServiceFeeDialogOpen] =
    useState(false);
  const [cancelledBookingIds, setCancelledBookingIds] = useState<Set<string>>(
    () => new Set()
  );
  const [refundState, setRefundState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const isCanceled =
    booking != null &&
    booking.status.trim().toLowerCase().replace(/-/g, "_").startsWith("cancel");

  const canShowCancelCall =
    booking != null &&
    canCancelBookingStatus(booking.status) &&
    !cancelledBookingIds.has(booking.bookingId);
  const canShowRefundServiceFee =
    booking != null &&
    booking.status.trim().toLowerCase().replace(/-/g, "_") !== "canceled_by_admin";
  const isAlreadyRefunded = booking?.serviceFeeRefundStatus === "refunded";

  async function handleCancelBooking(cancellationReason: string) {
    if (!booking) return;
    try {
      await bookingsApi.cancel(booking.bookingId, cancellationReason || undefined);
      setCancelledBookingIds((current) => {
        const next = new Set(current);
        next.add(booking.bookingId);
        return next;
      });
      toast.success("Booking canceled successfully.");
      onRefetch?.();
    } catch (e) {
      toast.error(getApiErrorMessage(e));
      throw e;
    }
  }

  async function handleRefundServiceFee() {
    if (!booking) return;
    setRefundState("loading");
    try {
      await bookingsApi.refundFees(booking.bookingId);
      setRefundState("success");
      toast.success("Service fee refunded successfully.");
    } catch (e) {
      setRefundState("idle");
      toast.error(getApiErrorMessage(e));
      throw e;
    }
  }

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <div className="mb-4 [&>div]:mb-0">
        <PageBackHeading
          title="Booking Details"
          backHref={backHref}
          backAriaLabel={backAriaLabel}
        />
      </div>

      <CancelBookingModal
        open={cancelCallDialogOpen}
        onOpenChange={setCancelCallDialogOpen}
        onConfirm={handleCancelBooking}
      />

      <ConfirmDialog
        open={refundServiceFeeDialogOpen}
        onOpenChange={setRefundServiceFeeDialogOpen}
        description="Are you sure you want to refund the service fee for this booking?"
        onConfirm={handleRefundServiceFee}
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
          <div className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="font-satoshi text-sm font-bold text-gray-900">
              ID: {booking.stringId}
            </p>
            <Badge variant={statusToBadgeVariant(booking.status)}>
              {formatBookingStatusLabel(booking.status)}
            </Badge>
            <div className="ml-auto flex items-center gap-2">
              {canShowCancelCall ? (
                <HeaderActionButton
                  type="button"
                  variant="neutral"
                  onClick={() => setCancelCallDialogOpen(true)}
                >
                  Cancel Call
                </HeaderActionButton>
              ) : null}
              {canShowRefundServiceFee ? (
                isAlreadyRefunded || refundState === "success" ? (
                  <HeaderActionButton
                    type="button"
                    className="border-success-100 bg-success-200 text-success-600 hover:bg-success-200 hover:border-success-100"
                  >
                    Refund Processing
                    <Check />
                  </HeaderActionButton>
                ) : refundState === "loading" ? (
                  <HeaderActionButton
                    type="button"
                    disabled
                    className="border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-100 hover:border-gray-200"
                  >
                    Refund Processing
                    <Loader2 className="animate-spin" />
                  </HeaderActionButton>
                ) : (
                  <HeaderActionButton
                    type="button"
                    variant="error"
                    onClick={() => setRefundServiceFeeDialogOpen(true)}
                  >
                    Refund Service Fee
                  </HeaderActionButton>
                )
              ) : null}
            </div>
          </div>

          {booking.cancellation != null ? (
            <div className="mb-4 flex items-start gap-2 rounded-xl border-l-4 border-[#FF6467] bg-[#FEF2F2] px-4 py-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF6467]" aria-hidden>
                <X className="size-3 stroke-[2.5] text-white" />
              </span>
                  <div className="flex flex-col gap-1">
                <p className="font-satoshi text-sm font-bold text-[#9F0712]">
                  Cancelled by {booking.cancellation.canceledByName}
                  {booking.cancellation.canceledAt
                    ? ` on ${new Date(booking.cancellation.canceledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                    : ""}
                </p>
                {booking.cancellation.reason ? (
                  <p className="font-satoshi text-sm font-normal text-[#C10007]">
                    {booking.cancellation.reason}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            {booking.bookingDetailsText != null ? (
              <DetailSectionCard title="Booking Details">
                <p className="font-satoshi text-sm font-normal leading-relaxed text-gray-700">
                  {booking.bookingDetailsText}
                </p>
              </DetailSectionCard>
            ) : null}

            {booking.questions.length === 0 ? (
              <DetailSectionCard title="Questions">
                <p className="font-satoshi text-sm text-muted-foreground">
                  No questionnaire responses for this booking.
                </p>
              </DetailSectionCard>
            ) : (
              booking.questions.map((qa, i) => (
                <DetailSectionCard
                  key={`${qa.question}-${i}`}
                  title={qa.question || "—"}
                >
                  <p className="font-satoshi text-sm font-normal leading-relaxed text-gray-700">
                    {qa.answer?.trim() ? qa.answer : "—"}
                  </p>
                </DetailSectionCard>
              ))
            )}

            {booking.whatYouWillNeedText ? (
              <DetailSectionCard title="What You Will Need">
                <p className="font-satoshi text-sm font-normal leading-relaxed text-gray-700">
                  {booking.whatYouWillNeedText}
                </p>
              </DetailSectionCard>
            ) : null}

            {isCanceled ? (
              <>
                <DetailSectionCard title="Rating">
                  <p className="font-satoshi text-sm text-muted-foreground">
                    Not available (canceled booking)
                  </p>
                </DetailSectionCard>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <DetailSectionCard title="Public Review">
                    <p className="font-satoshi text-sm text-muted-foreground">
                      Not available for canceled bookings
                    </p>
                  </DetailSectionCard>
                  <DetailSectionCard title="Private Feedback (Only visible to you)">
                    <p className="font-satoshi text-sm text-muted-foreground">
                      Not Available
                    </p>
                  </DetailSectionCard>
                </div>
              </>
            ) : (
              <>
                <DetailSectionCard
                  title={booking.rating !== null ? "Rating" : "(Not Yet Rated)"}
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
              </>
            )}
          </div>
        </>
      ) : (
        <p className="font-satoshi text-sm text-black-40">
          No booking found for this id. Open from Booking History or use a valid
          booking id.
        </p>
      )}
    </div>
  );
}
