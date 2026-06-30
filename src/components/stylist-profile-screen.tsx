"use client";

import { useEffect, useState } from "react";
import { useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

import { BanStylistModal } from "@/components/ban-stylist-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DetailNotFound } from "@/components/detail-not-found";
import { EachContainer } from "@/components/each-container";
import {
  StylistProfileStylingInfoSection,
  normaliseCountryCode,
  type StylistProfileStylingInfoFormValues,
} from "@/components/stylist-profile-styling-info-section";
import { PageBackHeading } from "@/components/page-back-heading";
import { RejectStylistModal } from "@/components/reject-stylist-modal";
import { StylistBookingActivityCard } from "@/components/stylist-booking-activity-card";
import { StylistProfileHeaderActions } from "@/components/stylist-profile-header-actions";
import { StylistProfileHeaderCard } from "@/components/stylist-profile-header-card";
import { StylistProfilePageSkeleton } from "@/components/stylist-profile-page-skeleton";
import { Form, FormField } from "@/components/ui/form";
import { useStylistApproveReject } from "@/hooks/use-stylist-approve-reject";
import { useOnboardingFlow, type SimpleOption } from "@/hooks/use-onboarding-flow";
import { cn } from "@/lib/utils";
import { getApiErrorMessage, stylistsApi } from "@/lib/api";
import type { OnboardingOption } from "@/models/onboardingOptions";
import type { BookingRowDto } from "@/models/bookings";
import {
  getStylistProfileHeaderStats,
  type StylistDetailDto,
  type StylistModerationAuditEntry,
} from "@/models/stylists";

const NO_ONBOARDING_OPTIONS: OnboardingOption[] = [];

type StylingInfoFormValues = StylistProfileStylingInfoFormValues & {
  specialityTags: string[];
  otherSpecialities: string;
  recommendShopIds: string[];
  otherShops: string;
};

const STYLING_INFO_DEFAULTS: StylingInfoFormValues = {
  fullName: "",
  email: "",
  countryCode: "+1",
  phoneNumber: "",
  gender: "",
  businessName: "",
  location: "",
  locationCountryId: "6c959176-b60c-4e11-bbc1-8d679c4becd8",
  locationStateId: "",
  locationCityId: "",
  linkedInUrl: "",
  tiktokHandle: "",
  instagramHandle: "",
  facebookHandle: "",
  yearsExperience: "",
  website: "",
  specialityTags: [],
  otherSpecialities: "",
  recommendShopIds: [],
  otherShops: "",
};

function show(v: string | null | undefined): string {
  return v?.trim() ?? "";
}

function displayNameFromDetail(stylist: StylistDetailDto): string {
  const n = [stylist.first_name, stylist.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return n || "—";
}

function normalizeSpecialityKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function specialityDisplay(row: OnboardingOption): string {
  const t = row.label?.trim();
  return t || row.option;
}

function isInlineSpecialityOption(row: OnboardingOption): boolean {
  const m = row.meta;
  if (
    m &&
    typeof m === "object" &&
    "allowsTextInput" in m &&
    m.allowsTextInput === true
  ) {
    return false;
  }
  return true;
}

function visibleSpecialityRows(rows: OnboardingOption[]): OnboardingOption[] {
  return rows.filter(isInlineSpecialityOption);
}

function matchSpecialityRow(
  rows: OnboardingOption[],
  item: string
): OnboardingOption | undefined {
  const t = item.trim();
  const lower = t.toLowerCase();
  const norm = normalizeSpecialityKey(t);
  const asKey = lower.replace(/\s+/g, "_");

  for (const row of rows) {
    if (row.key) {
      const k = row.key.toLowerCase();
      if (k === lower || k === asKey) return row;
    }
    if (normalizeSpecialityKey(specialityDisplay(row)) === norm) return row;
    if (normalizeSpecialityKey(row.option) === norm) return row;
    if (row.label && normalizeSpecialityKey(row.label) === norm) return row;
  }
  return undefined;
}

function shopFormId(row: OnboardingOption): string {
  return row.key?.trim() ? row.key.toLowerCase() : row.id;
}

/** Map API `recommendShops[].id` values to the same ids used by {@link RecommendedShopsGrid} (via {@link shopFormId}). */
function mapApiShopIdsToGridFormIds(
  apiIds: string[],
  shopRows: OnboardingOption[]
): string[] {
  if (!shopRows.length) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of apiIds) {
    const id = raw?.trim();
    if (!id) continue;
    const row = shopRows.find(
      (s) =>
        s.id === id ||
        (s.key != null &&
          s.key.trim() !== "" &&
          s.key.toLowerCase() === id.toLowerCase())
    );
    if (row) {
      const formId = shopFormId(row);
      if (!seen.has(formId)) {
        seen.add(formId);
        out.push(formId);
      }
    }
  }
  return out;
}

function selectedSpecialityIds(
  selectedLabels: string[],
  rows: OnboardingOption[]
): string[] {
  const visible = visibleSpecialityRows(rows);
  const ids: string[] = [];
  for (const label of selectedLabels) {
    const row = matchSpecialityRow(visible, label);
    if (row?.id && !ids.includes(row.id)) {
      ids.push(row.id);
    }
  }
  return ids;
}

function selectedShopIds(
  selectedIds: string[],
  rows: OnboardingOption[]
): string[] {
  const ids: string[] = [];
  for (const selectedId of selectedIds) {
    const row = rows.find((shop) => shopFormId(shop) === selectedId);
    const id = row?.id ?? selectedId;
    if (id && !ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

function isEmptyDisplayValue(value: string | undefined): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return true;
  if (trimmed === "-" || trimmed === "\u2013" || trimmed === "\u2014") {
    return true;
  }
  return !/[A-Za-z0-9]/.test(trimmed) && trimmed.length <= 8;
}

function shouldShowRejectedState(stylist: StylistDetailDto | null): boolean {
  if (!stylist) return false;
  return (
    stylist.isVerified === false &&
    stylist.verificationStatus?.toUpperCase() === "REJECTED"
  );
}

function appendIfValue(fd: FormData, key: string, value: string | undefined) {
  if (isEmptyDisplayValue(value)) return;
  const trimmed = value?.trim();
  if (trimmed && trimmed !== "â€”") {
    fd.append(key, trimmed);
  }
}


function buildStylistUpdateFormData(
  values: StylingInfoFormValues,
  specialityRows: OnboardingOption[],
  shopRows: OnboardingOption[]
): FormData {
  const fd = new FormData();

  appendIfValue(fd, "fullName", values.fullName);
  appendIfValue(fd, "email", values.email);
  appendIfValue(fd, "countryCode", normaliseCountryCode(values.countryCode));
  appendIfValue(fd, "phoneNumber", values.phoneNumber);
  appendIfValue(fd, "gender", values.gender);
  appendIfValue(fd, "businessName", values.businessName);
  appendIfValue(fd, "countryId", values.locationCountryId);
  appendIfValue(fd, "stateId", values.locationStateId);
  appendIfValue(fd, "cityId", values.locationCityId);
  appendIfValue(fd, "linkedInUrl", values.linkedInUrl);
  appendIfValue(fd, "tiktokHandle", values.tiktokHandle);
  appendIfValue(fd, "instagramHandle", values.instagramHandle);
  appendIfValue(fd, "facebookHandle", values.facebookHandle);
  appendIfValue(fd, "website", values.website);
  appendIfValue(fd, "experience", values.yearsExperience);

  const speciality = selectedSpecialityIds(
    values.specialityTags ?? [],
    specialityRows
  );
  if (speciality.length) {
    fd.append("speciality", speciality.join(","));
  }

  const recommendShops = selectedShopIds(
    values.recommendShopIds ?? [],
    shopRows
  );
  if (recommendShops.length) {
    fd.append("recommendShops", recommendShops.join(","));
  }

  appendIfValue(fd, "otherSpecialities", values.otherSpecialities);
  appendIfValue(fd, "otherShops", values.otherShops);

  return fd;
}

function parseSpecialitySelections(
  rows: OnboardingOption[],
  rawItems: string[]
): {
  specialityTags: string[];
  otherSpecialities: string;
} {
  const raw = rawItems.filter(Boolean);
  const visible = visibleSpecialityRows(rows);
  const tags: string[] = [];
  const other: string[] = [];

  for (const item of raw) {
    const row = matchSpecialityRow(visible, item);
    if (row) {
      const label = specialityDisplay(row);
      if (!tags.includes(label)) tags.push(label);
    } else {
      other.push(item.trim());
    }
  }

  return {
    specialityTags: tags,
    otherSpecialities: other.length ? other.join(", ") : "",
  };
}

function resolveExperienceOptionId(
  raw: string | null | undefined,
  opts: SimpleOption[]
): string {
  const t = raw?.trim() ?? "";
  if (!t) return "";
  // Direct match by id (UUID from API)
  if (opts.some((o) => o.value === t)) return t;
  // Fallback: match by label (old label-based data)
  const lower = t.toLowerCase();
  return opts.find((o) => o.label.toLowerCase() === lower)?.value ?? "";
}

function buildStylingInfoValues(
  stylist: StylistDetailDto,
  specialityRows: OnboardingOption[],
  shopRows: OnboardingOption[],
  experienceOpts: SimpleOption[]
): StylingInfoFormValues {
  const sp = parseSpecialitySelections(
    specialityRows,
    stylist.specialityTags ?? []
  );
  const otherSpecialityParts = [
    sp.otherSpecialities,
    stylist.otherSpecialities?.trim(),
  ].filter(Boolean);
  const otherShopParts = [stylist.otherShops?.trim()].filter(Boolean);

  return {
    fullName: displayNameFromDetail(stylist),
    email: show(stylist.email),
    countryCode: stylist.countryCode ?? "+1",
    phoneNumber: show(stylist.phoneNumber),
    gender: stylist.gender?.trim().toLowerCase() ?? "",
    businessName: show(stylist.businessName),
    location: show(stylist.location),
    locationCountryId: stylist.locationStructured?.countryId ?? "6c959176-b60c-4e11-bbc1-8d679c4becd8",
    locationStateId: stylist.locationStructured?.stateId ?? "",
    locationCityId: stylist.locationStructured?.cityId ?? "",
    linkedInUrl: show(stylist.linkedInUrl),
    tiktokHandle: show(stylist.tiktokHandle),
    instagramHandle: show(stylist.instagramHandle),
    facebookHandle: show(stylist.facebookHandle),
    yearsExperience: resolveExperienceOptionId(stylist.experience, experienceOpts),
    website: show(stylist.website),
    specialityTags: sp.specialityTags,
    otherSpecialities: otherSpecialityParts.length
      ? otherSpecialityParts.join(", ")
      : "—",
    recommendShopIds: mapApiShopIdsToGridFormIds(
      stylist.recommendShopIds ?? [],
      shopRows
    ),
    otherShops: otherShopParts.length ? otherShopParts.join(", ") : "—",
  };
}

function StylingSpecialityTagGrid({
  control,
  options,
  disabled = false,
}: {
  control: Control<StylingInfoFormValues>;
  options: OnboardingOption[];
  disabled?: boolean;
}) {
  const rows = visibleSpecialityRows(options);
  return (
    <FormField
      control={control}
      name="specialityTags"
      render={({ field }) => {
        const selected = new Set(field.value ?? []);
        return (
          <ul
            className="mb-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Styling speciality selections"
          >
            {rows.map((row) => {
              const option = specialityDisplay(row);
              const isOn = selected.has(option);
              const tags = field.value ?? [];
              return (
                <li key={row.id} className="min-w-0">
                  <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={isOn}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-center rounded-lg border border-solid bg-white px-5 py-3 text-center font-satoshi text-base font-bold   transition-[color,border-color] select-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      isOn
                        ? "border-brand-600 text-brand-600"
                        : "border-gray-300 text-gray-500"
                    )}
                    onClick={() => {
                      if (disabled) return;
                      if (tags.includes(option)) {
                        field.onChange(tags.filter((t) => t !== option));
                      } else {
                        field.onChange([...tags, option]);
                      }
                    }}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        );
      }}
    />
  );
}

function RecommendedShopsGrid({
  control,
  shops,
  disabled = false,
}: {
  control: Control<StylingInfoFormValues>;
  shops: OnboardingOption[];
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name="recommendShopIds"
      render={({ field }) => {
        const selected = new Set(field.value ?? []);
        const ids = field.value ?? [];
        return (
          <ul
            className="mb-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-7"
            aria-label="Recommended shops"
          >
            {shops.map((shop) => {
              const id = shopFormId(shop);
              const isOn = selected.has(id);
              const label = shop.option;
              return (
                <li key={shop.id} className="min-w-0">
                  <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={isOn}
                    aria-label={label}
                    className={cn(
                      "flex h-[125px] w-full cursor-pointer items-center justify-center rounded-[8px] px-4 transition-[background-color,border-color]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-buffer-600/35",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      isOn
                        ? "border border-solid border-brand-300 bg-brand-50"
                        : "border border-solid border-[#CECFD2] bg-white"
                    )}
                    onClick={() => {
                      if (disabled) return;
                      if (ids.includes(id)) {
                        field.onChange(ids.filter((v) => v !== id));
                      } else {
                        field.onChange([...ids, id]);
                      }
                    }}
                  >
                    <span className="flex w-full max-w-[7.5rem] flex-col items-center justify-center gap-1">
                      {shop.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={shop.imageUrl}
                          alt=""
                          className="max-h-14 w-auto max-w-full object-contain"
                        />
                      ) : (
                        <span className="px-1 text-center font-satoshi text-xs font-semibold leading-tight text-gray-700">
                          {label}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        );
      }}
    />
  );
}

/** Server-driven booking table from `GET /api/admin/bookings?stylistId=` (dashboard stylist detail). */
export type StylistProfileBookingsFromApi = {
  rows: BookingRowDto[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItemCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  } | null;
  tableLoading: boolean;
};

export type StylistProfileScreenProps = {
  stylistId: string;
  stylist: StylistDetailDto | null;
  backHref: string;
  backAriaLabel?: string;
  loading?: boolean;
  errorMessage?: string | null;
  /** When true, shows booking activity under the profile header (e.g. dashboard stylist detail). */
  showBookingActivityCard?: boolean;
  /**
   * When set, the booking table loads from the admin bookings list filtered by this stylist.
   * When omitted, rows come from `stylist.booking_history` (e.g. applications detail).
   */
  stylistBookingsFromApi?: StylistProfileBookingsFromApi | null;
  /** Called after a successful approve instead of redirecting to backHref. */
  onAfterApprove?: () => void;
  /** Refetch stylist detail after ban/unban or profile update. */
  onRefetch?: () => void;
};

export function StylistProfileScreen({
  stylistId,
  stylist,
  backHref,
  backAriaLabel = "Back",
  loading = false,
  errorMessage = null,
  showBookingActivityCard = false,
  stylistBookingsFromApi = null,
  onAfterApprove,
  onRefetch,
}: StylistProfileScreenProps) {
  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banSubmitting, setBanSubmitting] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState<string | null>(null);
  const [moderationAudit, setModerationAudit] = useState<
    StylistModerationAuditEntry[]
  >([]);
  const [reinstateDialogOpen, setReinstateDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const {
    rejectModalOpen,
    setRejectModalOpen,
    approveSubmitting,
    rejectSubmitting,
    handleApprove,
    handleRejectConfirm,
  } = useStylistApproveReject(stylistId, backHref, onAfterApprove);

  const {
    genderOptions,
    experienceOptions,
    specialityOptions,
    shopOptions,
    isLoading: optionsLoading,
  } = useOnboardingFlow();

  const specialityRows = specialityOptions.length ? specialityOptions : undefined;
  const shopRows = shopOptions.length ? shopOptions : undefined;

  const stylingFormLocked = stylist ? stylist.isVerified !== true : false;
  const showRejectedState = shouldShowRejectedState(stylist);
  const rejectionReason = stylist?.rejectionReason?.trim();
  const showBannedState = Boolean(stylist && isBanned);

  useEffect(() => {
    if (!stylist) {
      setIsBanned(false);
      setBanReason(null);
      return;
    }
    setIsBanned(stylist.accountStatus === "BANNED");
    setBanReason(stylist.banReason?.trim() || null);
  }, [stylist]);

  useEffect(() => {
    if (!stylistId || !stylist?.isVerified) {
      setModerationAudit([]);
      return;
    }

    let cancelled = false;
    void stylistsApi
      .getModerationStatus(stylistId)
      .then((status) => {
        if (cancelled) return;
        setModerationAudit(status.recentAudit ?? []);
        if (status.accountStatus === "BANNED") {
          setIsBanned(true);
          setBanReason(status.banReason?.trim() || null);
        }
      })
      .catch(() => {
        if (!cancelled) setModerationAudit([]);
      });

    return () => {
      cancelled = true;
    };
  }, [stylistId, stylist?.isVerified, stylist?.accountStatus]);

  const actionsDisabled =
    !stylistId ||
    loading ||
    !stylist ||
    approveSubmitting ||
    rejectSubmitting ||
    updateSubmitting;

  const form = useForm<StylingInfoFormValues>({
    defaultValues: STYLING_INFO_DEFAULTS,
  });

  useEffect(() => {
    if (stylist) {
      form.reset(
        buildStylingInfoValues(
          stylist,
          specialityRows ?? NO_ONBOARDING_OPTIONS,
          shopRows ?? NO_ONBOARDING_OPTIONS,
          experienceOptions
        )
      );
    } else {
      form.reset(STYLING_INFO_DEFAULTS);
    }
  }, [stylist, form, specialityRows, shopRows, experienceOptions]);

  const profileSrc = stylist?.profile_picture?.trim();

  async function handleUpdateStylist() {
    if (!stylistId || !stylist || isBanned) return;
    const values = form.getValues();
    if (values.locationStateId && !values.locationCityId) {
      toast.error("Please select a city before updating.");
      return;
    }
    setUpdateSubmitting(true);
    try {
      const fd = buildStylistUpdateFormData(
        form.getValues(),
        specialityRows ?? NO_ONBOARDING_OPTIONS,
        shopRows ?? NO_ONBOARDING_OPTIONS
      );
      await stylistsApi.updateDetails(stylistId, fd);
      toast.success("Stylist profile updated.");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setUpdateSubmitting(false);
    }
  }

  async function handleReinstateConfirm() {
    if (!stylistId) return;
    setBanSubmitting(true);
    try {
      await stylistsApi.unban(stylistId);
      toast.success("Stylist reinstated.");
      setIsBanned(false);
      setBanReason(null);
      onRefetch?.();
      const status = await stylistsApi.getModerationStatus(stylistId);
      setModerationAudit(status.recentAudit ?? []);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
      throw e;
    } finally {
      setBanSubmitting(false);
    }
  }

  async function handleBanConfirm(reason: string) {
    if (!stylistId) return;
    setBanSubmitting(true);
    try {
      const response = await stylistsApi.ban(stylistId, { reason });
      toast.success("Stylist banned.");
      setIsBanned(true);
      setBanReason(response.data.banReason ?? reason);
      const failedCount = response.data.failedCancellations?.length ?? 0;
      if (failedCount > 0) {
        toast.warning(
          `${failedCount} booking cancellation${failedCount === 1 ? "" : "s"} could not be completed.`
        );
      }
      onRefetch?.();
      const status = await stylistsApi.getModerationStatus(stylistId);
      setModerationAudit(status.recentAudit ?? []);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
      throw e;
    } finally {
      setBanSubmitting(false);
    }
  }

  const stylistDisplayName = stylist ? displayNameFromDetail(stylist) : "";

  return (
    <div className="-m-4 min-h-full bg-[#F9F8F3] px-4 py-6 md:-m-10 md:px-10 md:py-8">
      <RejectStylistModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        isSubmitting={rejectSubmitting}
        onConfirm={handleRejectConfirm}
      />

      <BanStylistModal
        open={banModalOpen}
        onOpenChange={setBanModalOpen}
        action="ban"
        onConfirm={handleBanConfirm}
      />

      <ConfirmDialog
        open={reinstateDialogOpen}
        onOpenChange={setReinstateDialogOpen}
        title="Reinstate Stylist?"
        description="Are you sure you want to reinstate this stylist? They will be able to receive bookings again."
        confirmLabel="Yes, Reinstate"
        cancelLabel="Go Back"
        onConfirm={handleReinstateConfirm}
      />

      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove Stylist?"
        description="Are you sure you want to remove this stylist? All existing bookings will be cancelled and users will receive a refund."
        confirmLabel="Remove"
        cancelLabel="Go Back"
        onConfirm={() => setRemoveDialogOpen(false)}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageBackHeading
          title="Stylist Profile"
          backHref={backHref}
          aria-label={backAriaLabel}
        />
        {stylist && !showRejectedState ? (
          <StylistProfileHeaderActions
            loading={loading}
            stylingFormLocked={stylingFormLocked}
            banButton={{
              isBanned,
              disabled: !stylist || loading || banSubmitting,
              onClick: isBanned
                ? () => setReinstateDialogOpen(true)
                : () => setBanModalOpen(true),
              stylistName: stylistDisplayName,
            }}
            removeButton={{
              disabled: !stylist || loading,
              onClick: () => setRemoveDialogOpen(true),
            }}
            updateButton={{
              disabled: !stylist || loading || updateSubmitting || isBanned,
              onClick: () => void handleUpdateStylist(),
            }}
            pendingVerification={{
              rejectDisabled: actionsDisabled,
              approveDisabled: actionsDisabled,
              onReject: () => setRejectModalOpen(true),
              onApprove: handleApprove,
              approveSubmitting,
            }}
          />
        ) : null}
      </div>

      {loading && <StylistProfilePageSkeleton />}

      {!loading && !stylist && (
        <DetailNotFound
          title="Stylist Not Found"
          description="This stylist may have been removed or the ID is invalid."
          errorMessage={errorMessage}
          backHref={backHref}
          backLabel="Back to stylists"
        />
      )}

      {stylist && (
        <>
          <StylistProfileHeaderCard
            imageUrl={profileSrc}
            stylistName={displayNameFromDetail(stylist)}
            stylistEmail={show(stylist.email)}
            activities={[
              {
                label: "Completed bookings",
                value: getStylistProfileHeaderStats(stylist).completedBookings,
              },
              {
                label: "Total Revenue",
                value: getStylistProfileHeaderStats(stylist).totalRevenue,
              },
            ]}
          />
          {showRejectedState ? (
            <div
              className="mb-2 flex items-start gap-3 rounded-lg   border-red-200 border-l-4 border-l-red-500 bg-red-50 px-4 py-3 text-red-600"
              role="alert"
            >
              <CircleX className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0 font-satoshi">
                <p className="text-sm font-bold leading-5">
                  Application Rejected
                </p>
                {rejectionReason ? (
                  <p className="mt-1 text-xs leading-5">{rejectionReason}</p>
                ) : null}
              </div>
            </div>
          ) : null}
          {showBannedState ? (
            <div
              className="mb-2 flex items-start gap-3 rounded-lg border-red-200 border-l-4 border-l-red-500 bg-red-50 px-4 py-3 text-red-600"
              role="alert"
            >
              <CircleX className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0 font-satoshi">
                <p className="text-sm font-bold leading-5">Stylist Banned</p>
                {banReason ? (
                  <p className="mt-1 text-xs leading-5">{banReason}</p>
                ) : null}
              </div>
            </div>
          ) : null}
          {moderationAudit.length > 0 ? (
            <EachContainer title="Moderation History" className="mb-6">
              <ul className="flex max-h-[200px] flex-col gap-3 overflow-y-auto">
                {moderationAudit.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-lg border border-[#E9EAEB] bg-white px-4 py-3 font-satoshi text-sm"
                  >
                    <p className="font-semibold text-[#121417]">
                      {entry.action === "BANNED" ? "Banned" : "Unbanned"}
                    </p>
                    {entry.reason ? (
                      <p className="mt-1 text-xs leading-5 text-[#535862]">
                        {entry.reason}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-[#717680]">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </EachContainer>
          ) : null}
          {showBookingActivityCard ? (
            <StylistBookingActivityCard
              bookings={
                stylistBookingsFromApi
                  ? stylistBookingsFromApi.rows
                  : (stylist.booking_history ?? [])
              }
              stylistId={stylistId}
              serverPagination={Boolean(stylistBookingsFromApi?.pagination)}
              currentPage={stylistBookingsFromApi?.pagination?.currentPage}
              pageSize={stylistBookingsFromApi?.pagination?.pageSize}
              totalPages={stylistBookingsFromApi?.pagination?.totalPages}
              totalItemCount={
                stylistBookingsFromApi?.pagination?.totalItemCount
              }
              onPageChange={stylistBookingsFromApi?.pagination?.onPageChange}
              onPageSizeChange={
                stylistBookingsFromApi?.pagination?.onPageSizeChange
              }
              isLoading={Boolean(stylistBookingsFromApi?.tableLoading)}
            />
          ) : null}

          <Form {...form}>
            <div className="flex flex-col gap-6">
              <StylistProfileStylingInfoSection
                control={form.control}
                disabled={stylingFormLocked || isBanned}
                genderOptions={genderOptions}
                experienceOptions={experienceOptions}
              />

              <EachContainer title="Styling Speciality">
                {optionsLoading &&
                  !(specialityRows && specialityRows.length) && (
                    <p className="mb-4 font-satoshi text-sm text-black-40">
                      Loading speciality options…
                    </p>
                  )}
                <StylingSpecialityTagGrid
                  control={form.control}
                  options={specialityRows ?? NO_ONBOARDING_OPTIONS}
                  disabled={stylingFormLocked || isBanned}
                />
              </EachContainer>

              <EachContainer title="Recommended Shops">
                {optionsLoading && !(shopRows && shopRows.length) && (
                  <p className="mb-4 font-satoshi text-sm text-black-40">
                    Loading shop options…
                  </p>
                )}
                <RecommendedShopsGrid
                  control={form.control}
                  shops={shopRows ?? NO_ONBOARDING_OPTIONS}
                  disabled={stylingFormLocked || isBanned}
                />
              </EachContainer>
            </div>
          </Form>
        </>
      )}
    </div>
  );
}
