/**
 * Styling form editability and profile header actions (Update vs Approve/Reject) follow
 * backend verification. The form is editable only when status is exactly `APPROVED`.
 */
export function isStylistStylingFormLocked(
  verificationStatus: string | null | undefined
): boolean {
  return verificationStatus !== "APPROVED"
}
