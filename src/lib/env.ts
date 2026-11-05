import "server-only";
import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  SANITY_API_READ_TOKEN: z.string().optional(),
  SANITY_REVALIDATE_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  QUOTE_TO_EMAIL: z.string().default("ontariomillwright@gmail.com"),
  QUOTE_FROM_EMAIL: z
    .string()
    .default("Ontario Millwright <quotes@ontariomillwright.ca>"),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

export const env = schema.parse(process.env);
