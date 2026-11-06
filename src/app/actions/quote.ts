"use server";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";
import { MAX_ATTACHMENT_BYTES, MAX_ATTACHMENTS, quoteSchema, type QuoteActionState, type QuoteInput } from "@/lib/schemas/quote";

const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

async function verifyTurnstile(token: string | undefined) {
  if (!env.TURNSTILE_SECRET_KEY) return true; // not configured yet (dev / preview)
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

const URGENCY_LABEL: Record<QuoteInput["urgency"], string> = {
  emergency: "Emergency",
  planned: "Planned shutdown",
  flexible: "Flexible",
};

/** Quote form Server Action: validate → Turnstile → email (Resend) with attachments. */
export async function submitQuote(formData: FormData): Promise<QuoteActionState> {
  const requested = formData.get("locale");
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const raw = Object.fromEntries(
    [
      "name",
      "company",
      "email",
      "phone",
      "serviceId",
      "customService",
      "urgency",
      "location",
      "details",
      "turnstileToken",
    ].map((k) => [k, (formData.get(k) as string | null) ?? ""]),
  );
  const parsed = quoteSchema.safeParse({
    ...raw,
    consent: formData.get("consent") === "true",
  });
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof QuoteInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof QuoteInput;
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "checkFields",
      fieldErrors,
    };
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken))) {
    return {
      status: "error",
      message: "humanCheck",
    };
  }

  const files = formData.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_ATTACHMENTS) return { status: "error", message: "maxFiles", values: { max: MAX_ATTACHMENTS } };
  if (files.reduce((n, f) => n + f.size, 0) > MAX_ATTACHMENT_BYTES) return { status: "error", message: "fileTooLarge" };
  for (const f of files) {
    if (!ALLOWED.includes(f.type)) return { status: "error", message: "fileType", values: { name: f.name } };
  }

  const q = parsed.data;
  const service = q.customService ? `${q.customService} (custom)` : q.serviceId;
  const text = [
    `New quote request`,
    ``,
    `Name: ${q.name}`,
    `Company: ${q.company || "-"}`,
    `Email: ${q.email}`,
    `Phone: ${q.phone || "-"}`,
    `Service: ${service}`,
    `Urgency: ${URGENCY_LABEL[q.urgency]}`,
    `Site language: ${locale}`,
    `Location: ${q.location || "-"}`,
    ``,
    q.details,
  ].join("\n");

  if (!env.RESEND_API_KEY) {
    console.info("[quote] RESEND_API_KEY not set; request not emailed");
    return {
      status: "success",
      message: "success",
    };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    // The team email stays English; only the visitor confirmation is localized.
    const tEmail = await getTranslations({ locale, namespace: "quoteEmail" });
    const attachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()),
      })),
    );
    const { error } = await resend.emails.send({
      from: env.QUOTE_FROM_EMAIL,
      to: env.QUOTE_TO_EMAIL,
      replyTo: q.email,
      subject: `Quote request: ${service}${q.urgency === "emergency" ? " [EMERGENCY]" : ""}`,
      text,
      attachments,
    });
    if (error) throw new Error(error.message);
    await resend.emails.send({
      from: env.QUOTE_FROM_EMAIL,
      to: q.email,
      subject: tEmail("subject"),
      text: tEmail("body", { name: q.name }),
    });
    return {
      status: "success",
      message: "success",
    };
  } catch (err) {
    console.error("[quote] send failed", err);
    return {
      status: "error",
      message: "sendFailed",
    };
  }
}
