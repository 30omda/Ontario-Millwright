import { z } from "zod";

/** Attachments total, kept under Vercel's 4.5 MB request-body cap (also set as serverActions.bodySizeLimit). */
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;

export const URGENCY = ["emergency", "planned", "flexible"] as const;

export const quoteSchema = z
  .object({
    name: z.string().trim().min(2, "nameRequired").max(80, "tooLong"),
    company: z.string().trim().max(120, "tooLong").optional().or(z.literal("")),
    email: z.email("emailInvalid").max(160, "tooLong"),
    phone: z.string().trim().max(32, "tooLong").optional().or(z.literal("")),
    serviceId: z.string().trim().max(80, "tooLong").optional().or(z.literal("")),
    customService: z.string().trim().max(120, "tooLong").optional().or(z.literal("")),
    urgency: z.enum(URGENCY, { message: "urgencyRequired" }),
    location: z.string().trim().max(120, "tooLong").optional().or(z.literal("")),
    details: z.string().trim().min(20, "detailsShort").max(4000, "tooLong"),
    consent: z.literal(true, { message: "consentRequired" }),
    turnstileToken: z.string().optional(),
  })
  .refine((v) => Boolean(v.serviceId) !== Boolean(v.customService), {
    path: ["serviceId"],
    message: "serviceRequired",
  });

export type QuoteInput = z.infer<typeof quoteSchema>;

export type QuoteActionState =
  | { status: "idle" }
  // `message` is a key under messages "quote.result", translated by the caller.
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      values?: Record<string, string | number>;
      fieldErrors?: Partial<Record<keyof QuoteInput, string>>;
    };
