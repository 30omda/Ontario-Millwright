import { cn } from "@/lib/utils";

const TEETH = Array.from({ length: 10 }, (_, i) => i * 36);

/** Brand mark: yellow gear around a navy shaft coupling. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <g fill="#FFB81C">
        {TEETH.map((deg) => (
          <rect key={deg} x="41" y="3" width="18" height="16" rx="2" transform={`rotate(${deg} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="38" />
      </g>
      <circle cx="50" cy="50" r="26" fill="#fff" />
      <g fill="#0B2239" stroke="#fff" strokeWidth="2.5" paintOrder="stroke">
        <rect x="1" y="44" width="98" height="12" rx="1.5" />
        <rect x="35" y="39" width="7" height="22" rx="1.5" />
        <rect x="58" y="39" width="7" height="22" rx="1.5" />
        <rect x="42" y="31" width="7.5" height="38" rx="2" />
        <rect x="50.5" y="31" width="7.5" height="38" rx="2" />
      </g>
    </svg>
  );
}

/** Full lockup: mark | ONTARIO / MILLWRIGHT. Scale it with font-size (text-*) on className. */
export function Logo({ className, name = "Ontario Millwright" }: { className?: string; name?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.45em] text-[15px] leading-none", className)}>
      <LogoMark className="size-[2.6em]" />
      <span aria-hidden="true" className="h-[2.3em] w-[0.12em] rounded-full bg-navy-900" />
      <span className="sr-only">{name}</span>
      <span aria-hidden="true" className="flex flex-col items-start font-black tracking-[-0.01em] uppercase">
        <span className="text-[1.18em] text-navy-900">Ontario</span>
        <span className="mt-[0.08em] text-[0.86em] text-yellow-500 [text-shadow:0_0.06em_0_#d99a00,0_0.12em_0_#b37d00,0_0.2em_0.25em_rgb(11_34_57/0.3)]">
          Millwright
        </span>
      </span>
    </span>
  );
}
