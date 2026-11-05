"use client";

import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { ChevronDown, Plus, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type ServiceValue = { serviceId?: string; customService?: string };
type Option = { id: string; title: string };

type Props = {
  options: Option[];
  value: ServiceValue;
  onChange: (v: ServiceValue) => void;
  invalid?: boolean;
  describedBy?: string;
};

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-yellow-200 font-semibold text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/**
 * Creatable combobox (A11): pick one of the services or add a custom one.
 * Built on cmdk (keyboard + ARIA listbox) inside a Radix Popover.
 */
export function ServiceCombobox({ options, value, onChange, invalid, describedBy }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const all = useMemo(() => [...options, { id: "not-sure", title: "Not sure, help me choose" }], [options]);
  const selected = value.serviceId ? all.find((o) => o.id === value.serviceId)?.title : value.customService;
  const exact = all.some((o) => o.title.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="service-combobox-list"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-label="Service needed (required): pick one or type your own"
          className={cn(
            "flex min-h-14 w-full items-center gap-3 rounded-2xl bg-steel-50 px-4 text-left text-base transition-shadow outline-none",
            "focus-visible:shadow-[inset_0_0_0_2px_var(--color-navy-900)]",
            invalid && "shadow-[inset_0_0_0_2px_var(--color-danger)]",
          )}
        >
          <Wrench className="size-5 shrink-0 text-ink-soft" aria-hidden="true" />
          <span className={cn("min-w-0 grow truncate", !selected && "text-ink-soft")}>
            {selected || "Service needed *"}
          </span>
          <AnimatePresence>
            {value.customService ? (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="shrink-0 rounded-full bg-yellow-200 px-2.5 py-1 text-xs font-semibold text-[#5c3d00]"
              >
                Custom service
              </motion.span>
            ) : null}
          </AnimatePresence>
          <ChevronDown
            className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          id="service-combobox-list"
          align="start"
          sideOffset={6}
          className="z-[70] w-(--radix-popover-trigger-width) rounded-[14px] border border-steel-300 bg-white p-1.5 shadow-[0_18px_40px_-18px_rgb(11_34_57/0.35)]"
        >
          <Command shouldFilter label="Services" className="text-[15px] text-navy-900">
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Type to search or add your own…"
              className="mb-1 h-11 w-full rounded-lg border-0 bg-steel-50 px-3 text-base outline-none"
            />
            <Command.List className="max-h-64 overflow-auto">
              {all.map((o) => (
                <Command.Item
                  key={o.id}
                  value={o.title}
                  onSelect={() => {
                    onChange({ serviceId: o.id });
                    setQuery("");
                    setOpen(false);
                  }}
                  className="cursor-pointer rounded-[10px] px-3 py-2.5 data-[selected=true]:bg-steel-50"
                >
                  <Highlight text={o.title} query={query} />
                </Command.Item>
              ))}
              {query.trim() && !exact ? (
                <Command.Item
                  value={`__add__${query}`}
                  forceMount
                  onSelect={() => {
                    onChange({ customService: query.trim() });
                    setQuery("");
                    setOpen(false);
                  }}
                  className="mt-1 flex cursor-pointer items-center gap-2.5 rounded-[10px] border-t border-steel-100 px-3 py-2.5 data-[selected=true]:bg-steel-50"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[22px] items-center justify-center rounded-md bg-yellow-500 font-bold"
                  >
                    <Plus className="size-3.5" />
                  </span>
                  <span>
                    Add “<b className="font-semibold">{query.trim()}</b>” as a custom service
                  </span>
                </Command.Item>
              ) : null}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
