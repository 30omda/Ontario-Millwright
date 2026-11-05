"use server";

import { Resend } from "resend";
import { env } from "@/lib/env";
import { quoteSchema, type QuoteActionState, type QuoteInput } from "@/lib/schemas/quote";

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
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
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken))) {
    return {
      status: "error",
      message: "We couldn't verify you're human. Please try again.",
    };
  }

  const files = formData.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return { status: "error", message: `Attach up to ${MAX_FILES} files.` };
  for (const f of files) {
    if (f.size > MAX_BYTES) return { status: "error", message: `${f.name} is larger than 10 MB.` };
    if (!ALLOWED.includes(f.type)) return { status: "error", message: `${f.name}: use PDF, JPG or PNG.` };
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
    `Location: ${q.location || "-"}`,
    ``,
    q.details,
  ].join("\n");

  if (!env.RESEND_API_KEY) {
    console.info("[quote] RESEND_API_KEY not set; request logged instead of emailed:\n" + text);
    return {
      status: "success",
      message: "Thanks! Your request is in. We'll get back to you shortly.",
    };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
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
      subject: "We received your request · Ontario Millwright",
      text: `Hi ${q.name},\n\nThanks for reaching out. A millwright will review your request and get back to you.\n\nOntario Millwright`,
    });
    return {
      status: "success",
      message: "Thanks! Your request is in. We'll get back to you shortly.",
    };
  } catch (err) {
    console.error("[quote] send failed", err);
    return {
      status: "error",
      message: "Something went wrong sending your request. Please call us instead.",
    };
  }
}
