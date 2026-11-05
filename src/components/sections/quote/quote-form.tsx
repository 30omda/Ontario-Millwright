"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "motion/react";
import { Building2, Check, ChevronDown, Clock, Loader2, Mail, MapPin, Paperclip, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { submitQuote } from "@/app/actions/quote";
import { quoteSchema, type QuoteInput } from "@/lib/schemas/quote";
import { cn } from "@/lib/utils";
import { ConsultLink } from "@/components/ui/consult-link";
import { ServiceCombobox } from "./service-combobox";

type Props = {
  services: Array<{ id: string; title: string }>;
  turnstileSiteKey?: string;
  calLink: string;
};

const fieldRow = "relative flex items-center gap-3.5 py-2";
const iconDot =
  "z-[1] flex size-[30px] shrink-0 items-center justify-center rounded-full border border-steel-300 bg-white text-navy-900";
const bareInput =
  "h-10 min-w-0 grow border-0 bg-transparent text-base text-navy-900 outline-none placeholder:text-ink-soft";
const tile = "flex min-h-14 items-center gap-3 rounded-2xl bg-steel-50 px-4";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} role="alert" className="mt-1 text-[13px] font-medium text-danger">
      {msg}
    </p>
  ) : null;
}

export function QuoteForm({ services, turnstileSiteKey, calLink }: Props) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      urgency: "planned",
      serviceId: "",
      customService: "",
      consent: false as unknown as true,
    },
  });

  // Preselect a service from "Request this service" links (?service=id#quote).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("service");
    if (id && services.some((s) => s.id === id)) setValue("serviceId", id);
  }, [services, setValue]);

  const shake = () =>
    formRef.current?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 300, iterations: 1 },
    );

  const onValid = (values: QuoteInput) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.set(k, String(v ?? "")));
    files.forEach((f) => fd.append("attachments", f));
    startTransition(async () => {
      const res = await submitQuote(fd);
      if (res.status === "success") {
        setSent(true);
        toast.success(res.message);
        setTimeout(() => {
          reset();
          setFiles([]);
          setSent(false);
        }, 4000);
      } else if (res.status === "error") {
        Object.entries(res.fieldErrors ?? {}).forEach(([k, m]) => setError(k as keyof QuoteInput, { message: m }));
        toast.error(res.message);
        shake();
      }
    });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => handleSubmit(onValid, () => shake())(e);

  const err = (k: keyof QuoteInput) => errors[k]?.message;
  const serviceId = useWatch({ control, name: "serviceId" });
  const customService = useWatch({ control, name: "customService" });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-3.5" aria-describedby="quote-help">
      <p id="quote-help" className="sr-only">
        Fields marked with an asterisk are required.
      </p>

      {/* Contact group: icons joined by a dashed connector (draws in on reveal) */}
      <fieldset className="relative rounded-[18px] bg-steel-50 px-4 py-1.5">
        <legend className="sr-only">Your contact details</legend>
        <span
          data-connector
          aria-hidden="true"
          className="absolute top-[30px] bottom-[30px] left-[31px] border-l border-dashed border-steel-400"
        />
        {(
          [
            {
              name: "name",
              label: "Full name",
              required: true,
              icon: User,
              type: "text",
              auto: "name",
            },
            {
              name: "company",
              label: "Company",
              required: false,
              icon: Building2,
              type: "text",
              auto: "organization",
            },
            {
              name: "email",
              label: "Work email",
              required: true,
              icon: Mail,
              type: "email",
              auto: "email",
            },
            {
              name: "phone",
              label: "Phone",
              required: false,
              icon: Phone,
              type: "tel",
              auto: "tel",
            },
          ] as const
        ).map((f, i, arr) => (
          <div key={f.name}>
            <label htmlFor={`q-${f.name}`} className={fieldRow}>
              <span data-dot className={iconDot} aria-hidden="true">
                <f.icon className="size-[15px]" />
              </span>
              <span className="sr-only">
                {f.label}
                {f.required ? " (required)" : ""}
              </span>
              <input
                id={`q-${f.name}`}
                type={f.type}
                autoComplete={f.auto}
                placeholder={`${f.label}${f.required ? " *" : ""}`}
                aria-invalid={Boolean(err(f.name)) || undefined}
                aria-describedby={err(f.name) ? `e-${f.name}` : undefined}
                className={bareInput}
                {...register(f.name)}
              />
            </label>
            <div className="pl-11">
              <FieldError id={`e-${f.name}`} msg={err(f.name)} />
            </div>
            {i < arr.length - 1 ? <hr className="ml-11 border-steel-100" /> : null}
          </div>
        ))}
      </fieldset>

      <div>
        <ServiceCombobox
          options={services}
          value={{
            serviceId: serviceId || undefined,
            customService: customService || undefined,
          }}
          onChange={(v) => {
            setValue("serviceId", v.serviceId ?? "", { shouldValidate: true });
            setValue("customService", v.customService ?? "", {
              shouldValidate: true,
            });
          }}
          invalid={Boolean(err("serviceId"))}
          describedBy={err("serviceId") ? "e-serviceId" : undefined}
        />
        <FieldError id="e-serviceId" msg={err("serviceId")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="q-urgency" className={cn(tile, "relative")}>
          <Clock className="size-5 text-ink-soft" aria-hidden="true" />
          <span className="sr-only">How urgent is it? (required)</span>
          <select
            id="q-urgency"
            className="h-13 min-w-0 grow appearance-none bg-transparent text-base outline-none"
            {...register("urgency")}
          >
            <option value="emergency">Emergency</option>
            <option value="planned">Planned shutdown</option>
            <option value="flexible">Flexible</option>
          </select>
          <ChevronDown className="pointer-events-none size-4" aria-hidden="true" />
        </label>
        <label htmlFor="q-location" className={tile}>
          <MapPin className="size-5 text-ink-soft" aria-hidden="true" />
          <span className="sr-only">Facility location</span>
          <input id="q-location" placeholder="City, Ontario" className={bareInput} {...register("location")} />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl bg-steel-50">
        <label htmlFor="q-details" className="block">
          <span className="sr-only">Project details (required)</span>
          <textarea
            id="q-details"
            rows={4}
            placeholder="What are we working on? Equipment, weight, shutdown window, site conditions… *"
            aria-invalid={Boolean(err("details")) || undefined}
            aria-describedby={err("details") ? "e-details" : undefined}
            className="block w-full resize-y border-0 bg-transparent p-4 text-base leading-normal outline-none placeholder:text-ink-soft"
            {...register("details")}
          />
        </label>
        <label
          htmlFor="q-files"
          className="flex cursor-pointer flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-steel-100 px-4 py-3 text-sm text-ink-muted"
        >
          <Paperclip className="size-[18px] text-navy-900" aria-hidden="true" />
          <span className="font-medium text-navy-900">
            {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "Attach photos or drawings"}
          </span>
          <span className="basis-full pl-7 text-[13px] whitespace-nowrap text-ink-soft sm:ml-auto sm:basis-auto sm:pl-0">
            PDF, JPG, PNG · up to 10 MB
          </span>
          <input
            id="q-files"
            type="file"
            multiple
            accept="application/pdf,image/jpeg,image/png"
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
          />
        </label>
      </div>
      <FieldError id="e-details" msg={err("details")} />

      <div>
        <label htmlFor="q-consent" className="flex items-start gap-2.5 text-[13px] text-ink-muted">
          <input id="q-consent" type="checkbox" className="mt-0.5 size-4 accent-navy-900" {...register("consent")} />
          You may contact me about this request (CASL).
        </label>
        <FieldError id="e-consent" msg={err("consent")} />
      </div>

      {turnstileSiteKey ? (
        <Turnstile
          siteKey={turnstileSiteKey}
          options={{ size: "flexible", theme: "light" }}
          onSuccess={(t) => setValue("turnstileToken", t)}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <motion.button
          type="submit"
          disabled={pending || sent}
          layout
          className="inline-flex h-13 items-center gap-2 rounded-full bg-navy-900 px-7 text-base font-semibold text-white disabled:opacity-90"
        >
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2"
              >
                Request sent <Check className="size-4 text-yellow-500" aria-hidden="true" />
              </motion.span>
            ) : pending ? (
              <motion.span
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2"
              >
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Send my request <span className="text-yellow-500">→</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <ConsultLink calLink={calLink} className="text-[15px] text-ink-muted">
          Prefer to talk?{" "}
          <span className="font-semibold text-navy-900 shadow-[inset_0_-2px_0_var(--color-yellow-500)]">
            Book a free consultation →
          </span>
        </ConsultLink>
      </div>
    </form>
  );
}
