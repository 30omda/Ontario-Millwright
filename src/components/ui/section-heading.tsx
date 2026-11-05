import { cn } from "@/lib/utils";

type Props = {
  as?: "h1" | "h2";
  lead: string;
  accent?: string;
  tail?: string;
  dark?: boolean;
  className?: string;
  id?: string;
};

/** Two-tone heading: same font/weight, accent word in steel (light) or yellow (dark). */
export function SectionHeading({
  as: Tag = "h2",
  lead,
  accent,
  tail,
  dark,
  className,
  id,
}: Props) {
  return (
    <Tag
      id={id}
      data-reveal-heading
      className={cn(
        "text-[36px] leading-[1.02] font-semibold tracking-[-0.04em] md:text-[48px] lg:text-[clamp(40px,5vw,72px)] lg:leading-[0.98] lg:tracking-[-0.05em]",
        dark ? "text-white" : "text-navy-900",
        className,
      )}
    >
      {lead}{" "}
      {accent ? (
        <span className={dark ? "text-yellow-500" : "text-steel-500"}>
          {accent}
        </span>
      ) : null}
      {tail ? <> {tail}</> : null}
    </Tag>
  );
}
