// Pure helpers (no framework imports) so they can be unit-tested directly.

/** Longest `details` text put in the WhatsApp message; the full text goes by email. CJK chars encode to 9 URL chars each. */
export const MAX_DETAILS = 1000;

/** Click-to-Chat link. Without a message it is a plain chat link. Returns null when no usable number. */
export function buildWhatsAppUrl(number: string | null | undefined, message = ""): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const text = message.trim();
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

export type InquiryInput = {
  name: string;
  email: string;
  phone?: string;
  service: string;
  details: string;
  hasAttachments?: boolean;
};

const orDash = (v: string | undefined) => v?.trim() || "-";

/** English template (the team reads it, same as the quote email). */
export function buildInquiryMessage(i: InquiryInput): string {
  const details = i.details.trim();
  const body =
    details.length > MAX_DETAILS ? `${details.slice(0, MAX_DETAILS).trimEnd()}… (full details sent by email)` : details;
  return [
    "NEW WEBSITE INQUIRY",
    "Ontario Millwright",
    "",
    "CUSTOMER DETAILS",
    "",
    `Name: ${orDash(i.name)}`,
    `Email: ${orDash(i.email)}`,
    `Phone: ${orDash(i.phone)}`,
    "",
    "SERVICE REQUIRED",
    "",
    orDash(i.service),
    "",
    "PROJECT DETAILS",
    "",
    body || "-",
    ...(i.hasAttachments ? ["", "Attachments: sent by email"] : []),
    "",
    "--------------------------------",
    "Source: Ontario Millwright Website",
  ].join("\n");
}
