import Image from "next/image";
import { useTranslations } from "next-intl";
import logo from "../../../public/brand/logo.png";
import { cn } from "@/lib/utils";

/** Brand lockup (gear | ONTARIO / MILLWRIGHT) with the "Going green" tagline. Size it with a height class. */
export function Logo({ className, name = "Ontario Millwright" }: { className?: string; name?: string }) {
  const t = useTranslations("common");
  return (
    <span className="inline-flex flex-col items-start">
      <Image src={logo} alt={name} priority className={cn("h-12 w-auto sm:h-14", className)} />
      {/* pl-[36%] lines the tagline up under the wordmark, not the gear */}
      <span className="-mt-0.5 w-full pl-[36%] text-[11px] leading-none font-semibold tracking-[0.04em] text-green-700">
        {t("goingGreen")}
      </span>
    </span>
  );
}
