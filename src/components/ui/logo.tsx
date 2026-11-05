import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-[10px]",
        inverted ? "bg-yellow-500" : "bg-navy-900",
        className,
      )}
    >
      <svg width="20" height="20" viewBox="0 0 28 28" aria-hidden="true">
        <circle
          cx="14"
          cy="14"
          r="10"
          fill="none"
          stroke={inverted ? "#0B2239" : "#FFB81C"}
          strokeWidth="5"
          strokeDasharray="3.5 2.78"
        />
        <circle
          cx="14"
          cy="14"
          r="3.4"
          fill={inverted ? "#0B2239" : "#FFB81C"}
        />
      </svg>
    </span>
  );
}
