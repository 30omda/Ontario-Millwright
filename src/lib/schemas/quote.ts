import { z } from "zod";

export const URGENCY = ["emergency", "planned", "flexible"] as const;

export const quoteSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(80),
    company: z.string().trim().max(120).optional().or(z.literal("")),
    email: z.email("Please enter a valid email").max(160),
    phone: z.string().trim().max(32).optional().or(z.literal("")),
    serviceId: z.string().trim().max(80).optional().or(z.literal("")),
    customService: z.string().trim().max(120).optional().or(z.literal("")),
    urgency: z.enum(URGENCY, { message: "Pick how urgent the job is" }),
    location: z.string().trim().max(120).optional().or(z.literal("")),
    details: z
      .string()
      .trim()
      .min(20, "Tell us a bit more (at least 20 characters)")
      .max(4000),
    consent: z.literal(true, { message: "Please confirm we can contact you" }),
    turnstileToken: z.string().optional(),
  })
  .refine((v) => Boolean(v.serviceId) !== Boolean(v.customService), {
    path: ["serviceId"],
    message: "Pick a service or add your own",
  });

export type QuoteInput = z.infer<typeof quoteSchema>;

export type QuoteActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof QuoteInput, string>>;
    };
