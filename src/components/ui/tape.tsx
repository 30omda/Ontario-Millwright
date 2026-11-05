import { cn } from "@/lib/utils";

/** Yellow zig-zag "safety tape" used on the taped Navbar and Footer cards. Hidden below md. */
export function Tape({ side, className, width = 84 }: { side: "left" | "right"; className?: string; width?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={30}
      viewBox="0 0 84 30"
      className={cn(
        "pointer-events-none absolute -top-3 z-10 hidden drop-shadow-[0_2px_2px_rgb(11_34_57/0.18)] md:block",
        side === "left" ? "-left-3 -rotate-[32deg]" : "-right-3 rotate-[32deg]",
        className,
      )}
      data-tape
    >
      <path
        d="M4 3H80L77 7L81 11L77 15L81 19L77 23L80 27H4L7 23L3 19L7 15L3 11L7 7Z"
        fill="#FFB81C"
        fillOpacity="0.92"
      />
      <path d="M8 9H76" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
